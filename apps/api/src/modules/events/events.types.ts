export interface CreateEventInput {
    title: string;
    description?: string;
    type?:
    |'SUNDAY_SERVICE'
    |'MOMENT_OF_LIFTING'
    |'LET_THE_FIRE_FALL'
    | 'OTHER'
    location?: string;
    startTime: string;
    endTime: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {}