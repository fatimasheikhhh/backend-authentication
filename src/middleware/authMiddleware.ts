import {Request, Response, NextFunction} from 'express';
export async function validateResponse(req: Request, res: Response, next: NextFunction){
    if(!req.session.user){
        return res.status(401).json({message:'Unauthorized, Please log in first'});
    }
    next();
}