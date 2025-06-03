import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import MiError
 from '../errors/errors';
const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
}

export async function arePasswordsEqual(plainPassword:string, hashedPassword:string): Promise<boolean>{
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export async function signJwt(id:string, name:string): Promise<string>{
  const SECRET_KEY = process.env.SECRET_KEY;

        if (!SECRET_KEY) {
            throw new MiError("SECRET KEY ERROR","SECRET_KEY no está definido en las variables de entorno",500)
        }

  const token = jwt.sign(
                  {
                      id: id,
                      name: name,
                  },
                  SECRET_KEY,
                  { expiresIn: "168h" }
              );
  
  return token;
}

export default hashPassword