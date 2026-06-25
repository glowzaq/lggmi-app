import prisma from '../../utils/prisma'
import {
    CreatePrayerRequestInput,
    UpdatePrayerRequestInput,
} from './prayer-requests.types'

export const createPrayerRequest = async (
    input: CreatePrayerRequestInput
) => {
    if(!input.memberId) {
        throw new Error('Member ID must be provided')
    }
    const member = await prisma.member.findUnique({
        where: { id: input.memberId },
    })
    if (!member) throw new Error('Member not found')

    return prisma.prayerRequest.create({
        data: input,
        include: {
            member: { select: { firstName: true, lastName: true } },
        },
    })
}

export const getAllPrayerRequests = async (status?: string) => {
    return prisma.prayerRequest.findMany({
        where: status ? { status: status as any } : undefined,
        include: {
            member: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export const getPublicPrayerRequests = async () => {
    return prisma.prayerRequest.findMany({
        where: { isPrivate: false },
        include: {
            member: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export const getMemberPrayerRequests = async (memberId: string) => {
    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) throw new Error('Member not found')

    return prisma.prayerRequest.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
    })
}

export const getPrayerRequestById = async (id: string) => {
    const request = await prisma.prayerRequest.findUnique({
        where: { id },
        include: {
            member: { select: { firstName: true, lastName: true } },
        },
    })
    if (!request) throw new Error('Prayer request not found')
    return request
}

export const updatePrayerRequest = async (
    id: string,
    input: UpdatePrayerRequestInput
) => {
    const request = await prisma.prayerRequest.findUnique({ where: { id } })
    if (!request) throw new Error('Prayer request not found')

    return prisma.prayerRequest.update({ where: { id }, data: input })
}

export const deletePrayerRequest = async (id: string) => {
    const request = await prisma.prayerRequest.findUnique({ where: { id } })
    if (!request) throw new Error('Prayer request not found')

    return prisma.prayerRequest.delete({ where: { id } })
}

export const updatePrayerStatus = async (
    id: string,
    status: 'PENDING' | 'PRAYED' | 'ANSWERED'
) => {
    const request = await prisma.prayerRequest.findUnique({ where: { id } })
    if (!request) throw new Error('Prayer request not found')

    return prisma.prayerRequest.update({
        where: { id },
        data: { status },
    })
}

export const getPrayerStats = async () => {
    const [total, pending, prayed, answered] = await Promise.all([
        prisma.prayerRequest.count(),
        prisma.prayerRequest.count({ where: { status: 'PENDING' } }),
        prisma.prayerRequest.count({ where: { status: 'PRAYED' } }),
        prisma.prayerRequest.count({ where: { status: 'ANSWERED' } }),
    ])

    return { total, pending, prayed, answered }
}