"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidation = exports.userDataValidation = exports.avatarValidation = void 0;
const sharp_1 = __importDefault(require("sharp"));
class CommnetValidation {
    resizePhoto(buffer, maxWidth, maxHeight, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { width, height } = yield (0, sharp_1.default)(buffer).metadata();
                // new relations for image sides
                const aspectRatio = width / height;
                let newWidth = maxWidth;
                let newHeight = newWidth / aspectRatio;
                if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = newHeight * aspectRatio;
                }
                const resizedBuffer = yield (0, sharp_1.default)(buffer).resize(Math.round(newWidth), Math.round(newHeight)).toBuffer();
                return resizedBuffer;
            }
            catch (error) {
                res.status(400).json({ ok: false, message: "Cannot resize this image" });
                throw error;
            }
        });
    }
    avatarValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const avatar = files.avatar && files.avatar[0];
                if (avatar) {
                    if (avatar.mimetype.split('/')[0] === 'image') {
                        avatar.buffer = yield this.resizePhoto(avatar.buffer, 320, 240, res);
                    }
                    if (avatar.mimetype.split('/')[0] !== 'image') {
                        return res.status(400).json({ ok: false, message: "Avatar must be an image" });
                    }
                }
                next();
            }
            catch (error) {
                res.status(400).json({ ok: false, message: 'Avatar validation error', error });
            }
        });
    }
    userDataValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const requiredFields = ['userName', 'email', 'text'];
            const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            try {
                const userData = JSON.parse(req.body.userData);
                //missing required field
                for (const field of requiredFields) {
                    if (!(field in userData)) {
                        return res.status(400).json({ ok: false, message: `Missing required field: ${requiredFields}` });
                    }
                }
                //invalid email
                if (!userData.email.match(emailReg)) {
                    return res.status(400).json({ ok: false, message: `Invalid email format` });
                }
                //invalid userName
                if (userData.userName.length <= 2 || userData.userName.length > 20) {
                    return res.status(400).json({ ok: false, message: `Invalid name format, 2-20 letters` });
                }
                next();
            }
            catch (error) {
                //in case if body is empty
                res.status(400).json({ ok: false, message: `Missing required userData fields is: ${requiredFields}` });
            }
        });
    }
    fileValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //100kb
            const limitOfTXT = 100 * 1024;
            try {
                const files = req.files;
                const attachedFile = files.file && files.file[0];
                if (attachedFile) {
                    const isImage = attachedFile.mimetype.split('/')[0] === 'image';
                    const isFile = attachedFile.mimetype.split('/')[0] === 'text';
                    if (isImage) {
                        attachedFile.buffer = yield this.resizePhoto(attachedFile.buffer, 320, 240, res);
                    }
                    if (isFile) {
                        //this probably shoudl be in multer
                        if (attachedFile.size > limitOfTXT) {
                            return res.status(400).json({ ok: false, message: 'Maximum limit for .txt files is 100kb' });
                        }
                    }
                }
                next();
            }
            catch (error) {
                res.status(400).json({ ok: false, message: 'File validation error' });
            }
        });
    }
}
const validationInstance = new CommnetValidation();
exports.avatarValidation = validationInstance.avatarValidation.bind(validationInstance);
exports.userDataValidation = validationInstance.userDataValidation.bind(validationInstance);
exports.fileValidation = validationInstance.fileValidation.bind(validationInstance);
