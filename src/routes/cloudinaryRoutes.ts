import { Router, Request, Response, NextFunction } from 'express';
import upload from '../controllers/videoUploadController';
import multer from 'multer';

const cloudinaryRouter = Router();

cloudinaryRouter.post(
  '/upload',
  (req: Request, res: Response, next: NextFunction): void => {
    upload.single('video')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {

        if (err.code == "LIMIT_UNEXPECTED_FILE"){
        return res.status(400).json({"message": "Error! Body incorrecto al subir el archivo."});
        }        
      }

      if (err) {
      return res.status(500).json({ "message": 'Error inesperado al subir el archivo.' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No se recibió ningún archivo.' });
      }

      res.status(200).json({
        message: 'Video recibido correctamente.',
        filename: req.file.filename,
        path: req.file.path
      });
    });
  }
);

export default cloudinaryRouter;
