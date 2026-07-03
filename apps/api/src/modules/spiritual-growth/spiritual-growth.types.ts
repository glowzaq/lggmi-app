export interface CreateSpiritualLogInput {
    userId: string
    prayed: boolean
    studiedBible: boolean
    note?: string
    logDate?: string
}

export interface UpdateSpiritualLogInput {
    prayed?: boolean
    studiedBible?: boolean
    note?: string
}