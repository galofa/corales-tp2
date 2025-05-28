import { Router, Request, Response, NextFunction } from 'express';
import MiError from '../errors/errors';
import UserService from '../services/user/userService';

const userRouter = Router()

const userService = new UserService()

const handleCreateUser = async (req:Request, res:Response) => {
    
    
    try {
        
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        if (!name || !email || !password) {
            throw new MiError("Error Campos faltantes", "Todos los campos name, email, password", 400);
        }

        const userData = await userService.createUser(name,email,password)
        
        res.status(201).json({
            "name": userData.name,
            "email": userData.email,
            "passwordHas":userData.passwordHash
        })
        
    }
    catch(err){
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }

    }
}

userRouter.post('/register', handleCreateUser)

export default userRouter