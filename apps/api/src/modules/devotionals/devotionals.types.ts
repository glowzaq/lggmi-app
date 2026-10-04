export interface CreateDevotionalInput {
    title: string
    scripture: string
    scriptureText?: string
    body: string
    prayerPoint: string
    devotionalDate?: string
    author?: string
    createdById: string
}

export interface UpdateDevotionalInput {
    title?: string
    scripture?: string
    scriptureText?: string
    body?: string
    prayerPoint: string
    author?: string
}