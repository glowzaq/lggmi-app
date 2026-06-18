import prisma from "../../utils/prisma";
import { BulkAttendanceInput, MarkAttendanceInput } from "./attendance.types";

export const markAttendance = async (input: MarkAttendanceInput) => {
    const {memberId, eventId, status, note} = input

    const [member, event] = await Promise.all([
        prisma.member.findUnique({where: {id: memberId}}),
        prisma.event.findUnique({where: {id: eventId}}),
    ])

    if(!member) throw new Error('Member not found')
    if(!event) throw new Error('Event not found')

    return prisma.attendance.upsert({
        where: {
            memberId_eventId: {memberId, eventId},
        },
        create: {
            memberId, eventId, status: status || 'PRESENT', note
        },
        update: {
            status: status || 'PRESENT', note
        },
    })
}

export const bulkMarkAttendance = async (input: BulkAttendanceInput) => {
    const {eventId, records} = input

    const event = await prisma.event.findUnique({where: {id: eventId}})
    if(!event) throw new Error('Event not found')
    
    const results = await prisma.$transaction(
        records.map((record) => 
        prisma.attendance.upsert({
            where: {
                memberId_eventId: {
                    memberId: record.memberId,
                    eventId,
                },
            },
            create: {
                memberId: record.memberId,
                eventId,
                status: record.status,
                note: record.note,
            },
            update: {
                status: record.status,
                note: record.note,
            },
        }),
        )
    )
    return results
}

export const getAttendanceByEvent = async (eventId: string) => {
    const event = await prisma.event.findUnique({where: {id: eventId}})
    if(!event) throw new Error("Event not found")

    const attendances = await prisma.attendance.findMany({
        where: {eventId},
        include: {
            member: {
                select: {
                    id: true,
                    gender: true,
                    firstName: true,
                    lastName: true
                },
            },
        },
        orderBy: {createdAt: 'asc'},
    })

    const summary = {
        total: attendances.length,
        present: attendances.filter((a)=>a.status === 'PRESENT').length,
        absent: attendances.filter((a)=>a.status === 'ABSENT').length,
        excused: attendances.filter((a)=>a.status === 'EXCUSED').length,
    }

    return {event, attendances, summary}
}

export const getMemberAttendance = async (memberId: string) => {
    const member = await prisma.member.findUnique({where: {id: memberId}})
    if(!member) throw new Error('Member not found')

    const attendances = await prisma.attendance.findMany({
        where: {memberId},
        include: {event: true},
        orderBy: {createdAt: 'desc'},
    })

    const total = attendances.length
    const present = attendances.filter((a)=>a.status === 'PRESENT').length
    const attendanceRate = total > 0 ? Math.round((present/total) * 100) : 0

    return {attendances, summary: {total, present, attendanceRate}}
}

export const getAttendanceStats = async () => {
    const recentEvents = await prisma.event.findMany({
        where: {startTime: {lte: new Date()}},
        orderBy: {startTime: 'desc'},
        take: 6,
        include: {
            _count: {
                select: {attendances: true},
            },
            attendances: {
                where: {status: 'PRESENT'},
            },
        },
    })

    const trend = recentEvents.reverse().map((event)=>({
        name: event.title,
        date: event.startTime,
        present: event.attendances.length,
        total: event._count.attendances,
    }))

    return {trend}
}