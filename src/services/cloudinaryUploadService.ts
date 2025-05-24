import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,

})

class CloudinaryUploadService {
    public async uploadVideo(localFilePath: string): Promise<any>{
        try{
            const result = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'video',
                foler: 'videos',
            })
            return result
        }
        catch (error){
            console.log(`Error al subir video a Cloudinary: ${error}`)
        }
    }
}

export default CloudinaryUploadService;