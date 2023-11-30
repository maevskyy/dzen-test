import { Request, Response } from "express"
import prisma from "../prisma/client"
import S3 from "../services/awsS3.service";

//create a types folder fot this
export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

type TUserData = {
    userName: string,
    email: string,
    text: string,
}

type TCommentData = {
    text: string,
    authorId: number,
    file?: string,
    successorId?: number

}

export class CommentController {
    public async createComment(req: Request, res: Response) {
        const files = req.files as MulterFiles;
        const userData = JSON.parse(req.body.userData);
        const avatar = files.avatar && files.avatar[0];
        const attachedFile = files.file && files.file[0];
        //for child comments
        const parentId = userData.parentId; 
    
        const aws = new S3();
    
        try {
            const createUserWithComment = async (userData: TUserData, avatar?: string, file?: string, parentId?: number) => {
                const user = await prisma.user.create({
                    data: {
                        userName: userData.userName,
                        email: userData.email,
                        ...(avatar ? { avatar } : {})
                    },
                });
                const commentData: TCommentData = {
                    text: userData.text,
                    authorId: user.id,
                    ...(file ? { file } : {})
                };
    
                if (parentId) {
                    commentData.successorId = parentId; 
                }
    
                await prisma.comment.create({
                    data: commentData,
                })

               
            }
    
            // check if avatar and file have been passed
            const avatarUploadPromise = avatar ? aws.s3Upload(avatar) : null;
            const fileUploadPromise = attachedFile ? aws.s3Upload(attachedFile) : null;
    
            const [avatarResult, fileResult] = await Promise.all([avatarUploadPromise, fileUploadPromise]);
    
            const avatarUrl = avatarResult ? avatarResult.awsUrl : undefined;
            const fileUrl = fileResult ? fileResult.awsUrl : undefined;
    
            // create comment
            await createUserWithComment(userData, avatarUrl, fileUrl, parentId);
    
            res.status(200).json({ ok: true, message: 'Comment successfully created' })
        } catch (error) {
            res.status(400).json({ ok: false, message: 'Comment not created', error: error })
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
