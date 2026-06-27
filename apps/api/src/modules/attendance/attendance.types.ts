export interface MarkAttendanceInput {
    userId: string;
    eventId: string;
    note?: string;
    status?: 'PRESENT' | 'ABSENT' | 'EXCUSED'
}

export interface BulkAttendanceInput {
    eventId: string;
    records: {
        userId: string
        status: 'PRESENT' | 'ABSENT' | 'EXCUSED'
        note?: string
    }[]
}