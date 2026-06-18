export interface CreateDonationInput {
    memberId: string
    amount: number
    type?: 'TITHES' | 'OFFERING' | 'SPECIAL_SEED' | 'OTHER'
    note?: string
    donatedAt?: string
}

export interface UpdateDonationInput extends Partial<CreateDonationInput> {}

export interface DonationReportFilter {
    startDate?: string
    endDate?: string
    type?: string
    memberId?: string
}