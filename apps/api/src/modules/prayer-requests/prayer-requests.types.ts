export interface CreatePrayerRequestInput {
    userId: string
    title: string
    content: string
    isPrivate?: boolean
}

export interface UpdatePrayerRequestInput {
    title?: string
    content?: string
    isPrivate?: boolean
    status?: 'PENDING' | 'PRAYED' | 'ANSWERED'
}