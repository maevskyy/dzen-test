import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"
import { createUser } from "../services/createComment.service";

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export class CommentController {
    public async createComment(req: Request, res: Response) {
        const files = req.files as MulterFiles
        const userData = JSON.parse(req.body.userData)

        try {
            const createdUser = await createUser(req, res, userData)
            // const createUser = await prisma.user.create({ data: { userName: userData.userName, email: userData.email } })

            // const comment = await prisma.comment.create({
            //     data: {
            //         text: userData.text,
            //         home_page: 'example.com',
            //         authorId: createUser.id,
            //     },
            // });


            res.status(200).json({ ok: "good" })
        } catch (error) {
            res.status(400).json({ error: error, message: 'bad', ok: false })
        }
    }

    public async getAllComments (req: Request, res: Response) {
        try {
            const getAllUsers = await prisma.user.findMany()
            res.status(200).json({ok: true, message: "all users here", data: getAllUsers})
        } catch (error) {
            res.status(400).json({ error: error, message: 'bad', ok: false })
        }
    }

}
