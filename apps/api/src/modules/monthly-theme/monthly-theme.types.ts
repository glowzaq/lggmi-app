export interface CreateMonthlyThemeInput {
    title: string;
    scripture?: string
    month: number;
    year: number;
    createdById: string;
}

export interface UpdateMonthlyThemeInput extends Partial<CreateMonthlyThemeInput> {
    title?: string;
    scripture?: string;
}