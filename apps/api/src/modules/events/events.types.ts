export interface CreateEventInput {
    title: string;
    description?: string;
    type?:
    |'SUNDAY_SERVICE'
    | 'BIBLE_STUDY'
    | 'PRAYER_MEETING'
    | 'SPECIAL_PROGRAM'
    | 'OTHER'
    location?: string;
    startTime: string;
    endTime: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {}