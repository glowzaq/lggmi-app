export interface CreateDonationInput {
    amount: number
    type?:
    | 'OFFERING'
    | 'COMMITMENT_SEED'
    | 'OTHER'
    note?: string
    date?: string
    eventId?: string
}

export interface UpdateDonationInput extends Partial<CreateDonationInput> { }

export interface DonationReportFilter {
    startDate?: string
    endDate?: string
    type?: string
    eventId?: string
}