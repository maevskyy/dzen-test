import prisma from "../prisma/client";

type Comment =  {
    id: number;
    text: string;
    home_page: string | null;
    file: string;
    authorId: number;
    successorId: number | null;
    created_at: Date;
    replies: Comment[]
}

type TUserData = {
    userName: string,
    email: string,
    text: string,
}

type TCommentData = {
    text: string,
    authorId: number,
    file?: string,
    successorId?: number

}


export const formatCommentForClient3 = async (comments: any) => {
    const commentMap = new Map<number, Comment>();
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
                    //!fix types
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

export const createUserWithComment = async (userData: TUserData, avatar?: string, file?: string, parentId?: number) => {
    const user = await prisma.user.create({
        data: {
            userName: userData.userName,
            email: userData.email,
            ...(avatar ? { avatar } : {})
        },
    });
    const commentData: TCommentData = {
        text: userData.text,
        authorId: user.id,
        ...(file ? { file } : {})
    };

    if (parentId) {
        commentData.successorId = parentId;
    }

    const comment = await prisma.comment.create({
        data: commentData,
    })

    return {
        ...comment,
        ownerData: user
    }
}