'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, BellOff, Plus, Trash2 } from 'lucide-react'
import api from '@/services/api'

interface Announcement {
    id: string
    title: string
    content: string
    isActive: boolean
    expiresAt: string | null
    createdAt: string
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/announcements').then(({ data }) => {
            setAnnouncements(data.data)
            setLoading(false)
        })
    }, [])

    const handleToggle = async (id: string) => {
        const { data } = await api.patch(`/announcements/${id}/toggle`)
        setAnnouncements((prev) =>
            prev.map((a) => (a.id === id ? data.data : a))
        )
    }

    const handleDelete = async (id: string) => {
        await api.delete(`/announcements/${id}`)
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
                    <p className="text-slate-500">Manage church communications</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Announcement
                </Button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <Card
                            key={announcement.id}
                            className={`border-l-4 ${announcement.isActive
                                    ? 'border-l-green-500'
                                    : 'border-l-slate-300 opacity-60'
                                }`}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base font-semibold text-slate-800">
                                        {announcement.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${announcement.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {announcement.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => handleToggle(announcement.id)}
                                            className="p-1 hover:bg-slate-100 rounded"
                                            title="Toggle active"
                                        >
                                            {announcement.isActive ? (
                                                <BellOff className="h-4 w-4 text-slate-500" />
                                            ) : (
                                                <Bell className="h-4 w-4 text-green-600" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className="p-1 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-slate-600">{announcement.content}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span>
                                        Posted {new Date(announcement.createdAt).toLocaleDateString()}
                                    </span>
                                    {announcement.expiresAt && (
                                        <span>
                                            Expires {new Date(announcement.expiresAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}