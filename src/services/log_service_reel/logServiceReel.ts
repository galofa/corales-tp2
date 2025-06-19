import db from '../../db';
import MiError from '../../errors/errors';

class LogServiceReel {
  public async createLog(reelName: string, userId: string, status: string, mensaje:string) {

    try {
      
      const newReelLog = await db.reelsLog.create({
        data:{
          reelName,
          userId,
          status,
          mensaje,
          insertedAt: new Date()
        }
      })
      console.log("Reel Log Agregado a la db: ", newReelLog)      
    }
    catch (err: any){
      console.log("Error al crear el log del reel")
      console.log(err)

      throw new MiError("ReelLogError", "Error al crear un Log de reel", 500);
    }}

    
      
}

export default LogServiceReel;
