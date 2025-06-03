import { resolve } from "path"
import db from "../../db"
import MiError from "../../errors/errors"
import { Prisma } from "@prisma/client"
import { arePasswordsEqual } from "../../utils/utils"
import { signJwt } from "../../utils/utils"

class UserService {

    private async getUserByName(name: string) {
        const user = await db.user.findUnique({
            where: { name }
        });
    
        if (!user) {
            throw new MiError("UserNotFound", `No se encontró un usuario con el nombre: ${name}`, 404);
        }
    
        return user;
    }
    

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

    public async hasTokens(name:string): Promise<boolean> {
        const user = await this.getUserByName(name);
        return user.tokens > 0
    }

    public async decreaseTokens(name:string){
        try {

            const userBefore = await this.getUserByName(name);

            console.log("Tokens antes: ", userBefore.tokens)
            const hasTokens = await this.hasTokens(name)

            if (!hasTokens){
                throw new MiError("SinTokens", "El usuario no tiene tokens disponibles", 400);
            }

            const updatedUser = await db.user.update({
                where: { name },
                data: {
                    tokens: {
                    decrement: 1, 
                    },
                },
                });
            console.log("Token restado ")

            const userAfter = await this.getUserByName(name);
            console.log("User after token: ", userAfter.tokens)

        }
        
        catch(err){
            throw new MiError("Error", "No se pudo restar un token", 500);
        }

    }

    public async addTokens(name:string, amountOfTokens:number){
        try {

            const userBefore = await this.getUserByName(name);
            console.log("User before adding token: ", userBefore.tokens)

            if (amountOfTokens < 1 ){
                throw new MiError("Error", "Se estan agregano tokens negativos", 500);
            }

            const updatedUser = await db.user.update({
                where: { name },
                data: {
                    tokens: {
                    increment: amountOfTokens, 
                    },
                },
                });
            console.log("Token añadido ")
            console.log("bign iga; ", updatedUser)
            console.log("bign iga; ", updatedUser.id)

            const userAfter = await this.getUserByName(name);
            console.log("User after token: ", userAfter.tokens)
        }
        
        catch(err){
            throw new MiError("Error", "No se pudo restar un token", 500);
        }
    }

}

export default UserService