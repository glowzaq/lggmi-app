export interface UpdateMemberInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE';
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
    occupation?: string;
    familyId?: string;
}