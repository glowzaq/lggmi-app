import prisma from '../../utils/prisma'
import {
    CreateDevotionalInput,
    UpdateDevotionalInput,
} from './devotionals.types'

// ─── Create devotional ────────────────────────────────────────
export const createDevotional = async (input: CreateDevotionalInput) => {
    const devotionalDate = input.devotionalDate
        ? new Date(input.devotionalDate)
        : new Date()

    // Normalize to start of day
    devotionalDate.setHours(0, 0, 0, 0)

    // Check if one already exists for that date
    const existing = await prisma.devotionals.findFirst({
        where: {
            devotionalDate: {
                gte: devotionalDate,
                lte: new Date(devotionalDate.getTime() + 24 * 60 * 60 * 1000),
            },
        },
    })

    if (existing) {
        throw new Error(
            'A devotional already exists for this date. Edit the existing one instead.'
        )
    }

    return prisma.devotionals.create({
        data: {
            title: input.title,
            scripture: input.scripture,
            scriptureText: input.scriptureText,
            body: input.body,
            prayerPoint: input.prayerPoint,
            author: input.author,
            devotionalDate,
            createdById: input.createdById,
        },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

// ─── Get today's devotional ───────────────────────────────────
export const getTodayDevotional = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return prisma.devotionals.findFirst({
        where: {
            devotionalDate: { gte: today, lt: tomorrow },
        },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

// ─── Get all devotionals ──────────────────────────────────────
export const getAllDevotionals = async () => {
    return prisma.devotionals.findMany({
        orderBy: { devotionalDate: 'desc' },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

// ─── Get single devotional ────────────────────────────────────
export const getDevotionalById = async (id: string) => {
    const devotional = await prisma.devotionals.findUnique({
        where: { id },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
    if (!devotional) throw new Error('Devotional not found')
    return devotional
}

// ─── Update devotional ────────────────────────────────────────
export const updateDevotional = async (
    id: string,
    input: UpdateDevotionalInput
) => {
    const devotional = await prisma.devotionals.findUnique({ where: { id } })
    if (!devotional) throw new Error('Devotional not found')

    return prisma.devotionals.update({
        where: { id },
        data: {
            title: input.title,
            scripture: input.scripture,
            scriptureText: input.scriptureText,
            body: input.body,
            prayerPoint: input.prayerPoint,
            author: input.author,
        },
    })
}

// ─── Delete devotional ────────────────────────────────────────
export const deleteDevotional = async (id: string) => {
    const devotional = await prisma.devotionals.findUnique({ where: { id } })
    if (!devotional) throw new Error('Devotional not found')
    return prisma.devotionals.delete({ where: { id } })
}