import prisma from '../../utils/prisma'
import { CreateWelfareInput, UpdateWelfareInput } from './welfare.types'

export const createWelfare = async (input: CreateWelfareInput) => {
    return prisma.welfare.create({
        data: {
            title: input.title,
            description: input.description,
            recipient: input.recipient,
            notes: input.notes,
            createdById: input.createdById,
            amount: input.amount,
            date: input.date ? new Date(input.date) : new Date(),
        },
        include: {
            createdBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
}

export const getAllWelfare = async () => {
    return prisma.welfare.findMany({
        orderBy: { date: 'desc' },
        include: {
            createdBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
}

export const getWelfareById = async (id: string) => {
    const record = await prisma.welfare.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
    if (!record) throw new Error('Welfare record not found')
    return record
}

export const updateWelfare = async (
    id: string,
    input: UpdateWelfareInput
) => {
    const record = await prisma.welfare.findUnique({ where: { id } })
    if (!record) throw new Error('Welfare record not found')

    return prisma.welfare.update({
        where: { id },
        data: {
            title: input.title,
            description: input.description,
            recipient: input.recipient,
            notes: input.notes,
            amount: input.amount,
            date: input.date ? new Date(input.date) : undefined,
        },
    })
}

export const deleteWelfare = async (id: string) => {
    const record = await prisma.welfare.findUnique({ where: { id } })
    if (!record) throw new Error('Welfare record not found')
    return prisma.welfare.delete({ where: { id } })
}

export const getWelfareStats = async () => {
    const [totalAmount, totalRecords, thisMonth] = await Promise.all([
        prisma.welfare.aggregate({ _sum: { amount: true } }),
        prisma.welfare.count(),
        prisma.welfare.aggregate({
            _sum: { amount: true },
            where: {
                date: {
                    gte: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    ),
                },
            },
        }),
    ])

    return {
        totalAmount: Number(totalAmount._sum.amount ?? 0),
        totalRecords,
        thisMonth: Number(thisMonth._sum.amount ?? 0),
    }
}