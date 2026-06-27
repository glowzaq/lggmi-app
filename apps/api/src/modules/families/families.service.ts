import prisma from '../../utils/prisma'

export const getAllFamilies = async () => {
    return prisma.family.findMany({
        include: {
            _count: { select: { members: true } },
        },
        orderBy: { name: 'asc' },
    })
}

export const createFamily = async (name: string) => {
    const existing = await prisma.family.findFirst({ where: { name } })
    if (existing) throw new Error('A family group with this name already exists')
    return prisma.family.create({ data: { name } })
}

export const deleteFamily = async (id: string) => {
    const family = await prisma.family.findUnique({ where: { id } })
    if (!family) throw new Error('Family not found')
    return prisma.family.delete({ where: { id } })
}