'use client'

import { useEffect, useState } from 'react'
import api from '@/services/api'

interface CurrentUser {
    id: string           // this is the only ID we ever need
    email: string
    role: string
    firstName: string
    lastName: string
    phone: string | null
    address: string | null
    dateOfBirth: string | null
    gender: string | null
    maritalStatus: string | null
    occupation: string | null
    joinedAt: string
    family: { id: string; name: string } | null
    isActive: boolean
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        api
            .get('/auth/me')
            .then(({ data }) => setUser(data.data))
            .catch(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
            .finally(() => setLoading(false))
    }, [])

    return { user, loading }
}