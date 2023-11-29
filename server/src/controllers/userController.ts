import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"


export class UserController {
    public async createUser (req: Request, res: Response) {
        const file = req.file
        try {
            res.status(200).json({ok: "good"})
        } catch (error) {
            res.status(400).json({error: error, message: 'bad', ok: false})
        }
    }
}
