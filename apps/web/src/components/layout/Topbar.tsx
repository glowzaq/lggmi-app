'use client'

import { useEffect, useState } from 'react'
import { Bell, SparklesIcon } from 'lucide-react'
import api from '@/services/api'

export default function Topbar() {
    const [user, setUser] = useState<any>(null)
    const [announcements, setAnnouncements] = useState(0)
    const [theme, setTheme] = useState<any>(null)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))

        api.get('/announcements/active').then(({ data }) => {
            setAnnouncements(data.data.length)
        })

        api.get('/monthly-theme/active').then(({ data }) => {
            setTheme(data.data)
        })
    }, [])

    return (
        <header className="h-14 bg-white border-b border-[#f0e4ef] flex items-center justify-between px-6 shrink-0">
            <p className="text-slate-500 text-sm">
                {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>
            <div className="flex items-center gap-4">
                {theme && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-lg border-[#3f2039]">
                        <SparklesIcon className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <p className="text-xs text-[#693565] font-medium truncate max-w-[200px]">
                            {theme.title}
                        </p>
                    </div>
                )}
                
                {user && (
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-slate-500 leading-tight">
                                Hi, {user.firstName}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}