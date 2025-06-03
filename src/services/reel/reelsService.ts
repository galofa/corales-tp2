import db from '../../db';
import MiError from '../../errors/errors';

class ReelService {
    public async createReel(caption: string, authorId: string) {
        try {
            const newReel = await db.reels.create({
                data: {
                    caption,
                    authorId
                }
            });
            console.log("Reel agregado a la DB")
            return newReel;
        } catch (err: any) {
            console.error("Error al crear el reel:", err);

            throw new MiError("DBError", "No se pudo crear el reel", 500);
        }
    }
}

export default ReelService;
