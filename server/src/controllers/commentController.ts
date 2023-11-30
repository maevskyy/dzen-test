import { NextFunction, Request, Response } from "express"
import prisma from "../prisma/client"
import S3 from "../services/awsS3.service";

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}
type TUserData = {
    userName: string,
    email: string,
    text: string,
}

export class CommentController {

    private async createUserWithCommnet (userData: TUserData ) {
        const user = await prisma.user.create({
            data: {
              userName: userData.userName,
              email: userData.email,
            },
          });
        
          const comment = await prisma.comment.create({
            data: {
              text: 'This is a sample comment',
              authorId: user.id, 
            },
          });
    }

    public async createComment(req: Request, res: Response) {
        const files = req.files as MulterFiles
        const userData = JSON.parse(req.body.userData)
        const avatar = files.avatar && files.avatar[0]
        const attachedFile = files.file && files.file[0]

        const aws = new S3()

        try {
            //?this is working!
            // if (avatar) {
            //     const {awsUrl} = await aws.s3Upload(avatar) 
            // }

            if (attachedFile) {
                // const {awsUrl} = await aws.s3Upload(attachedFile)
                
            }

            // const createdUser = await createUser(req, res, userData)
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
            console.log(error)

            res.status(400).json({ error: error, message: 'bad', ok: false })
        }
    }

    public async getAllComments(req: Request, res: Response) {
        try {
            const getAllUsers = await prisma.user.findMany()
            res.status(200).json({ ok: true, message: "all users here", data: getAllUsers })
        } catch (error) {
            res.status(400).json({ error: error, message: 'bad', ok: false })
        }
    }

}
