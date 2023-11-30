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
const awsS3_service_1 = __importDefault(require("../services/awsS3.service"));
class CommentController {
    createUserWithCommnet(userData, avatar, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client_1.default.user.create({
                data: Object.assign({ userName: userData.userName, email: userData.email }, (avatar ? { avatar } : {})),
            });
            const comment = yield client_1.default.comment.create({
                data: Object.assign({ text: userData.text, authorId: user.id }, (file ? { file } : {})),
            });
            console.log('User and comment created:', user, comment);
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const userData = JSON.parse(req.body.userData);
            const avatar = files.avatar && files.avatar[0];
            const attachedFile = files.file && files.file[0];
            const aws = new awsS3_service_1.default();
            try {
                const createUserWithComment = (userData, avatar, file) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield client_1.default.user.create({
                        data: Object.assign({ userName: userData.userName, email: userData.email }, (avatar ? { avatar } : {})),
                    });
                    yield client_1.default.comment.create({
                        data: Object.assign({ text: userData.text, authorId: user.id }, (file ? { file } : {})),
                    });
                });
                //upload to s3
                const avatarUploadPromise = avatar ? aws.s3Upload(avatar) : null;
                const fileUploadPromise = attachedFile ? aws.s3Upload(attachedFile) : null;
                const [avatarResult, fileResult] = yield Promise.all([avatarUploadPromise, fileUploadPromise]);
                const avatarUrl = avatarResult ? avatarResult.awsUrl : undefined;
                const fileUrl = fileResult ? fileResult.awsUrl : undefined;
                yield createUserWithComment(userData, avatarUrl, fileUrl);
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
                res.status(200).json({ ok: "good" });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ error: error, message: 'bad', ok: false });
            }
        });
    }
    getAllComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllUsers = yield client_1.default.user.findMany();
                res.status(200).json({ ok: true, message: "all users here", data: getAllUsers });
            }
            catch (error) {
                res.status(400).json({ error: error, message: 'bad', ok: false });
            }
        });
    }
}
exports.CommentController = CommentController;
