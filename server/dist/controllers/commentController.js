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
exports.CommentController = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class CommentController {
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const avatar = files.avatar[0];
            const attachedFile = files.file[0];
            const limitOfTXT = 100 * 1024;
            const requiredFields = ['userName', 'email', 'text'];
            const userData = JSON.parse(req.body.userData);
            //?improve it
            //this is limit for txt files, but i think i could do it in multer
            if (attachedFile.mimetype === 'text/plain') {
                if (attachedFile.size > limitOfTXT) {
                    return res.status(400).json({ ok: false, message: 'File limit reached' });
                }
            }
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ ok: false, message: "Give me some body pls" });
            }
            //?check if all fields alright (make it middlware )
            for (const field of requiredFields) {
                if (!(field in userData)) {
                    return res.status(400).json({ ok: false, message: `Missing required field: ${requiredFields}` });
                }
            }
            try {
                const createUser = yield client_1.default.user.create({ data: { userName: userData.userName, email: userData.email } });
                const comment = yield client_1.default.comment.create({
                    data: {
                        text: userData.text,
                        home_page: 'example.com',
                        authorId: createUser.id,
                    },
                });
                res.status(200).json({ ok: "good" });
            }
            catch (error) {
                res.status(400).json({ error: error, message: 'bad', ok: false });
            }
        });
    }
}
exports.CommentController = CommentController;
