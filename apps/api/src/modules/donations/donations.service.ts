import prisma from '../../utils/prisma'
import {
    CreateDonationInput,
    UpdateDonationInput,
    DonationReportFilter,
} from './donations.types'

export const createDonation = async (input: CreateDonationInput) => {
    if (!input.amount || input.amount <= 0) {
        throw new Error('Amount must be greater than zero')
    }

    return prisma.donation.create({
        data: {
            amount: input.amount,
            type: input.type || 'OFFERING',
            note: input.note,
            date: input.date ? new Date(input.date) : new Date(),
            eventId: input.eventId || undefined,
        },
        include: {
            event: { select: { title: true, type: true } },
        },
    })
}

export const getAllDonations = async (filter: DonationReportFilter = {}) => {
    const { startDate, endDate, type, eventId } = filter

    return prisma.donation.findMany({
        where: {
            ...(eventId && { eventId }),
            ...(type && { type: type as any }),
            ...(startDate || endDate
                ? {
                    date: {
                        ...(startDate && { gte: new Date(startDate) }),
                        ...(endDate && { lte: new Date(endDate) }),
                    },
                }
                : {}),
        },
        include: {
            event: { select: { title: true, type: true } },
        },
        orderBy: { date: 'desc' },
    })
}

export const getDonationById = async (id: string) => {
    const donation = await prisma.donation.findUnique({
        where: { id },
        include: {
            event: { select: { title: true, type: true } },
        },
    })
    if (!donation) throw new Error('Donation not found')
    return donation
}

export const updateDonation = async (
    id: string,
    input: UpdateDonationInput
) => {
    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) throw new Error('Donation not found')

    return prisma.donation.update({
        where: { id },
        data: {
            amount: input.amount,
            type: input.type as any,
            note: input.note,
            date: input.date ? new Date(input.date) : undefined,
            eventId: input.eventId,
        },
    })
}

export const deleteDonation = async (id: string) => {
    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) throw new Error('Donation not found')
    return prisma.donation.delete({ where: { id } })
}

export const getDonationStats = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [allTime, thisMonth, lastMonth, byType] = await Promise.all([
        prisma.donation.aggregate({ _sum: { amount: true } }),
        prisma.donation.aggregate({
            _sum: { amount: true },
            where: { date: { gte: startOfMonth } },
        }),
        prisma.donation.aggregate({
            _sum: { amount: true },
            where: { date: { gte: startOfLastMonth, lte: endOfLastMonth } },
        }),
        prisma.donation.groupBy({
            by: ['type'],
            _sum: { amount: true },
            _count: true,
        }),
    ])

    const trend = await Promise.all(
        Array.from({ length: 6 }, (_, i) => {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
            return prisma.donation
                .aggregate({
                    _sum: { amount: true },
                    where: { date: { gte: start, lte: end } },
                })
                .then((res) => ({
                    month: start.toLocaleString('default', {
                        month: 'short',
                        year: 'numeric',
                    }),
                    total: Number(res._sum.amount || 0),
                }))
        })
    )

    return {
        allTime: Number(allTime._sum.amount || 0),
        thisMonth: Number(thisMonth._sum.amount || 0),
        lastMonth: Number(lastMonth._sum.amount || 0),
        byType: byType.map((b) => ({
            type: b.type,
            total: Number(b._sum.amount || 0),
            count: b._count,
        })),
        trend: trend.reverse(),
    }
}