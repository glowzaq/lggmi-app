import prisma from '../../utils/prisma'
import {
    CreateMonthlyReportInput,
    UpdateMonthlyReportInput,
} from './monthly-report.types'

export const createMonthlyReport = async (
    input: CreateMonthlyReportInput,
    createdById: string
) => {
    const existing = await prisma.monthlyReport.findUnique({
        where: { month_year: { month: input.month, year: input.year } },
    })
    if (existing) {
        throw new Error(
            'A report already exists for this month. Edit the existing one.'
        )
    }

    return prisma.monthlyReport.create({
        data: { ...input, createdById },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

export const getAllReports = async () => {
    return prisma.monthlyReport.findMany({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
}

export const getReportById = async (id: string) => {
    const report = await prisma.monthlyReport.findUnique({
        where: { id },
        include: {
            createdBy: { select: { firstName: true, lastName: true } },
        },
    })
    if (!report) throw new Error('Report not found')
    return report
}

export const updateReport = async (
    id: string,
    input: UpdateMonthlyReportInput
) => {
    const report = await prisma.monthlyReport.findUnique({ where: { id } })
    if (!report) throw new Error('Report not found')
    return prisma.monthlyReport.update({ where: { id }, data: input })
}

export const deleteReport = async (id: string) => {
    const report = await prisma.monthlyReport.findUnique({ where: { id } })
    if (!report) throw new Error('Report not found')
    return prisma.monthlyReport.delete({ where: { id } })
}