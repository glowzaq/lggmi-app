'use client'

import AnnouncementModal from "@/components/admin/AnnouncementModal"
import DashboardLayout from "@/components/layout/DashboardLayout"
import EmptyState from "@/components/shared/EmptyState"
import Spinner from "@/components/shared/Spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/services/api"
import { Bell, BellOff, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface Announcement {
    id: string
    title: string
    content: string
    isActive: boolean
    expiresAt: string | null
    createdAt: string
}

export default function WorkerAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const fetchAnnouncements = async () => {
        const { data } = await api.get('/announcements')
        setAnnouncements(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchAnnouncements() }, [])

    const handleToggle = async (id: string) => {
        const { data } = await api.patch(`/announcements/${id}/toggle`)
        setAnnouncements((prev) =>
            prev.map((a) => (a.id === id ? data.data : a))
        )
    }

    const handleOpenCreate = () => {
        setModalOpen(true)
    }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Announcements
                        </h1>
                        <p className="text-slate-500">
                            Manage Church Communications
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-[#693565]"
                    >
                        <Plus className="h-4 w-4"/>
                        New Announcement
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading announcements..."/>
                    </div>
                ) : announcements.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No announcements yet"
                        description="Post first announcement"
                        action={
                            <Button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2 bg-[#693565]"
                            >
                                <Plus className="h-4 w-4"/> New Announcement
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann) => (
                            <Card
                                key={ann.id}
                                className={`border-l-4 transition-opacity ${ann.isActive ? 'border-l-purple-400' : 'border-l-slate-300 opacity-60'

                                }`}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <CardTitle className="text-base font-semibold text-slate-800">
                                            {ann.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ann.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {ann.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleToggle(ann.id)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Toggle active"
                                            >
                                                {ann.isActive ? <BellOff className="h-4 w-4 text-slate-500"/> : <Bell className="h-4 w-4 text-green-600"/>}
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-slate-600">{ann.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span>
                                            Posted{' '}
                                            {new Date(ann.createdAt).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        {ann.expiresAt && (
                                            <span>
                                                Expires{' '}
                                                {new Date(ann.expiresAt).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <AnnouncementModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchAnnouncements}
            />
        </DashboardLayout>
    )
}