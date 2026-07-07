export interface CreateWelfareInput {
    title: string
    description: string
    amount: number
    date?: string
    recipient?: string
    notes?: string
    createdById: string
}

export interface UpdateWelfareInput extends Partial<CreateWelfareInput> {}