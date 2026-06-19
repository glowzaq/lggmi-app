export interface CreatePrayerRequestInput {
    memberId: string
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