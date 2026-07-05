import prisma from '../../utils/prisma'
import {
    CreateMonthlyThemeInput,
    UpdateMonthlyThemeInput,
} from './monthly-theme.types'

export const createMonthlyTheme = async (
    input: CreateMonthlyThemeInput
) => {
    const existing = await prisma.monthlyTheme.findUnique({
        where: { month_year: { month: input.month, year: input.year } },
    })
    if (existing) {
        throw new Error(
            'A theme already exists for this month. Edit the existing one instead.'
        )
    }

    await prisma.monthlyTheme.updateMany({
        data: { isActive: false },
    })

    return prisma.monthlyTheme.create({
        data: { ...input, isActive: true },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

export const getActiveTheme = async () => {
    return prisma.monthlyTheme.findFirst({
        where: { isActive: true },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

export const getAllThemes = async () => {
    return prisma.monthlyTheme.findMany({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

export const updateMonthlyTheme = async (
    id: string,
    input: UpdateMonthlyThemeInput
) => {
    const theme = await prisma.monthlyTheme.findUnique({ where: { id } })
    if (!theme) throw new Error('Theme not found')
    return prisma.monthlyTheme.update({ where: { id }, data: input })
}

export const setActiveTheme = async (id: string) => {
    // Deactivate all
    await prisma.monthlyTheme.updateMany({ data: { isActive: false } })
    // Activate selected
    return prisma.monthlyTheme.update({
        where: { id },
        data: { isActive: true },
    })
}

export const deleteMonthlyTheme = async (id: string) => {
    const theme = await prisma.monthlyTheme.findUnique({ where: { id } })
    if (!theme) throw new Error('Theme not found')
    return prisma.monthlyTheme.delete({ where: { id } })
}