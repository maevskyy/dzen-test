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
exports.createUserWithComment = exports.formatCommentForClient3 = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const formatCommentForClient3 = (comments) => __awaiter(void 0, void 0, void 0, function* () {
    const addUserData = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = comment.authorId;
        const getUser = yield client_1.default.user.findUnique({ where: { id: userId } });
        return Object.assign(Object.assign({}, comment), { ownerData: getUser });
    })));
    const sortComments = (comments) => {
        const commentMap = new Map();
        // Помещаем комментарии в карту для быстрого доступа
        comments.forEach((comment) => commentMap.set(comment.id, comment));
        // Создаем новый массив, помещая комментарии в replies
        const sortedComments = comments.reduce((result, comment) => {
            if (comment.successorId !== null) {
                const parentComment = commentMap.get(comment.successorId);
                if (parentComment) {
                    if (!parentComment.replies) {
                        parentComment.replies = [];
                    }
                    parentComment.replies.push(comment);
                }
            }
            else {
                result.push(comment);
            }
            return result;
        }, []);
        return sortedComments;
    };
    return sortComments(addUserData);
});
exports.formatCommentForClient3 = formatCommentForClient3;
const createUserWithComment = (userData, avatar, file, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.create({
        data: Object.assign({ userName: userData.userName, email: userData.email }, (avatar ? { avatar } : {})),
    });
    const commentData = Object.assign({ text: userData.text, authorId: user.id }, (file ? { file } : {}));
    if (parentId) {
        commentData.successorId = parentId;
    }
    const comment = yield client_1.default.comment.create({
        data: commentData,
    });
    return Object.assign(Object.assign({}, comment), { ownerData: user });
});
exports.createUserWithComment = createUserWithComment;
