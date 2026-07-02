export interface RegisterInput {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role?: 'PASTOR' | 'ADMIN' | 'MEMBER'
}

export interface LoginInput {
    email: string
    password: string
}

export interface JwtPayload {
    userId: string
    email: string
    role: string
}