'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { BookOpen, Play, Mic, Headphones } from 'lucide-react'
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

export default function PastorSermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([])
    const [series, setSeries] = useState<string[]>([])
    const [activeSeries, setActiveSeries] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/sermons'),
            api.get('/sermons/series'),
        ]).then(([s, sr]) => {
            setSermons(s.data.data)
            setSeries(sr.data.data)
            setLoading(false)
        })
    }, [])

    const filtered = activeSeries
        ? sermons.filter((s) => s.seriesName === activeSeries)
        : sermons

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sermons</h1>
                    <p className="text-slate-500">
                        Watch and listen to past messages
                    </p>
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
                    <div className="py-16 flex justify-center">
                        <Spinner text="Loading sermons..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No sermons found"
                        description="Sermons will appear here once they are uploaded"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((sermon) => (
                            <Card
                                key={sermon.id}
                                className="hover:shadow-md transition-shadow flex flex-col"
                            >
                                <CardContent className="pt-4 flex flex-col flex-1 space-y-3">
                                    {/* Icon + series */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                                            <BookOpen className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-slate-800 leading-tight
                        line-clamp-2">
                                                {sermon.title}
                                            </h3>
                                            {sermon.seriesName && (
                                                <p className="text-xs text-blue-600 font-medium mt-0.5">
                                                    {sermon.seriesName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5">
                                            <Mic className="h-3.5 w-3.5 text-slate-400" />
                                            {sermon.speaker}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(sermon.sermonDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    {sermon.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 flex-1">
                                            {sermon.description}
                                        </p>
                                    )}

                                    {(sermon.videoUrl || sermon.audioUrl) && (
                                        <div className="flex gap-2 pt-2 border-t mt-auto">
                                            {sermon.videoUrl && (
                                                <a
                                                    href={sermon.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs
                                            bg-blue-600 text-white px-3 py-1.5 rounded-lg
                                            hover:bg-blue-700 transition-colors"
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
                                                    className="flex items-center gap-1.5 text-xs
                                    bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg
                                    hover:bg-slate-200 transition-colors"
                                                >
                                                    <Headphones className="h-3 w-3" />
                                                    Listen
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
                }
            </div >
        </DashboardLayout >
    )
}