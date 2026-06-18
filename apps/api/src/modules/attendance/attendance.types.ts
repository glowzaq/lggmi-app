export interface MarkAttendanceInput {
    memberId: string;
    eventId: string;
    note?: string;
    status?: 'PRESENT' | 'ABSENT' | 'EXCUSED'
}

export interface BulkAttendanceInput {
    eventId: string;
    records: {
        memberId: string
        status: 'PRESENT' | 'ABSENT' | 'EXCUSED'
        note?: string
    }[]
}