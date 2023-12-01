import { Request, Response } from "express"
import prisma from "../prisma/client"
import S3 from "../services/awsS3.service";
import { createUserWithComment, formatCommentForClient3 } from "../services/createComment.service";

import { ioSocket } from "..";

//create a types folder fot this
export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
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
        // const io = this.io; 

        try {
            // check if avatar and file have been passed
            const avatarUploadPromise = avatar ? aws.s3Upload(avatar) : null;
            const fileUploadPromise = attachedFile ? aws.s3Upload(attachedFile) : null;

            const [avatarResult, fileResult] = await Promise.all([avatarUploadPromise, fileUploadPromise]);

            const avatarUrl = avatarResult ? avatarResult.awsUrl : undefined;
            const fileUrl = fileResult ? fileResult.awsUrl : undefined;
            
            // create comment
            const createdComment = await createUserWithComment(userData, avatarUrl, fileUrl, parentId);
            //send new comment to the user                        

            ioSocket.emit('updatedComments', createdComment);

            res.status(200).json({ ok: true, message: 'Comment successfully created' })
        } catch (error) {
            console.log(error)
            res.status(400).json({ ok: false, message: 'Comment not created', error: error })
        }
    }


    public async getAllComments(req: Request, res: Response) {

        try {
            //this is for paggination
            const { page = 1, pageSize = 20, authorName, authorEmail } = req.query;
            const skip = (Number(page) - 1) * Number(pageSize);


            //!type fix
            //this is for sort by author and email
            const whereClause: any = {};
            if (authorName) {
                whereClause.author = { userName: {startsWith: authorName.toString().toLowerCase()} };
            }
            if (authorEmail) {
                whereClause.author = { email: {startsWith: authorEmail.toString().toLowerCase()} };
            }
            
            

            const allComments = await prisma.comment.findMany({
                take: pageSize as number,
                skip: skip,
                where: whereClause,

            })
            
            const formatComments = await formatCommentForClient3(allComments)

            res.status(200).json({ ok: true, message: "All comments", data: formatComments })
        } catch (error) {
            res.status(400).json({ ok: false, message: 'Cannot get comments', error: error })
        }
    }

}
