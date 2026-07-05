import prisma from '../../utils/prisma'
import {
    CreateTestimonyInput,
    UpdateTestimonyInput,
} from './testimonies.types'

export const createTestimony = async (input: CreateTestimonyInput) => {
    const user = await prisma.user.findUnique({ where: { id: input.userId } })
    if (!user) throw new Error('User not found')

    return prisma.testimony.create({
        data: {
            userId: input.userId,
            title: input.title,
            content: input.content,
            date: new Date(input.date),
            status: 'PENDING',
        },
        include: {
            user: { select: { firstName: true, lastName: true } },
        },
    })
}

// Approved testimonies — visible to all members
export const getApprovedTestimonies = async () => {
    return prisma.testimony.findMany({
        where: { status: 'APPROVED' },
        include: {
            user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { approvedAt: 'desc' },
    })
}

// All testimonies — admin, pastor, worker only
export const getAllTestimonies = async () => {
    return prisma.testimony.findMany({
        include: {
            user: { select: { firstName: true, lastName: true } },
            approvedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
    })
}

// Member's own testimonies
export const getUserTestimonies = async (userId: string) => {
    return prisma.testimony.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })
}

export const getTestimonyById = async (id: string) => {
    const testimony = await prisma.testimony.findUnique({
        where: { id },
        include: {
            user: { select: { firstName: true, lastName: true } },
            approvedBy: { select: { firstName: true, lastName: true } },
        },
    })
    if (!testimony) throw new Error('Testimony not found')
    return testimony
}

export const updateTestimony = async (
    id: string,
    input: UpdateTestimonyInput
) => {
    const testimony = await prisma.testimony.findUnique({ where: { id } })
    if (!testimony) throw new Error('Testimony not found')
    return prisma.testimony.update({ where: { id }, data: input })
}

// Approve testimony
export const approveTestimony = async (
    id: string,
    approverId: string
) => {
    const testimony = await prisma.testimony.findUnique({ where: { id } })
    if (!testimony) throw new Error('Testimony not found')

    return prisma.testimony.update({
        where: { id },
        data: {
            status: 'APPROVED',
            approvedById: approverId,
            approvedAt: new Date(),
        },
    })
}

// Reject testimony
export const rejectTestimony = async (id: string) => {
    const testimony = await prisma.testimony.findUnique({ where: { id } })
    if (!testimony) throw new Error('Testimony not found')

    return prisma.testimony.update({
        where: { id },
        data: { status: 'REJECTED' },
    })
}

export const deleteTestimony = async (id: string) => {
    const testimony = await prisma.testimony.findUnique({ where: { id } })
    if (!testimony) throw new Error('Testimony not found')
    return prisma.testimony.delete({ where: { id } })
}

export const getTestimonyStats = async () => {
    const [total, pending, approved, rejected] = await Promise.all([
        prisma.testimony.count(),
        prisma.testimony.count({ where: { status: 'PENDING' } }),
        prisma.testimony.count({ where: { status: 'APPROVED' } }),
        prisma.testimony.count({ where: { status: 'REJECTED' } }),
    ])
    return { total, pending, approved, rejected }
}