import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"


export class UserController {
    public async createUser (req: Request, res: Response) {
        const file = req.file
        return console.log(file)
    }
}
