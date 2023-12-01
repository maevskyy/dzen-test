import multer, { FileFilterCallback, MulterError } from "multer"
import { Request, Response, NextFunction } from "express"

class Multer {
    private storage = multer.memoryStorage()

    private fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        const allowedImageExtensions = ['jpg', 'jpeg', 'gif', 'png','webp'];
        const isImage = file.mimetype.split('/')[0] === 'image';
        const isText = file.mimetype === 'text/plain';
        const imageFormat = file.mimetype.split('/')[1]
        const isImageFormatValid = allowedImageExtensions.includes(imageFormat)


        if (isImage) {
            if (isImageFormatValid) {
                return cb(null, true)
            }
            if (!isImageFormatValid) {
                //!type fix
                //@ts-ignore
                return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
            }
        }

        if (isText) {
            return cb(null, true)
        }
        else {
            const error = new Error('File must be an image or text');
            (error as any).code = 'LIMIT_UNEXPECTED_FILE';
            cb(error as any, false);
        }

    }

    public multerErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
        //this is handler for all multer errors possible
        if (err instanceof MulterError) {
            const responseMessage =
                err.code === 'LIMIT_FILE_SIZE'
                    ? 'File is too large'
                    : err.code === 'LIMIT_FILE_COUNT'
                        ? 'File limit reached'
                        : err.code === 'LIMIT_UNEXPECTED_FILE'
                            ? 'File must be an image or text'
                            : 'Unknown error';
            return res.status(400).json({
                ok: false,
                message: responseMessage,
            });
        }
        next(err);
    };

    public multerMiddlware = multer({ storage: this.storage, fileFilter: this.fileFilter.bind(this), limits: { fileSize: 5000000, } })


}

const multerInstance = new Multer();
export const multerErrorHandler = multerInstance.multerErrorHandler.bind(multerInstance);
export const multerMiddleware = multerInstance.multerMiddlware