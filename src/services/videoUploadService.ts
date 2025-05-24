import express, {Request, Response, RequestHandler, NextFunction} from 'express'
import multer, { StorageEngine } from 'multer'
import path from 'path'
import MiError from '../errors/errors';


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

    public handleUploadFunc(req: Request): Promise<void> {

        const upload = this.getUploadMulter().single('video')

        return new Promise((resolve, reject)=>{
            upload(req , {} as Response, (err:any)=>{ 
            //La request para obtener los datos del upload
            // {} una response mockeada
            // err 

            if (req.file?.mimetype !== 'video/mp4' ){
                return reject(new MiError('FileError', 'Error, el video debe ser un mp4', 400))
            }
            
            

            if (err instanceof multer.MulterError){
                return reject(new MiError('MulterError', 'Error al subir archivo', 400))
            }
            resolve()  
            })
        })
    }

   

    public handleUpload(): RequestHandler {
        const upload = this.getUploadMulter().single('video')
        
        return (req: Request, res: Response, next: NextFunction): void => {
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