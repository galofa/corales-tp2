import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import LocalStorageService from '../services/videoUploadService';
import MiError from '../errors/errors';
import CloudinaryUploadService from '../services/cloudinaryUploadService';
import InstagramUploadService from '../services/instagramUploadService';

const uploadRouter = Router();
const localStorageService = new LocalStorageService();
const cloudinaryService = new CloudinaryUploadService();
const instagramService = new InstagramUploadService();

const handleSubmit = async (req: Request, res: Response) =>{

  try{

    // Crear una tabla "PROCESOS"
    // En la tabla procseos se hace un insert de los distintos estados por los que pasa el video.
    // Entonces quedaria algo como:
    // Video de id: 

    // ID         PASO N°        PROCESO                            TIPO
    // 1818181    1              NO INICIADO                        INFORMACION / ADVERTENCIA -> Cliente / ERROR -> Servidor
    // 1818181    2              SUBIDIO A LOCALSTORAGE
    // 1818181    3              SUBIDO A CLOUDINARY
    // 1818181    4              FALLO EN SUBIR A INSTAGRAM

    // crear un registro de sumbit con estado "PROCESSING"
    const localVideoUrl = await localStorageService.handleUploadFunc(req)
    //Cambio el estado a "SUBIDO LOCAL" / creo nuevo registro con nuevo estado
    const cloudinaryVideoUrl = await cloudinaryService.uploadVideo(localVideoUrl)
    // instagram
    const instagramReelResponse = await instagramService.uploadVideo(cloudinaryVideoUrl, "beautiful caption","17841470913286962", "EAAGWJid49DoBOZBBSCKX2pPNpkYpemcOlNvKprea0fZC9Wzj3YZCvK1ZBrMit5iFm3jGCbZAJI0E10PvE4X8GD0kWARAcUpaVgYO2hokYVloZBGkOz1LOtDzDgRoYluA5dCnHwIMdZCAlhcvce1ZB7JvWyKSEuIpa1DqZCELKONPB5yn7pZADoFuF54Ae5Mu0V31pg")
    
    res.status(200).json({"instagramReelData": instagramReelResponse, "cloudinaryData": cloudinaryVideoUrl} )

  }
  catch(err){
    // Si falla, le cambio el estado a "FAILED" y le pongo mensaje de error, etc. 
    if (err instanceof MiError){
      res.status(err.estado).json({"message": err.message, "name": err.name})
      return
    }
    else {

    }
  }
  finally{
    console.log("Cerrando Handle Submit")
  }


  

}

uploadRouter.post('/upload', handleSubmit)

export default uploadRouter;
