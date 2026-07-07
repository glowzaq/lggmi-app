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
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5
    bg-purple-50 rounded-lg border border-purple-200">
                        <SparklesIcon className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <p className="text-xs text-purple-700 font-medium truncate max-w-[200px]">
                            {theme.title}
                        </p>
                    </div>
                )}
                <div className="relative">
                    <Bell className="h-5 w-5 text-slate-500" />
                    {announcements > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-100 text-green-900 text-xs rounded-full flex items-center justify-center">
                            {announcements}
                        </span>
                    )}
                </div>
                
                {user && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#693565] flex items-center justify-center text-[#f0e4ef] text-sm font-semibold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-slate-800 leading-tight">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                                {user.role?.toLowerCase()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}