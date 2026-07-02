export interface CreateAnnouncementInput {
    title: string
    content: string
    isActive: boolean
    expiresAt: string
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {}