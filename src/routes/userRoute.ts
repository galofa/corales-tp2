import { Router, Request, Response, NextFunction } from 'express';
import MiError from '../errors/errors';
import UserService from '../services/user/userService';
import hashPassword from '../utils/utils';

const userRouter = Router()

const userService = new UserService()

const emailRegex: RegExp = new RegExp(`^(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$`);

const handleRegister = async (req:Request, res:Response) => {

    try {
        
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        if (!name || !email || !password) {
            throw new MiError("Error Campos faltantes", "Todos los campos name, email, password", 400);
        }

        if (!emailRegex.test(email)) {
            throw new MiError("Error Formato Email", "El formato del email es inválido", 400);
        }

        const hashedPassword = await hashPassword(password)

        const userData = await userService.createUser(name, email, hashedPassword)

        res.status(201).json({
            "name": userData.name,
            "email": userData.email,
            "passwordHash":hashedPassword
        })

    }
    catch(err){
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }
    }
}

const handleLogin = async (req: Request, res:Response) => {
    try {
        const name = req.body.name
        const password = req.body.password

        if (!name || !password) {
            
            throw new MiError("Error Campos faltantes", "Todos los campos (name , password) ", 400);
        }

        const login = await userService.loginUser(name, password)

        res.status(201).json({
            "name":"name"
        })
    }

    catch (err){
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }
    }
}

userRouter.post('/register', handleRegister)
userRouter.post('/login', handleLogin)

export default userRouter