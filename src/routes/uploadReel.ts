import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import LocalStorageService from '../services/videoUploadService';

const uploadRouter = Router();
const localStorageService = new LocalStorageService();

const handleSubmit = async (req: Request, res: Response) =>{

  try{

    localStorageService.handleUpload()
    // cloudianry
    // instagram

  }
  catch(err){
    console.log("error: ", err)
  }

}

uploadRouter.post('/upload', handleSubmit)

export default uploadRouter;
