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
import LogService from '../services/logs_service/logService';
import {LogStatus} from '../enums/logStatus'



const uploadRouter = Router();
const localStorageService = new LocalStorageService();
const cloudinaryService = new CloudinaryUploadService();
const instagramService = new InstagramUploadService();
const userService = new UserService();
const reelService = new ReelService();

const logServiceReel = new LogServiceReel();
const logService = new LogService();

const handleSubmit = async (req: Request, res: Response) =>{

    try{

        const userId = (req as any).user.id;
        const userName = (req as any).user.name;

        await logService.createLog(LogStatus.INFORMACION, 200, `Usuario ${userName} empezó a subir un reel`);

        const userHasTokens = await userService.hasTokens(userName)
        if (!userHasTokens){
            res.status(402).json({"message": "Pago necesario", "details": "El usuario no tiene tokens suficientes para subir un reel"})
            return
        }
        

        await userService.decreaseTokens(userName);

        await logService.createLog(LogStatus.INFORMACION, 200, `Usuario ${userName} gastó un token`);

        const accessToken = req.headers['instagram-access-token'] as string;
        const igUserId = req.headers['instagram-ig-user-id'] as string;
        const caption = req.headers['caption'] as string;
        const name = req.headers['name'] as string;

        if (!caption || caption.trim() === '' || !name || name.trim() === '') {
            throw new MiError("Campos Faltantes", "Faltan los headers name o caption", 403);
        }

        await logServiceReel.createLogReel(name, userId, 'INICIADO', 'Iniciando Reel')

        const localVideoUrl = await localStorageService.handleUploadFunc(req)

        await logServiceReel.createLogReel(name, userId, 'LOCAL STORAGE', 'Reel subido a local storage')

        const cloudinaryVideoUrl = await cloudinaryService.uploadVideo(localVideoUrl)
        
        await logServiceReel.createLogReel(name, userId, 'CLOUDINARY', 'Reel subido a cloudinary')
        
        const instagramReelResponse = await instagramService.uploadVideo(cloudinaryVideoUrl, caption ,igUserId, accessToken)

        await logServiceReel.createLogReel(name, userId, 'INSTAGRAM', 'Reel subido a Instagram')

        const savedReel = await reelService.createReel(caption, userId, instagramReelResponse.reelUrl);

        await logServiceReel.createLogReel(name, userId, 'BASE DE DATOS', 'Reel Guardado en la base de datos')

        res.status(200).json({"instagramReelData": instagramReelResponse, "cloudinaryData": cloudinaryVideoUrl})
        
        await logService.createLog(LogStatus.INFORMACION, 200, `Usuario ${userName} subió un reel`);
        
    }
    catch(err){
        if (err instanceof MiError){
            res.status(err.estado).json({"message": err.message, "name": err.name})
            await logService.createLog(LogStatus.ERROR, err.estado, err.message);
            return
        }
        else {
            res.status(500).json({"message": "Internal Server error", "details": err})
            await logService.createLog(LogStatus.ERROR, 500, `Internal Server Error`);
            return
        }
    }
    finally{
        console.log("Cerrando Handle Submit")
    }
}
/**
 * @swagger
 * /upload/upload:
 *   post:
 *     summary: Sube un reel a Instagram desde video local
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []  # Esto indica que usa autenticación JWT (token)
 *     parameters:
 *       - in: header
 *         name: instagram-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de acceso de Instagram
 *       - in: header
 *         name: instagram-ig-user-id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario de Instagram
 *       - in: header
 *         name: caption
 *         schema:
 *           type: string
 *         required: true
 *         description: Texto del caption para el reel
 *       - in: header
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del reel
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de video a subir
 *     responses:
 *       200:
 *         description: Reel subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instagramReelData:
 *                   type: object
 *                   description: Datos de respuesta de Instagram
 *                 cloudinaryData:
 *                   type: string
 *                   description: URL del video en Cloudinary
 *       402:
 *         description: Pago necesario (falta tokens)
 *       403:
 *         description: Campos faltantes en headers (caption o name)
 *       401:
 *         description: No autorizado / Token inválido
 *       500:
 *         description: Error interno del servidor
 */

uploadRouter.post('/upload', authenticateToken, handleSubmit)

export default uploadRouter;
