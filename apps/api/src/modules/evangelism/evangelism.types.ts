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
}

export interface UpdateEvangelismInput extends Partial<CreateEvangelismInput> {}