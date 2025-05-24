import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import LocalStorageService from '../services/videoUploadService';
import MiError from '../errors/errors';

const uploadRouter = Router();
const localStorageService = new LocalStorageService();

const handleSubmit = async (req: Request, res: Response) =>{

  try{

   // localStorageService.handleUpload()
    await localStorageService.handleUploadFunc(req)
    // cloudianry
    // instagram

  }
  catch(err){
    if (err instanceof MiError){
      res.status(err.estado).json({"message": err.message, "name": err.name})
      return
    }
  }

  res.status(200).json({"message": "reel subido correctamente"})

  

}

uploadRouter.post('/upload', handleSubmit)

export default uploadRouter;
