import {Router, Request, Response, NextFunction } from 'express';
const menuRouter = Router()

const menu = (req: Request, res: Response) =>{

    try{
        res
        .status(200)
        .json({
            message: "Hola Maria",
            data:{
                love: true,
                from: "Tito",
                to: "Maria"
            }
        })
    }
    catch(error)
        {
            res
            .status(500)
            .json({ error: "Algo ha salido mal !"})
        }
}
menuRouter.get('/', menu)
export default menuRouter;