import axios from 'axios';

class InstagramUploadService {
  private async waitForMediaProcessing(
    creationId: string,
    accessToken: string,
    maxRetries = 10,
    intervalMs = 10000
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const statusResponse = await axios.get(
          `https://graph.facebook.com/v19.0/${creationId}`,
          {
            params: {
              fields: 'status_code',
              access_token: accessToken,
            },
          }
        );

        const status = statusResponse.data.status_code;
        console.log(`Intento ${i + 1}: estado del media = ${status}`);

        if (status === 'FINISHED') {
          return true; 
        } else if (status === 'ERROR') {
          throw new Error('Error en el procesamiento del media');
        }
      } catch (error) {
        console.error('Error verificando el estado del media:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    return false; 
  }

  public async uploadVideo(
    videoUrl: string,
    caption: string,
    igUserId: string,
    accessToken: string
  ): Promise<{
    message: string;
    reelUrl: string;
    mediaUrl:string;
  }> {
    try {
      const createUrl = `https://graph.facebook.com/v19.0/${igUserId}/media`;

      const createResponse = await axios.post(createUrl, null, {
        params: {
          media_type: 'REELS',
          video_url: videoUrl,
          caption,
          access_token: accessToken,
        },
      });

      const creationId = createResponse.data.id;

      if (!creationId) {
        throw new Error('No se obtuvo el creation_id');
      }

      const ready = await this.waitForMediaProcessing(creationId, accessToken);

      if (!ready) {
        throw new Error('Timeout esperando que el video termine de procesarse');
      }

      const publishUrl = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
      const publishResponse = await axios.post(publishUrl, null, {
        params: {
          creation_id: creationId,
          access_token: accessToken,
        },
      });

      const publishedMediaId = publishResponse.data.id;

    if (!publishedMediaId) {
        throw new Error('No se obtuvo el ID de publicación');
    }

    const detailsResponse = await axios.get(
        `https://graph.facebook.com/v19.0/${publishedMediaId}`,
        {
          params: {
            fields: 'id,permalink,media_url,timestamp',
            access_token: accessToken,
          },
        }
      );
      
      console.log('Detalles del reel publicado:', detailsResponse.data);

    return {
        message: 'Video subido exitosamente a Instagram',
        reelUrl: detailsResponse.data.permalink,
        mediaUrl: detailsResponse.data.media_url,
    };
      
    } catch (err: any) {
      console.error('Error al subir el video a Instagram:', err.message || err);
      throw err;
    }
  }
}

export default InstagramUploadService;
