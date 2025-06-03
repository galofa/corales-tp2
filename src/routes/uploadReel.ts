import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import LocalStorageService from '../services/videoUploadService';
import MiError from '../errors/errors';
import CloudinaryUploadService from '../services/cloudinaryUploadService';
import InstagramUploadService from '../services/instagramUploadService';
import { authenticateToken } from '../middleware/authMiddleware';
import ReelService from '../services/reel/reelsService';
import UserService from '../services/user/userService';

const uploadRouter = Router();
const localStorageService = new LocalStorageService();
const cloudinaryService = new CloudinaryUploadService();
const instagramService = new InstagramUploadService();
const userService = new UserService();
const reelService = new ReelService();

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

    const localVideoUrl = await localStorageService.handleUploadFunc(req)
    const cloudinaryVideoUrl = await cloudinaryService.uploadVideo(localVideoUrl)
    //const instagramReelResponse = await instagramService.uploadVideo(cloudinaryVideoUrl, caption ,igUserId, accessToken)
    const instagramReelResponse = "DEVELOPLMENT MODE NO REELS WAS UPLOADED!!!!"
    const savedReel = await reelService.createReel(caption, userId, instagramReelResponse);

    res.status(200).json({"instagramReelData": instagramReelResponse, "cloudinaryData": cloudinaryVideoUrl} )

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
