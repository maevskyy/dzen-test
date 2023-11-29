import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export class CommentController {
    public async createComment(req: Request, res: Response) {
        const files = req.files as MulterFiles
        const avatar = files.avatar[0]
        const attachedFile = files.file[0]
        const limitOfTXT = 100 * 1024
        const requiredFields = ['userName', 'email', 'text'];
        const userData = JSON.parse(req.body.userData)


        //?improve it
        //this is limit for txt files, but i think i could do it in multer
        if (attachedFile.mimetype === 'text/plain') {
            if (attachedFile.size > limitOfTXT) {
                return res.status(400).json({ ok: false, message: 'File limit reached' })
            }
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ ok: false, message: "Give me some body pls" })
        }
        //?check if all fields alright (make it middlware )
        for (const field of requiredFields) {
            if (!(field in userData)) {
                return res.status(400).json({ ok: false, message: `Missing required field: ${requiredFields}` });
            }
        }


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
