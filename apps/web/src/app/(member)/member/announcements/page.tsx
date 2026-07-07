'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { Bell, Clock, Sparkle } from 'lucide-react'
import api from '@/services/api'

interface Announcement {
    id: string
    title: string
    content: string
    createdAt: string
    expiresAt: string | null
}

export default function MemberAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/announcements/active').then(({ data }) => {
            setAnnouncements(data.data)
            setLoading(false)
        })
    }, [])

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
                    <p className="text-slate-500">
                        Latest news and updates from the church
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner text="Loading announcements..." />
                    </div>
                ) : announcements.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No announcements"
                        description="There are no active announcements at the moment"
                    />
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann, index) => (
                            <Card
                                key={ann.id}
                                className="border-l-4 border-l-[#9c5e96] hover:shadow-md transition-shadow"
                            >
                                <CardContent className="pt-4 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold text-slate-800">
                                            {ann.title}
                                        </h3>
                                        {index === 0 && (
                                            <Sparkle />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {ann.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Posted{' '}
                                            {new Date(ann.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        {ann.expiresAt && (
                                            <span>
                                                Expires{' '}
                                                {new Date(ann.expiresAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}