import prisma from '../../utils/prisma'
import {
    CreateAttendanceInput,
    UpdateAttendanceInput,
} from './attendance.types'

export const createAttendance = async (input: CreateAttendanceInput) => {
    const maleCount = input.maleCount ?? 0
    const femaleCount = input.femaleCount ?? 0
    const childrenCount = input.childrenCount ?? 0
    const newcomersCount = input.newcomersCount ?? 0
    const totalCount = maleCount + femaleCount + childrenCount + newcomersCount

    return prisma.attendance.create({
        data: {
            date: input.date ? new Date(input.date) : new Date(),
            maleCount,
            femaleCount,
            childrenCount,
            newcomersCount,
            totalCount,
            note: input.note,
            eventId: input.eventId || undefined,
        },
        include: {
            event: { select: { title: true, type: true } },
        },
    })
}

export const getAllAttendance = async () => {
    return prisma.attendance.findMany({
        orderBy: { date: 'desc' },
        include: {
            event: { select: { title: true, type: true } },
        },
    })
}

export const getAttendanceById = async (id: string) => {
    const record = await prisma.attendance.findUnique({
        where: { id },
        include: {
            event: { select: { title: true, type: true } },
        },
    })
    if (!record) throw new Error('Attendance record not found')
    return record
}

export const updateAttendance = async (
    id: string,
    input: UpdateAttendanceInput
) => {
    const record = await prisma.attendance.findUnique({ where: { id } })
    if (!record) throw new Error('Attendance record not found')

    const maleCount = input.maleCount ?? record.maleCount
    const femaleCount = input.femaleCount ?? record.femaleCount
    const childrenCount = input.childrenCount ?? record.childrenCount
    const newcomersCount = input.newcomersCount ?? record.newcomersCount
    const totalCount = maleCount + femaleCount + childrenCount + newcomersCount

    return prisma.attendance.update({
        where: { id },
        data: {
            date: input.date ? new Date(input.date) : undefined,
            maleCount,
            femaleCount,
            childrenCount,
            newcomersCount,
            totalCount,
            note: input.note,
            eventId: input.eventId,
        },
    })
}

export const deleteAttendance = async (id: string) => {
    const record = await prisma.attendance.findUnique({ where: { id } })
    if (!record) throw new Error('Attendance record not found')
    return prisma.attendance.delete({ where: { id } })
}

export const getAttendanceStats = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [allTime, thisMonth, recentRecords] = await Promise.all([
        prisma.attendance.aggregate({
            _sum: {
                totalCount: true,
                maleCount: true,
                femaleCount: true,
                childrenCount: true,
                newcomersCount: true,
            },
        }),
        prisma.attendance.aggregate({
            _sum: { totalCount: true },
            where: { date: { gte: startOfMonth } },
        }),
        prisma.attendance.findMany({
            orderBy: { date: 'desc' },
            take: 6,
            include: {
                event: { select: { title: true } },
            },
        }),
    ])

    const trend = recentRecords.reverse().map((r) => ({
        name: r.event?.title ?? new Date(r.date).toLocaleDateString(),
        date: r.date,
        total: r.totalCount,
        male: r.maleCount,
        female: r.femaleCount,
        children: r.childrenCount,
        newcomers: r.newcomersCount,
    }))

    return {
        allTime: {
            total: allTime._sum.totalCount ?? 0,
            male: allTime._sum.maleCount ?? 0,
            female: allTime._sum.femaleCount ?? 0,
            children: allTime._sum.childrenCount ?? 0,
            newcomers: allTime._sum.newcomersCount ?? 0,
        },
        thisMonth: thisMonth._sum.totalCount ?? 0,
        trend,
    }
}