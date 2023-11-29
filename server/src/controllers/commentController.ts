import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
  }

export class CommentController {
    public async createComment (req: Request, res: Response) {
        const files = req.files as MulterFiles
        const avatar = files.avatar[0]
        const attachedFile = files.file[0]
        const limitOfTXT = 100 * 1024
        
        //?improve it
        //this is limit for txt files, but i think i could do it in multer
        if (attachedFile.mimetype === 'text/plain') {
            if (attachedFile.size > limitOfTXT) {
                return res.status(400).json({ok: false, message: 'File limit reached'})
            }
        }
                

        try {
            res.status(200).json({ok: "good"})
        } catch (error) {
            res.status(400).json({error: error, message: 'bad', ok: false})
        }
    }
}
