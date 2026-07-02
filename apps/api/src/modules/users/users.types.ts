export interface UpdateUserInput {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    gender?: 'MALE' | 'FEMALE'
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED'
    occupation?: string
    familyId?: string
}