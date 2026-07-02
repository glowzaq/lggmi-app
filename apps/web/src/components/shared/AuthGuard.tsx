'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthGuardProps {
    children: React.ReactNode
    allowedRoles?: string[]
}

export default function AuthGuard({children, allowedRoles}: AuthGuardProps){
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (!token || !userStr) {
            router.replace('/login')
            return
        }

        const user = JSON.parse(userStr)

        if(allowedRoles && !allowedRoles.includes(user.role)) {
            if (user.role === 'PASTOR') router.replace('/pastor/dashboard')
            else if (user.role === 'ADMIN') router.replace('/admin/dashboard')
            else if (user.role === 'WORKER') router.replace('/worker/dashboard')
            else router.replace('/member/dashboard')
            
            return
        }

        setAuthorized(true)
    }, [])
    
    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-3">
                    <div className="text-4xl">⛪</div>
                    <p className="text-slate-500 text-sm">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}