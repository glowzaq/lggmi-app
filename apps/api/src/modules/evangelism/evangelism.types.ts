export interface CreateEvangelismInput {
    title: string
    date: string
    location?: string
    numberOfReached?: number
    numberOfConverted?: number
    numberOfFilledSpirit?: number
    followedUp?: boolean
    followUpNote?: string
    notes?: string
    assimilated?: number
    conductedById: string
    ageGroup?: 'TEEN' | 'CHILD' | 'ADULT' | 'SENIOR' | 'ALL'
}

export interface UpdateEvangelismInput extends Partial<CreateEvangelismInput> {}