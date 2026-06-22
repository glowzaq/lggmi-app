import prisma from '../../utils/prisma';
import { UpdateMemberInput } from './members.types';

export const getAllMembers = async () => {
    return prisma.member.findMany({
        where: {isActive: true},
        include: {
            user: {select: {email: true, role: true}},
            family: true
        },
        orderBy: {createdAt: 'desc'},
    });
}

export const getMyProfile = async (userId: string) => {
    const member = await prisma.member.findUnique({
        where: {userId: String(userId)},
        include: {user: true},
    })

    if (!member) throw new Error('Profile not found')
    
    return member
}

export const getMemberById = async (id: string) => {
    const member = await prisma.member.findUnique({
        where: {id},
        include: {
            user: {select: {email: true, role: true}},
            family: true,
            attendances: {
                include: {event: true},
                orderBy: {createdAt: 'desc'},
                take: 10,
            },
            donations: {
                orderBy: {donatedAt: 'desc'},
                take: 10,
            }
        }
    })

    if (!member) throw new Error('Member not found');

    return member;
}

export const updateMember = async (id: string, input: UpdateMemberInput) => {
    const member = await prisma.member.findUnique({where: {id}});

    if (!member) throw new Error('Member not found');

    return prisma.member.update({
        where: {id},
        data: {
            ...input,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        }
    });
}

export const deactivateMember = async (id: string) => {
    const member = await prisma.member.findUnique({where: {id}});

    if (!member) throw new Error('Member not found');

    return prisma.member.update({
        where: {id},
        data: {isActive: false}
    });
}

export const getMemberStats = async () => {
    const [total, men, women, newThisMonth] = await Promise.all([
        prisma.member.count({where: {isActive: true}}),
        prisma.member.count({where: {isActive: true, gender: 'MALE'}}),
        prisma.member.count({where: {isActive: true, gender: 'FEMALE'}}),
        prisma.member.count({
            where: {
                isActive: true,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                }
            }
        })
    ])

    return {total, men, women, newThisMonth}
}