import db from '../../db';
import MiError from '../../errors/errors';

class ReelService {
    public async createReel(caption: string, authorId: string, reelurl: string) {
        try {
            const newReel = await db.reels.create({
                data: {
                    caption,
                    authorId,
                    reelurl
                }
            });
            console.log("Reel agregado a la DB")
            return newReel;
        } catch (err: any) {
            console.error("Error al crear el reel:", err);
            throw new MiError("DBError", "No se pudo crear el reel", 500);
        }
    }

    public async getReelsFromUser(userName: string) {
        try {
          const user = await db.user.findUnique({
            where: { name: userName },
            include: { reels: true }, // ← esto trae los reels asociados
          });
      
          if (!user) {
            throw new MiError("UsuarioNoEncontrado", `No se encontró el usuario ${userName}`, 404);
          }
      
          return user.reels; 
        } catch (err) {
          console.error("Error al obtener reels del usuario:", err);
          throw new MiError("ErrorGetReels", "No se pudieron obtener los reels del usuario", 500);
        }
      }
      
}

export default ReelService;
