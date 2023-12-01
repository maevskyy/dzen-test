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
const createComment_service_1 = require("../services/createComment.service");
const __1 = require("..");
class CommentController {
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const userData = JSON.parse(req.body.userData);
            const avatar = files.avatar && files.avatar[0];
            const attachedFile = files.file && files.file[0];
            //for child comments
            const parentId = userData.parentId;
            const aws = new awsS3_service_1.default();
            // const io = this.io; 
            try {
                // check if avatar and file have been passed
                const avatarUploadPromise = avatar ? aws.s3Upload(avatar) : null;
                const fileUploadPromise = attachedFile ? aws.s3Upload(attachedFile) : null;
                const [avatarResult, fileResult] = yield Promise.all([avatarUploadPromise, fileUploadPromise]);
                const avatarUrl = avatarResult ? avatarResult.awsUrl : undefined;
                const fileUrl = fileResult ? fileResult.awsUrl : undefined;
                // create comment
                const createdComment = yield (0, createComment_service_1.createUserWithComment)(userData, avatarUrl, fileUrl, parentId);
                //send new comment to the user                        
                __1.ioSocket.emit('updatedComments', createdComment);
                res.status(200).json({ ok: true, message: 'Comment successfully created' });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ ok: false, message: 'Comment not created', error: error });
            }
        });
    }
    getAllComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //this is for paggination
                const { page = 1, pageSize = 20, authorName, authorEmail } = req.query;
                const skip = (Number(page) - 1) * Number(pageSize);
                //!type fix
                //this is for sort by author and email
                const whereClause = {};
                if (authorName) {
                    whereClause.author = { userName: { startsWith: authorName.toString().toLowerCase() } };
                }
                if (authorEmail) {
                    whereClause.author = { email: { startsWith: authorEmail.toString().toLowerCase() } };
                }
                const allComments = yield client_1.default.comment.findMany({
                    take: pageSize,
                    skip: skip,
                    where: whereClause,
                });
                console.log(allComments);
                const formatComments = yield (0, createComment_service_1.formatCommentForClient3)(allComments);
                res.status(200).json({ ok: true, message: "All comments", data: formatComments });
            }
            catch (error) {
                res.status(400).json({ ok: false, message: 'Cannot get comments', error: error });
            }
        });
    }
}
exports.CommentController = CommentController;
