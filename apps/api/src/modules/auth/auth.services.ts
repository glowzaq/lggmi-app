import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput, JwtPayload } from "./auth.types";

export const registerUser = async (input: RegisterInput) => {
    const { email, password, firstName, lastName, phone, role} = input;

    const existingUser = await prisma.user.findUnique({ where: { email }})
    if (existingUser) {
        throw new Error('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'MEMBER',
            },
        })

        const member = await tx.member.create({
            data: {
                userId: user.id,
                firstName,
                lastName,
                phone,
            },
        })

        return { user, member }
    })

    const token = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
    })

    return {
        token,
        user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            firstName: result.member.firstName,
            lastName: result.member.lastName,
        },
    }
}

export const loginUser = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { member: true },
    })

    if (!user) {
        throw new Error('Invalid email or password')
    }

    if (!user.isActive) {
        throw new Error('User account is inactive, contact support for assistance')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error('Invalid email or password')
    }

    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.member?.firstName,
            lastName: user.member?.lastName,
        }
    }
}

const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '3d',
    })
}