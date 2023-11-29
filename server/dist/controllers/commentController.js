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
            const userData = JSON.parse(req.body.userData);
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
