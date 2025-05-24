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

    public handleUploadFunc(req: Request): Promise<string> {

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

            resolve(req.file.path)  
            
        })
        })
    }

}

export default LocalStorageService;