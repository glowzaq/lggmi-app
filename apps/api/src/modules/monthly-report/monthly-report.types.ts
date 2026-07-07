export interface CreateMonthlyReportInput {
    month: number
    year: number
    themeTitle?: string
    totalMeetings: number
    regularAttendance: number
    inviteesCount: number
    notes?: string
}

export interface UpdateMonthlyReportInput
    extends Partial<CreateMonthlyReportInput> {}