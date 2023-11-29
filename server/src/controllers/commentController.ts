import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export class CommentController {
    public async createComment(req: Request, res: Response) {
        const files = req.files as MulterFiles
        const userData = JSON.parse(req.body.userData)

        try {

            const createUser = await prisma.user.create({ data: { userName: userData.userName, email: userData.email } })

            const comment = await prisma.comment.create({
                data: {
                    text: userData.text,
                    home_page: 'example.com',
                    authorId: createUser.id,
                },
            });


            res.status(200).json({ ok: "good" })
        } catch (error) {
            res.status(400).json({ error: error, message: 'bad', ok: false })
        }
    }
}
