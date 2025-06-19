import db from '../../db';
import MiError from '../../errors/errors';

class LogService {
  public async createLog(tipoLog: string, statusCode: number, mensaje: string) {

    try {
      
      const newLog = await db.logs.create({
        data:{
          tipoLog,
          statusCode,
          mensaje,
          insertedAt: new Date()
        }
      })
      console.log("Reel Log Agregado a la db: ", newLog)      
    }
    catch (err: any){
      console.log("Error al crear el log del reel")
      console.log(err)

      throw new MiError("ReelLogError", "Error al crear un Log de reel", 500);
    }}     
}
export default LogService;
