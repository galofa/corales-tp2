import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import LocalStorageService from '../services/videoUploadService';
import MiError from '../errors/errors';
import CloudinaryUploadService from '../services/cloudinaryUploadService';
import InstagramUploadService from '../services/instagramUploadService';
import { authenticateToken } from '../middleware/authMiddleware';
import ReelService from '../services/reel/reelsService';
import UserService from '../services/user/userService';

import LogServiceReel from '../services/log_service_reel/logServiceReel';

const uploadRouter = Router();
const localStorageService = new LocalStorageService();
const cloudinaryService = new CloudinaryUploadService();
const instagramService = new InstagramUploadService();
const userService = new UserService();
const reelService = new ReelService();

const logServiceReel = new LogServiceReel();

const handleSubmit = async (req: Request, res: Response) =>{

    try{

        const userId = (req as any).user.id;
        const userName = (req as any).user.name;


        const userHasTokens = await userService.hasTokens(userName)
        if (!userHasTokens){
            res.status(402).json({"message": "Pago necesario", "details": "El usuario no tiene tokens suficientes para subir un reel"})
        }
        await userService.decreaseTokens(userName);


        const accessToken = req.headers['instagram-access-token'] as string;
        const igUserId = req.headers['instagram-ig-user-id'] as string;
        const caption = req.headers['caption'] as string;
        const name = req.headers['name'] as string;

        if (!caption || caption.trim() === '' || !name || name.trim() === '') {
            throw new MiError("Campos Faltantes", "Faltan los headers name o caption", 403);
        }

        await logServiceReel.createLog(name, userId, 'INICIADO', 'Iniciando Reel')

        const localVideoUrl = await localStorageService.handleUploadFunc(req)

        await logServiceReel.createLog(name, userId, 'Local Storage', 'Reel subido a local storage')

        const cloudinaryVideoUrl = await cloudinaryService.uploadVideo(localVideoUrl)
        
        await logServiceReel.createLog(name, userId, 'Cloudinary', 'Reel subido a cloudinary')
        
        const instagramReelResponse = await instagramService.uploadVideo(cloudinaryVideoUrl, caption ,igUserId, accessToken)

        await logServiceReel.createLog(name, userId, 'Instagram', 'Reel subido a Instagram')

        const savedReel = await reelService.createReel(caption, userId, instagramReelResponse.reelUrl);

        await logServiceReel.createLog(name, userId, 'Base de datos', 'Reel Guardado en la base de datos')

        res.status(200).json({"instagramReelData": instagramReelResponse, "cloudinaryData": cloudinaryVideoUrl})
        
    }
    catch(err){
        if (err instanceof MiError){
            res.status(err.estado).json({"message": err.message, "name": err.name})
            return
        }
        else {
            console.log("EROR", err)
            res.status(500).json({"message": "Internal Server error", "details": err})
            return
        }
    }
    finally{
        console.log("Cerrando Handle Submit")
    }
}

uploadRouter.post('/upload', authenticateToken, handleSubmit)

export default uploadRouter;
