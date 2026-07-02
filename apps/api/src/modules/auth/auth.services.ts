import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'
import { RegisterInput, LoginInput, JwtPayload } from './auth.types'

export const registerUser = async (input: RegisterInput) => {
    const { email, password, firstName, lastName, phone, role } = input

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('A user with this email already exists')

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role || 'MEMBER',
            firstName,
            lastName,
            phone,
        },
    })

    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        token,
        user: formatUser(user),
    }
}

export const loginUser = async (input: LoginInput) => {
    const { email, password } = input

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Invalid email or password')
    if (!user.isActive) {
        throw new Error('Your account has been deactivated. Contact the admin.')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new Error('Invalid email or password')

    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        token,
        user: formatUser(user),
    }
}

export const createWorkerAccount = async (
    input: RegisterInput,
    createdByRole: string
) => {
    if (createdByRole !== 'ADMIN') {
        throw new Error('Only admins can create worker accounts')
    }

    const existing = await prisma.user.findUnique({
        where: { email: input.email },
    })
    if (existing) throw new Error('A user with this email already exists')

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: hashedPassword,
            role: input.role || 'WORKER',
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
        },
    })

    return formatUser(user)
}

export const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { family: true },
    })

    if (!user) throw new Error('User not found')
    return formatUser(user)
}

const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '3d',
    })
}

export const formatUser = (user: any) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    maritalStatus: user.maritalStatus,
    occupation: user.occupation,
    joinedAt: user.joinedAt,
    family: user.family ?? null,
    isActive: user.isActive,
})