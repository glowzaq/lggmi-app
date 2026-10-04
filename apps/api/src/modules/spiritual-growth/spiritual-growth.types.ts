export interface CreateSpiritualLogInput {
    userId: string
    prayed: boolean
    studiedDevotionals?: boolean
    studiedBible?: boolean
    note?: string
    logDate?: string
}

export interface UpdateSpiritualLogInput {
    prayed?: boolean
    studiedDevotionals?: boolean
    studiedBible?: boolean
    note?: string
}