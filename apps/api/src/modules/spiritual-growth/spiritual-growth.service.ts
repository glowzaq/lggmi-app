import prisma from '../../utils/prisma'
import {
    CreateSpiritualLogInput,
    UpdateSpiritualLogInput,
} from './spiritual-growth.types'

export const upsertTodayLog = async (input: CreateSpiritualLogInput) => {
    const user = await prisma.user.findUnique({
        where: { id: input.userId },
    })
    if (!user) throw new Error('Member not found')

    const logDate = input.logDate
        ? new Date(input.logDate)
        : new Date()

    const startOfDay = new Date(logDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(logDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existing = await prisma.spiritualLog.findFirst({
        where: {
            userId: input.userId,
            logDate: { gte: startOfDay, lte: endOfDay },
        },
    })

    if (existing) {
        return prisma.spiritualLog.update({
            where: { id: existing.id },
            data: {
                prayed: input.prayed,
                studiedBible: input.studiedBible,
                note: input.note,
            },
        })
    }

    return prisma.spiritualLog.create({
        data: {
            userId: input.userId,
            prayed: input.prayed,
            studiedBible: input.studiedBible,
            note: input.note,
            logDate: startOfDay,
        },
    })
}

export const getTodayLog = async (userId: string) => {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    return prisma.spiritualLog.findFirst({
        where: {
            userId,
            logDate: { gte: startOfDay, lte: endOfDay },
        },
    })
}

export const getUserLogs = async (userId: string, days = 30) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Member not found')

    const since = new Date()
    since.setDate(since.getDate() - days)

    return prisma.spiritualLog.findMany({
        where: {
            userId,
            logDate: { gte: since },
        },
        orderBy: { logDate: 'desc' },
    })
}

export const getUserStreak = async (userId: string) => {
    const logs = await prisma.spiritualLog.findMany({
        where: { userId },
        orderBy: { logDate: 'desc' },
    })

    if (logs.length === 0) {
        return { currentStreak: 0, longestStreak: 0 }
    }

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let previousDate: Date | null = null

    for (const log of logs) {
        if (!log.prayed && !log.studiedBible) continue

        const logDate = new Date(log.logDate)
        logDate.setHours(0, 0, 0, 0)

        if (!previousDate) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            const isRecent =
                logDate.getTime() === today.getTime() ||
                logDate.getTime() === yesterday.getTime()

            tempStreak = isRecent ? 1 : 0
        } else {
            const expectedDate = new Date(previousDate)
            expectedDate.setDate(expectedDate.getDate() - 1)

            if (logDate.getTime() === expectedDate.getTime()) {
                tempStreak++
            } else {
                if (currentStreak === 0) currentStreak = tempStreak
                longestStreak = Math.max(longestStreak, tempStreak)
                tempStreak = 1
            }
        }

        previousDate = logDate
    }

    if (currentStreak === 0) currentStreak = tempStreak
    longestStreak = Math.max(longestStreak, tempStreak)

    return { currentStreak, longestStreak }
}

export const getUserSpiritualStats = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Member not found')

    const allLogs = await prisma.spiritualLog.findMany({
        where: { userId },
    })

    const totalDaysPrayed = allLogs.filter((l) => l.prayed).length
    const totalDaysStudied = allLogs.filter((l) => l.studiedBible).length
    const totalDaysBoth = allLogs.filter(
        (l) => l.prayed && l.studiedBible
    ).length

    const { currentStreak, longestStreak } = await getUserStreak(userId)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const thisMonthLogs = allLogs.filter(
        (l) => new Date(l.logDate) >= startOfMonth
    )

    const thisMonthPrayed = thisMonthLogs.filter((l) => l.prayed).length
    const thisMonthStudied = thisMonthLogs.filter(
        (l) => l.studiedBible
    ).length

    return {
        totalDaysPrayed,
        totalDaysStudied,
        totalDaysBoth,
        currentStreak,
        longestStreak,
        thisMonthPrayed,
        thisMonthStudied,
    }
}

export const getCongregationSpiritualStats = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [
        totalLogsToday,
        prayedToday,
        studiedToday,
        totalLogsThisMonth,
    ] = await Promise.all([
        prisma.spiritualLog.count({
            where: { logDate: { gte: today } },
        }),
        prisma.spiritualLog.count({
            where: { logDate: { gte: today }, prayed: true },
        }),
        prisma.spiritualLog.count({
            where: { logDate: { gte: today }, studiedBible: true },
        }),
        prisma.spiritualLog.count({
            where: { logDate: { gte: startOfMonth } },
        }),
    ])

    const trend = await Promise.all(
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const endOfDate = new Date(date)
            endOfDate.setHours(23, 59, 59, 999)

            return Promise.all([
                prisma.spiritualLog.count({
                    where: {
                        logDate: { gte: date, lte: endOfDate },
                        prayed: true,
                    },
                }),
                prisma.spiritualLog.count({
                    where: {
                        logDate: { gte: date, lte: endOfDate },
                        studiedBible: true,
                    },
                }),
            ]).then(([prayed, studied]) => ({
                date: date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
                prayed,
                studied,
            }))
        })
    )

    return {
        today: {
            totalLogs: totalLogsToday,
            prayed: prayedToday,
            studied: studiedToday,
        },
        thisMonth: { totalLogs: totalLogsThisMonth },
        trend: trend.reverse(),
    }
}