export interface CreateTestimonyInput {
    userId: string
    title: string
    content: string
    date: string
}

export interface UpdateTestimonyInput extends Partial<CreateTestimonyInput> {
    title?: string
    content?: string
    date?: string
}