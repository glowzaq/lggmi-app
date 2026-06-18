import prisma from "../../utils/prisma";
import { CreateSermonInput, UpdateSermonInput } from "./sermons.types";

export const createSermon = async (input: CreateSermonInput) => {
    return prisma.sermon.create({
        data: {
            ...input,
            sermonDate: new Date(input.sermonDate),
        },
    })
}

export const getAllSermons = async (seriesName?: string) => {
    return prisma.sermon.findMany({
        orderBy: {sermonDate: 'desc'},
        where: seriesName ? {seriesName} : undefined
    })
}

export const getLatestSermons = async (limit = 6) => {
    return prisma.sermon.findMany({
        orderBy: {sermonDate: 'desc'},
        take: limit
    })
}

export const getAllSeries = async () => {
    const sermons = await prisma.sermon.findMany({
        where: {seriesName: {not: null}},
        select: {seriesName: true},
        distinct: ['seriesName'],
    })

    return sermons.map((s)=>s.seriesName).filter((s): s is string => s !== null)
}

export const getSermonById = async (id: string) => {
    const sermon = await prisma.sermon.findUnique({where: {id}})
    if (!sermon) throw new Error('Sermon not found')
    return sermon
}

export const updateSermon = async (id: string, input: UpdateSermonInput) => {
    const sermon = await prisma.sermon.findUnique({where: {id}})
    if(!sermon) throw new Error('Sermon not found')

    return prisma.sermon.update({
        where: {id},
        data: {
            ...input,
            sermonDate: input.sermonDate ? new Date(input.sermonDate) : undefined,
        },
    })
}

export const deleteSermon = async (id: string) => {
    const sermon = await prisma.sermon.findUnique({where: {id}})
    if (!sermon) throw new Error('Sermon not found')

    return prisma.event.delete({where: {id}})
}

