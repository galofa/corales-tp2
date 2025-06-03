import { Router, Request, Response, NextFunction } from 'express';
import MiError from '../errors/errors';
import UserService from '../services/user/userService';
import hashPassword from '../utils/utils';
import { authenticateToken } from '../middleware/authMiddleware';
import ReelService from '../services/reel/reelsService';
const userRouter = Router()

const userService = new UserService()
const reelService = new ReelService()

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
            "token": userData.token
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
            "name": login.name,
            "token": login.token
        })
    }

    catch (err){
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }
    }
}

const handleAddTokens = async(req: Request, res: Response) =>
    {
    try{
        const userName = (req as any).user.name;
        const amountOfTokens = req.body.amountOfTokens

        console.log("amountOfTokens: ", amountOfTokens)

        if (typeof amountOfTokens !== "number" || isNaN(amountOfTokens) || amountOfTokens < 1) {
            throw new MiError(
                "CamposInvalidos",
                "Debes enviar amountOfTokens numérico mayor a 0 en el body",
                400
            );
        }

        await userService.addTokens(userName, amountOfTokens)
        
        res.status(201).json({
            "mensaje":"Nuevos tokens agregados",
            "name": userName,
            "token": amountOfTokens
        })
            
    }
    catch(err)
    {
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }
        else{
            res.status(500).json({"name": "Error interno", "message": "Hubo un error interno al agregar el token"})  
        }
    }
}

const handleGetReels = async(req:Request, res:Response) => {
    
    try{
        const userName = (req as any).user.name;
        const reels = await reelService.getReelsFromUser(userName)
        
        res.status(201).json({
            "name": userName,
            "reels": reels
        })


    }
    catch(err) {
        
        if (err instanceof MiError){
            res.status(err.estado).json({"name": err.name, "message": err.message})  
        }
        
        else{
            res.status(500).json({"name": "Error interno", "message": "Hubo un error interno al agregar el token"})  
        }

    }
}

userRouter.post('/register', handleRegister)
userRouter.post('/login', handleLogin)
userRouter.post('/add-tokens', authenticateToken, handleAddTokens)
userRouter.get('/mis-reels', authenticateToken, handleGetReels)

export default userRouter