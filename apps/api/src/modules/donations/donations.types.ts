export interface CreateDonationInput {
    userId: string
    amount: number
    type?: 'TITHE' | 'OFFERING' | 'SPECIAL_SEED' | 'OTHER'
    note?: string
    donatedAt?: string
}

export interface UpdateDonationInput extends Partial<CreateDonationInput> {}

export interface DonationReportFilter {
    startDate?: string
    endDate?: string
    type?: string
    userId?: string
}