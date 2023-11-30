import { Request, Response, NextFunction } from 'express'
import sharp from 'sharp';

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

class CommnetValidation {
    private async resizePhoto(buffer: Buffer, maxWidth: number, maxHeight: number, res: Response) {
        try {
            const { width, height } = await sharp(buffer).metadata() as { width: number, height: number };

            // new relations for image sides
            const aspectRatio = width / height;
            let newWidth = maxWidth;
            let newHeight = newWidth / aspectRatio;

            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = newHeight * aspectRatio;
            }

            const resizedBuffer = await sharp(buffer).resize(Math.round(newWidth), Math.round(newHeight)).toBuffer();
            return resizedBuffer;
        } catch (error) {
            res.status(400).json({ ok: false, message: "Cannot resize this image" });
            throw error;
        }
    }

    public async avatarValidation(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as MulterFiles;
            const avatar = files.avatar && files.avatar[0]

            if (avatar) {
                if (avatar.mimetype.split('/')[0] === 'image') {
                    avatar.buffer = await this.resizePhoto(avatar.buffer, 320, 240, res)
                }
                if (avatar.mimetype.split('/')[0] !== 'image') {
                    return res.status(400).json({ ok: false, message: "Avatar must be an image" })
                }
            }

            next()

        } catch (error) {
            res.status(400).json({ ok: false, message: 'Avatar validation error', error })
        }
    }

    public async userDataValidation(req: Request, res: Response, next: NextFunction) {
        const requiredFields: string[] = ['userName', 'email', 'text']
        try {
            const userData = JSON.parse(req.body.userData);

            for (const field of requiredFields) {
                if (!(field in userData)) {
                    return res.status(400).json({ ok: false, message: `Missing required field: ${requiredFields}` });
                }
            }

            next()
        } catch (error) {
            //in case if body is empty
            res.status(400).json({ ok: false, message: `Missing required userData fields is: ${requiredFields}` })
        }
    }

    public async fileValidation(req: Request, res: Response, next: NextFunction) {
        //100kb
        const limitOfTXT: number = 100 * 1024
        try {
            const files = req.files as MulterFiles;
            const attachedFile = files.file && files.file[0]

            if (attachedFile) {
                const isImage = attachedFile.mimetype.split('/')[0] === 'image'
                const isFile = attachedFile.mimetype.split('/')[0] === 'text'
                if (isImage) {
                    attachedFile.buffer = await this.resizePhoto(attachedFile.buffer, 320, 240, res)
                }
                if (isFile) {
                    //this probably shoudl be in multer
                    if (attachedFile.size > limitOfTXT) {
                        return res.status(400).json({ ok: false, message: 'Maximum limit for .txt files is 100kb' })
                    }
                }
            }

            next()
        } catch (error) {
            res.status(400).json({ ok: false, message: 'File validation error' })
        }
    }
}

const validationInstance = new CommnetValidation()
export const avatarValidation = validationInstance.avatarValidation.bind(validationInstance)
export const userDataValidation = validationInstance.userDataValidation.bind(validationInstance)
export const fileValidation = validationInstance.fileValidation.bind(validationInstance)