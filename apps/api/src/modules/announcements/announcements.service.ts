import prisma from "../../utils/prisma";
import { CreateAnnouncementInput, UpdateAnnouncementInput } from "./announcements.types";

export const createAnnouncement = async (input: CreateAnnouncementInput) => {
    return prisma.announcement.create({
        data: {
            ...input,
            expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        },
    })
}

export const getAllAnnouncements = async () => {
    return prisma.announcement.findMany({
        orderBy: {createdAt: 'desc'},
    })
}

export const getActiveAnnouncements = async () => {
    return prisma.announcement.findMany({
        where: {
            isActive: true,
            OR: [
                {expiresAt: null},
                {expiresAt: {gte: new Date()}},
            ],
        },
        orderBy: {createdAt: 'desc'},
    })
}

export const getAnnouncementById = async (id: string) => {
    const announcement = await prisma.announcement.findUnique({where: {id}})
    if(!announcement) throw new Error('Announcement not found')
    
    return announcement
}

export const updateAnnouncement = async (id: string, input: UpdateAnnouncementInput) => {
    const announcement = await prisma.announcement.findUnique({where: {id}})
    if(!announcement) throw new Error('Announcement not found')

    return prisma.announcement.update({
        where: {id},
        data: {
            ...input,
            expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined
        },
    })
}

export const deleteAnnouncement = async (id: string) => {
    const announcement = await prisma.announcement.findUnique({where: {id}})
    if(!announcement) throw new Error('Announcement not found')

    return prisma.announcement.delete({where: {id}})
}

export const toggleAnnouncement = async (id: string) => {
    const announcement = await prisma.announcement.findUnique({where: {id}})
    if (!announcement) throw new Error('Announcement not found')

    return prisma.announcement.update({
        where: {id},
        data: {isActive: !announcement.isActive},
    })
}