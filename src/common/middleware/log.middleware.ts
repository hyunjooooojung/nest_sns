import { NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { Request, Response } from "express";

export class LogMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        console.log(`[REQUEST] ${req.method} ${req.url} ${new Date().toLocaleString('kr')}`);
        next();
    }
}