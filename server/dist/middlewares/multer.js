"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerMiddleware = exports.multerErrorHandler = void 0;
const multer_1 = __importStar(require("multer"));
class Multer {
    constructor() {
        this.storage = multer_1.default.memoryStorage();
        this.multerErrorHandler = (err, req, res, next) => {
            //this is handler for all multer errors possible
            if (err instanceof multer_1.MulterError) {
                const responseMessage = err.code === 'LIMIT_FILE_SIZE'
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
        this.multerMiddlware = (0, multer_1.default)({ storage: this.storage, fileFilter: this.fileFilter.bind(this), limits: { fileSize: 5000000, } });
    }
    fileFilter(req, file, cb) {
        const allowedImageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
        const isImage = file.mimetype.split('/')[0] === 'image';
        const isText = file.mimetype === 'text/plain';
        const imageFormat = file.mimetype.split('/')[1];
        const isImageFormatValid = allowedImageExtensions.includes(imageFormat);
        if (isImage) {
            if (isImageFormatValid) {
                return cb(null, true);
            }
            if (!isImageFormatValid) {
                //!type fix
                //@ts-ignore
                return cb(new multer_1.default.MulterError('LIMIT_UNEXPECTED_FILE'), false);
            }
        }
        if (isText) {
            return cb(null, true);
        }
        else {
            const error = new Error('File must be an image or text');
            error.code = 'LIMIT_UNEXPECTED_FILE';
            cb(error, false);
        }
    }
}
const multerInstance = new Multer();
exports.multerErrorHandler = multerInstance.multerErrorHandler.bind(multerInstance);
exports.multerMiddleware = multerInstance.multerMiddlware;
