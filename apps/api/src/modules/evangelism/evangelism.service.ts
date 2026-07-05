import prisma from '../../utils/prisma'
import {
    CreateEvangelismInput,
    UpdateEvangelismInput,
} from './evangelism.types'

export const createEvangelism = async (input: CreateEvangelismInput) => {
    return prisma.evangelism.create({
        data: {
            title: input.title,
            date: new Date(input.date),
            location: input.location,
            numberOfReached: input.numberOfReached ?? 0,
            numberOfConverted: input.numberOfConverted ?? 0,
            numberOfFilledSpirit: input.numberOfFilledSpirit ?? 0,
            followedUp: input.followedUp ?? false,
            followUpNote: input.followUpNote,
            assimilated: input.assimilated ?? 0,
            notes: input.notes,
            conductedById: input.conductedById,
        },
        include: {
            conductedBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
}

export const getAllEvangelism = async () => {
    return prisma.evangelism.findMany({
        orderBy: { date: 'desc' },
        include: {
            conductedBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
}

export const getEvangelismById = async (id: string) => {
    const record = await prisma.evangelism.findUnique({
        where: { id },
        include: {
            conductedBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
    if (!record) throw new Error('Evangelism record not found')
    return record
}

export const updateEvangelism = async (
    id: string,
    input: UpdateEvangelismInput
) => {
    const record = await prisma.evangelism.findUnique({ where: { id } })
    if (!record) throw new Error('Evangelism record not found')

    return prisma.evangelism.update({
        where: { id },
        data: {
            title: input.title,
            date: input.date ? new Date(input.date) : undefined,
            location: input.location,
            numberOfReached: input.numberOfReached,
            numberOfConverted: input.numberOfConverted,
            numberOfFilledSpirit: input.numberOfFilledSpirit,
            followedUp: input.followedUp,
            followUpNote: input.followUpNote,
            assimilated: input.assimilated,
            notes: input.notes,
        },
        include: {
            conductedBy: {
                select: { firstName: true, lastName: true },
            },
        },
    })
}

export const deleteEvangelism = async (id: string) => {
    const record = await prisma.evangelism.findUnique({ where: { id } })
    if (!record) throw new Error('Evangelism record not found')
    return prisma.evangelism.delete({ where: { id } })
}

export const getEvangelismStats = async () => {
    const [
        totalReached,
        totalConverted,
        totalFilledSpirit,
        totalAssimilated,
        totalRecords,
    ] = await Promise.all([
        prisma.evangelism.aggregate({ _sum: { numberOfReached: true } }),
        prisma.evangelism.aggregate({ _sum: { numberOfConverted: true } }),
        prisma.evangelism.aggregate({ _sum: { numberOfFilledSpirit: true } }),
        prisma.evangelism.aggregate({ _sum: { assimilated: true } }),
        prisma.evangelism.count(),
    ])

    return {
        totalReached: totalReached._sum.numberOfReached ?? 0,
        totalConverted: totalConverted._sum.numberOfConverted ?? 0,
        totalFilledSpirit: totalFilledSpirit._sum.numberOfFilledSpirit ?? 0,
        totalAssimilated: totalAssimilated._sum.assimilated ?? 0,
        totalOutreaches: totalRecords,
    }
}