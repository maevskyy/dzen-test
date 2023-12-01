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
exports.formatCommentForClient3 = exports.formatCommentForClient2 = exports.formatCommentForClient = void 0;
const client_1 = __importDefault(require("../prisma/client"));
//!fix types
const formatCommentForClient = (comments) => {
    const commentMap = new Map();
    comments.forEach((comment) => commentMap.set(comment.id, comment));
    const updatedComments = comments.map((comment) => {
        if (comment.successorId !== null) {
            const parentComment = commentMap.get(comment.successorId);
            if (parentComment) {
                if (!parentComment.replies) {
                    parentComment.replies = [];
                }
                parentComment.replies.push(comment);
            }
        }
        return comment;
    });
    return updatedComments.filter((comment) => comment.successorId === null);
};
exports.formatCommentForClient = formatCommentForClient;
const formatCommentForClient2 = (comments) => __awaiter(void 0, void 0, void 0, function* () {
    const commentMap = new Map();
    // Загрузка комментариев в Map для дальнейшего использования
    comments.forEach((comment) => commentMap.set(comment.id, comment));
    // Изменение каждого комментария, добавляя к нему массив replies
    const updatedComments = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
        if (comment.successorId !== null) {
            const parentComment = commentMap.get(comment.successorId);
            if (parentComment) {
                // Если у родительского комментария еще нет replies, создаем новый массив
                if (!parentComment.replies) {
                    parentComment.replies = [];
                }
                // Загрузка информации о пользователе для текущего комментария
                const user = yield client_1.default.user.findUnique({
                    where: { id: comment.authorId },
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        avatar: true,
                    },
                });
                // Добавление маппированного комментария с информацией о пользователе
                parentComment.replies.push({
                    id: comment.id,
                    text: comment.text,
                    home_page: comment.home_page,
                    file: comment.file,
                    //@ts-ignore
                    ownerData: user,
                    created_at: new Date(comment.created_at),
                });
            }
        }
        return comment;
    })));
    // Оставляем только те комментарии, у которых нет successorId (топовые комментарии)
    const topLevelComments = updatedComments.filter((comment) => comment.successorId === null);
    return topLevelComments;
});
exports.formatCommentForClient2 = formatCommentForClient2;
const formatCommentForClient3 = (comments) => __awaiter(void 0, void 0, void 0, function* () {
    const commentMap = new Map();
    // Загрузка комментариев в Map для дальнейшего использования
    comments.forEach((comment) => commentMap.set(comment.id, comment));
    // Изменение каждого комментария, добавляя к нему массив replies
    const updatedComments = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield client_1.default.user.findUnique({
            where: { id: comment.authorId },
            select: {
                id: true,
                userName: true,
                email: true,
                avatar: true,
            },
        });
        // Если это корневой комментарий
        if (comment.successorId === null) {
            return {
                id: comment.id,
                text: comment.text,
                home_page: comment.home_page,
                file: comment.file,
                authorId: comment.authorId,
                successorId: comment.successorId,
                created_at: new Date(comment.created_at),
                ownerData: user,
                replies: [],
            };
        }
        // Если это ответ, добавляем его к родительскому комментарию
        const parentComment = commentMap.get(comment.successorId);
        if (parentComment) {
            if (!parentComment.replies) {
                parentComment.replies = [];
            }
            parentComment.replies.push({
                id: comment.id,
                text: comment.text,
                home_page: comment.home_page,
                file: comment.file,
                authorId: comment.authorId,
                successorId: comment.successorId,
                created_at: new Date(comment.created_at),
                //@ts-ignore
                ownerData: user,
            });
        }
        return null;
    })));
    // Оставляем только те корневые комментарии
    const topLevelComments = updatedComments.filter((comment) => comment !== null);
    return topLevelComments;
});
exports.formatCommentForClient3 = formatCommentForClient3;
