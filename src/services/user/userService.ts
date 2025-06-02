import { resolve } from "path"
import db from "../../db"
import MiError from "../../errors/errors"
import { Prisma } from "@prisma/client"
import { arePasswordsEqual } from "../../utils/utils"
import { signJwt } from "../../utils/utils"

class UserService {

    public async createUser(name: string, email: string, password: string): Promise<{ name: string, token: string }> {

        try {
            const user = await db.user.create({

                data: {
                    name: name,
                    email: email,
                    passwordHash: password
                }
            })

            const token = await signJwt(user.id, user.name);

            return {
                name: name,
                token: token
            }
        }
        catch (err: any) {

            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new MiError("DuplicatedEmail", "Ya existe un usuario con ese email", 400);
                }
                throw new MiError("PrismaError", `Error en la base de datos: ${err.message}`, 500);
            }

            throw new MiError("Error Inesperado", "Error inesperado al iniciar registrar usuario", 500)

        }
    }

    public async loginUser(name: string, password: string): Promise<{ name: string , token:string }> {


        try {

            const user = await db.user.findUnique({
                where: {
                    name: name,
                },

            })

            if (user === null) {
                throw new MiError("Error Null", "El usuario no se encontro en la db", 500)
            }
            else {
                const samePassword = await arePasswordsEqual(password, user.passwordHash)
                console.log("same password: ", samePassword)
            }

            const token = await signJwt(user.id,user.name);
            return { name: user.name, token: token }

        }
        catch (err: any) {

            throw new MiError("Error Inesperado", "Error inesperado al iniciar registrar usuario", 500)

        }

    }

}

export default UserService