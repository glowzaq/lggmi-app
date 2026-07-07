import prisma from '../../utils/prisma'
import { UpdateUserInput } from './users.types'

export const getAllUsers = async () => {
    return prisma.user.findMany({
        where: { isActive: true },
        include: { family: true },
        orderBy: { joinedAt: 'desc' },
    })
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            family: true,
            attendances: {
                include: { event: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            donations: {
                orderBy: { donatedAt: 'desc' },
                take: 10,
            },
        },
    })

    if (!user) throw new Error('User not found')
    return user
}

export const updateUser = async (id: string, input: UpdateUserInput) => {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new Error('User not found')

    if (input.phone && input.phone !== user.phone) {
        const phoneExists = await prisma.user.findUnique({
            where: { phone: input.phone },
        })
        if (phoneExists) {
            throw new Error('This phone number is already registered to another member')
        }
    }

    return prisma.user.update({
        where: { id },
        data: {
            ...input,
            dateOfBirth: input.dateOfBirth
                ? new Date(input.dateOfBirth)
                : undefined,
        },
    })
}

export const deactivateUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new Error('User not found')

    return prisma.user.update({
        where: { id },
        data: { isActive: false },
    })
}

export const getUserStats = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [total, men, women, newThisMonth] = await Promise.all([
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: true, gender: 'MALE' } }),
        prisma.user.count({ where: { isActive: true, gender: 'FEMALE' } }),
        prisma.user.count({
            where: { isActive: true, joinedAt: { gte: startOfMonth } },
        }),
    ])

    return { total, men, women, newThisMonth }
}