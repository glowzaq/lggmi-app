'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import SermonModal from '@/components/admin/SermonModal'
import {
    BookOpen, Play, Mic, Plus,
    Pencil, Trash2, Headphones,
} from 'lucide-react'
import api from '@/services/api'

interface Sermon {
    id: string
    title: string
    speaker: string
    sermonDate: string
    seriesName: string | null
    videoUrl: string | null
    audioUrl: string | null
    description: string | null
}

export default function WorkerSermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([])
    const [series, setSeries] = useState<string[]>([])
    const [activeSeries, setActiveSeries] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const fetchSermons = async () => {
        const [sermonsRes, seriesRes] = await Promise.all([
            api.get('/sermons'),
            api.get('/sermons/series'),
        ])
        setSermons(sermonsRes.data.data)
        setSeries(seriesRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchSermons() }, [])

    const handleOpenCreate = () => {
        setModalOpen(true)
    }

    const filtered = activeSeries
        ? sermons.filter((s) => s.seriesName === activeSeries)
        : sermons

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Sermons</h1>
                        <p className="text-slate-500">
                            Manage the church sermon archive
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-[#693565]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Sermon
                    </Button>
                </div>

                {series.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveSeries(null)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium
                transition-colors ${!activeSeries
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            All
                        </button>
                        {series.map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveSeries(s)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSeries === s
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading sermons..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No sermons yet"
                        description="Add your first sermon to the archive"
                        action={
                            <Button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2 bg-[#693565]"
                            >
                                <Plus className="h-4 w-4" /> Add Sermon
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((sermon) => (
                            <Card
                                key={sermon.id}
                                className="hover:shadow-md transition-shadow flex flex-col"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-sm font-semibold
                        text-slate-800 leading-tight line-clamp-2">
                                                {sermon.title}
                                            </CardTitle>
                                            {sermon.seriesName && (
                                                <p className="text-xs text-blue-600 font-medium mt-0.5">
                                                    {sermon.seriesName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Mic className="h-3.5 w-3.5" />
                                        {sermon.speaker}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {new Date(sermon.sermonDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    {sermon.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 flex-1">
                                            {sermon.description}
                                        </p>
                                    )}

                                    <div className="pt-2 border-t flex items-center
                    justify-between mt-auto">
                                        {/* Media links */}
                                        <div className="flex gap-2">
                                            {sermon.videoUrl && (
                                                <a
                                                    href={sermon.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs
                                            text-blue-600 hover:underline"
                                                >
                                                    <Play className="h-3 w-3" />
                                                    Watch
                                                </a>
                                            )}
                                            {sermon.audioUrl && (
                                                <a
                                                    href={sermon.audioUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs
                                        text-green-600 hover:underline"
                                                >
                                                    <Headphones className="h-3 w-3" />
                                                    Listen
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
                }
            </div >

            < SermonModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchSermons}
            />
        </DashboardLayout >
    )
}