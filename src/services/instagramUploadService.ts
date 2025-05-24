import axios from 'axios';



class InstagramUploadService { 
    
    public async uploadVideo(videoUrl:string, caption:string, igUserId:string, accessToken:string): Promise<string>{

        return new Promise((resolve, reject)=>{

            const url=`https://graph.facebook.com/v19.0/${igUserId}/media`
            const payload={
                "media_type": "REELS",
                "video_url": videoUrl,
                "caption": caption,
                "access_token": accessToken
            }

            axios.post(url,null,{
                params: {
                  media_type: 'REELS',
                  video_url: videoUrl,
                  caption: caption,
                  access_token: accessToken
                }
                }
            )




        })
    }
}


export default InstagramUploadService;