import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,

})

class CloudinaryUploadService { 
    
    public async uploadVideo(videoPath:string): Promise<string>{

        return new Promise((resolve, reject)=>{
            
            cloudinary.uploader.upload(
                videoPath,
                {
                  resource_type: 'video',
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                  if (error) {
                    return reject(error);
                  }
                  if (!result) {
                    return reject(new Error('No se recibió respuesta de Cloudinary'));
                  }
                  resolve(result.secure_url);
                }
              );
              



        })
    }
}


export default CloudinaryUploadService;