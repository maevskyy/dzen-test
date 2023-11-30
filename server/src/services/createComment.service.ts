import { Request, Response } from "express"
import prisma from "../prisma/client"

type TUserData = {
    userName: string,
    email: string,
    text: string
}

export const createUser = async (req: Request, res: Response, userData: TUserData) => {
    try {
        const createdUser = await prisma.user.create({ data: { userName: userData.userName, email: userData.email } })
        return createdUser
    } catch (error) {
        res.status(400).json({ok: false, message:'vfd', error})
        console.log(error)
    }


}