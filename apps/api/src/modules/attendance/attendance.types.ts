export interface CreateAttendanceInput {
    eventId?: string;
    maleCount?: number;
    femaleCount?: number;
    childrenCount?: number;
    newcomersCount?: number;
    date?: string;
    note?: string;
}

export interface UpdateAttendanceInput extends Partial<CreateAttendanceInput> {}