import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY no está definida en las variables de entorno");
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; 

    if (!token) {
        res.status(401).json({ message: 'No se proporciono un token valido' });
        return
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'El token es invalido o expirado' });
            return 
        }

        // @ts-ignore
        req.user = user;
        next();
    });
};
