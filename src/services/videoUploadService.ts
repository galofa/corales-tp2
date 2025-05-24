import express, {Request, Response, RequestHandler, NextFunction} from 'express'
import multer, { StorageEngine } from 'multer'
import path from 'path'

class LocalStorageService {
    private storage: StorageEngine;

    constructor(){
        this.storage = multer.diskStorage({
          destination: (req, file , cb) => {
        cb(null,'uploads/')
    },
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName);
    }  
        })
    }

    public getUploadMulter(){
        return multer({storage : this.storage})
    }

    public handleUpload(): RequestHandler {
        const upload = this.getUploadMulter().single('video')
        
        return (req: Request, res: Response, next: NextFunction): void =>{
            upload(req, res ,(err: any) => {
                
                if (err instanceof multer.MulterError){
                    res.status(400).json({"message": "Error de Multex!"})
                    return;
                }

                if (err){
                    res.status(500).json({"message": "Error Interno"})
                    return;
                }

                if (!req.file) {
                    res.status(400).json({ message: 'No se recibió ningún archivo.' });
                    return;
                }
                
                res.status(200).json({
                    message: 'Video recibido correctamente.',
                    filename: req.file.filename,
                    path: req.file.path
                })
            })
        }
    }
}

export default LocalStorageService;