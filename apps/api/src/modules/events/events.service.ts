import prisma from "../../utils/prisma"
import { CreateEventInput, UpdateEventInput } from "./events.types"

export const createEvent = async (input: CreateEventInput) => {
    return prisma.event.create({
        data: {
            ...input,
            startTime: new Date(input.startTime),
            endTime: input.endTime ? new Date(input.endTime) : undefined
        }
    })
}

export const getAllEvents = async () => {
    return prisma.event.findMany({
        orderBy: {startTime: 'desc'},
        include: {
            _count: {select: {attendances: true}}
        },
    })
}

export const getUpcomingEvents = async () => {
    return prisma.event.findMany({
        where: {
            startTime: {gte: new Date()},
        },
        orderBy: {startTime: 'asc'},
        take: 10,
    })
}

export const getEventById = async (id: string) => {
    const event = await prisma.event.findUnique({
        where: {id},
        include: {
            attendances: {
                include: {
                    user: {
                        select: {firstName: true, lastName: true},
                    },
                },
            },
            _count: {select: {attendances: true}},
        },
    })

    if (!event) throw new Error('Event not found')
    
    return event
}

export const updateEvent = async (id: string, input: UpdateEventInput) => {
    const event = await prisma.event.findUnique({where: {id}})
    if (!event) throw new Error('Event not found');

    return prisma.event.update({
        where: {id},
        data: {
            ...input,
            startTime: input.startTime ? new Date(input.startTime) : undefined,
            endTime: input.endTime ? new Date(input.endTime) : undefined,
        },
    })
}

export const deleteEvent = async (id: string) => {
    const event = await prisma.event.findUnique({where: {id}})

    if(!event) throw new Error('Event not found');
    
    return prisma.event.delete({where: {id}})
}

export const getEventStats = async () => {
    const [total, upcoming, thisMonth] = await Promise.all([
        prisma.event.count(),
        prisma.event.count({
            where: {startTime: {gte: new Date()}},
        }),
        prisma.event.count({
            where: {
                startTime: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                },
            },
        }),
    ])

    return {total, upcoming, thisMonth}
}