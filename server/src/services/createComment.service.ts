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

    const addUserData = await Promise.all(comments.map(async (comment: Comment) => {
        const userId = comment.authorId
        const getUser = await prisma.user.findUnique({ where: { id: userId } })
        return { ...comment, ownerData: getUser }
    }));

    const sortComments = (comments: any[]) => {
        const commentMap = new Map<number, any>();
    
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
            } else {
                result.push(comment);
            }
            return result;
        }, []);
    
        return sortedComments;
    };    

    return sortComments(addUserData)
}


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