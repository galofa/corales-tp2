import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
export async function hashPassword(plainPassword: string): Promise<string> {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
}

export async function arePasswordsEqual(plainPassword:string, hashedPassword:string): Promise<boolean>{
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export default hashPassword