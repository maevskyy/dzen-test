import prisma from "../prisma/client";

interface Comment {
    id: number;
    text: string;
    home_page: string | null;
    file: string;
    authorId: number;
    successorId: number | null;
    created_at: Date;
    replies: Comment[]
}

//!fix types
export const formatCommentForClient = (comments: any) => {

    const commentMap = new Map<number, Comment>();
    comments.forEach((comment: Comment) => commentMap.set(comment.id, comment));

    const updatedComments = comments.map((comment: Comment) => {
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

    return updatedComments.filter((comment: Comment) => comment.successorId === null);
}

export const formatCommentForClient2 = async (comments: any) => {
    const commentMap = new Map<number, Comment>();

    // Загрузка комментариев в Map для дальнейшего использования
    comments.forEach((comment: Comment) => commentMap.set(comment.id, comment));

    // Изменение каждого комментария, добавляя к нему массив replies
    const updatedComments = await Promise.all(
        comments.map(async (comment: Comment) => {
            if (comment.successorId !== null) {
                const parentComment = commentMap.get(comment.successorId);
                if (parentComment) {
                    // Если у родительского комментария еще нет replies, создаем новый массив
                    if (!parentComment.replies) {
                        parentComment.replies = [];
                    }

                    // Загрузка информации о пользователе для текущего комментария
                    const user = await prisma.user.findUnique({
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
        })
    );

    // Оставляем только те комментарии, у которых нет successorId (топовые комментарии)
    const topLevelComments = updatedComments.filter((comment: Comment) => comment.successorId === null);

    return topLevelComments;
};

export const formatCommentForClient3 = async (comments: any) => {
    const commentMap = new Map<number, Comment>();

    // Загрузка комментариев в Map для дальнейшего использования
    comments.forEach((comment: Comment) => commentMap.set(comment.id, comment));

    // Изменение каждого комментария, добавляя к нему массив replies
    const updatedComments = await Promise.all(
        comments.map(async (comment: Comment) => {
            const user = await prisma.user.findUnique({
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
        })
    );

    // Оставляем только те корневые комментарии
    const topLevelComments = updatedComments.filter((comment) => comment !== null);

    return topLevelComments;
};