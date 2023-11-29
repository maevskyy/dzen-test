import multer, { FileFilterCallback, MulterError } from "multer"
import { Request, Response, NextFunction } from "express"

class Multer {
    private storage = multer.memoryStorage()

    private fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        const allowedImageExtensions = ['jpg', 'jpeg', 'gif', 'png'];
        const isImage = file.mimetype.startsWith('image/');
        const isText = file.mimetype.startsWith('text/plain');
        const imageFormat = file.mimetype.split('/')[1]
        const isImageFormatValid = allowedImageExtensions.includes(imageFormat)
        //100 kb
        const limitForText = 100 * 1024


        if (isImage) {
            if (isImageFormatValid) {
                cb(null, true)
            }
            if (!isImageFormatValid) {
                //!type fix
                //@ts-ignore
                cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
            }
        }

        if (isText) {
            if (limitForText) {
                cb(null, true)
            }
            if (!limitForText) {
                //!type fix
                //@ts-ignore
                cb(new multer.MulterError('LIMIT_FILE_SIZE'), false);
            }
        }
        else {
            //!type fix
            //@ts-ignore
            cb(new multer.MulterError('LIMIT_FILE_SIZE'), false);
        }

    }

    public multerErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
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
        res.status(500).json({
            ok: false,
            message: 'Server error',
        });
    };

    public multerMiddlware() {
        return multer({ storage: this.storage, fileFilter: this.fileFilter.bind(this), limits: { fileSize: 5000000 } })
    }

}

const multerInstance = new Multer();
export const multerErrorHandler = multerInstance.multerErrorHandler.bind(multerInstance);
export const multerMiddleware = multerInstance.multerMiddlware.bind(multerInstance);