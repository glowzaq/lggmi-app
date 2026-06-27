import prisma from '../../utils/prisma'
import { MarkAttendanceInput, BulkAttendanceInput } from './attendance.types'

export const markAttendance = async (input: MarkAttendanceInput) => {
    const { userId, eventId, status, note } = input

    const [user, event] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.event.findUnique({ where: { id: eventId } }),
    ])

    if (!user) throw new Error('Member not found')
    if (!event) throw new Error('Event not found')

    return prisma.attendance.upsert({
        where: { userId_eventId: { userId, eventId } },
        create: { userId, eventId, status: status || 'PRESENT', note },
        update: { status: status || 'PRESENT', note },
    })
}

export const bulkMarkAttendance = async (input: BulkAttendanceInput) => {
    const { eventId, records } = input

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new Error('Event not found')

    return prisma.$transaction(
        records.map((record) =>
            prisma.attendance.upsert({
                where: {
                    userId_eventId: { userId: record.userId, eventId },
                },
                create: {
                    userId: record.userId,
                    eventId,
                    status: record.status,
                    note: record.note,
                },
                update: { status: record.status, note: record.note },
            })
        )
    )
}

export const getAttendanceByEvent = async (eventId: string) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new Error('Event not found')

    const attendances = await prisma.attendance.findMany({
        where: { eventId },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    })

    const summary = {
        total: attendances.length,
        present: attendances.filter((a) => a.status === 'PRESENT').length,
        absent: attendances.filter((a) => a.status === 'ABSENT').length,
        excused: attendances.filter((a) => a.status === 'EXCUSED').length,
    }

    return { event, attendances, summary }
}

export const getUserAttendance = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Member not found')

    const attendances = await prisma.attendance.findMany({
        where: { userId },
        include: { event: true },
        orderBy: { createdAt: 'desc' },
    })

    const total = attendances.length
    const present = attendances.filter((a) => a.status === 'PRESENT').length
    const attendanceRate =
        total > 0 ? Math.round((present / total) * 100) : 0

    return { attendances, summary: { total, present, attendanceRate } }
}

export const getAttendanceStats = async () => {
    const recentEvents = await prisma.event.findMany({
        where: { startTime: { lte: new Date() } },
        orderBy: { startTime: 'desc' },
        take: 6,
        include: {
            _count: { select: { attendances: true } },
            attendances: { where: { status: 'PRESENT' } },
        },
    })

    const trend = recentEvents.reverse().map((event) => ({
        name: event.title,
        date: event.startTime,
        present: event.attendances.length,
        total: event._count.attendances,
    }))

    return { trend }
}