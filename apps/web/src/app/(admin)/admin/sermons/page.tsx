'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Play, Mic, Plus } from 'lucide-react'
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

export default function SermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([])
    const [series, setSeries] = useState<string[]>([])
    const [activeSeries, setActiveSeries] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/sermons'),
            api.get('/sermons/series'),
        ]).then(([sermonsRes, seriesRes]) => {
            setSermons(sermonsRes.data.data)
            setSeries(seriesRes.data.data)
            setLoading(false)
        }).catch((err) => {
            console.error("Failed to fetch sermons:", err)
            setLoading(false)
        })
    }, [])

    const filtered = activeSeries
        ? sermons.filter((s) => s.seriesName === activeSeries)
        : sermons

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sermons</h1>
                    <p className="text-slate-500">Browse and manage sermon archive</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Sermon
                </Button>
            </div>

            {/* Series filter */}
            {series.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveSeries(null)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!activeSeries
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        All
                    </button>
                    {series.map((s) => (
                        <button
                            key={s}
                            onClick={() => setActiveSeries(s)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeSeries === s
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">Loading sermons...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((sermon) => (
                        <Card key={sermon.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-slate-800 leading-tight">
                                            {sermon.title}
                                        </CardTitle>
                                        {sermon.seriesName && (
                                            <p className="text-xs text-blue-600 font-medium mt-1">
                                                {sermon.seriesName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mic className="h-4 w-4" />
                                    {sermon.speaker}
                                </div>
                                <p className="text-xs text-slate-400">
                                    {new Date(sermon.sermonDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        dayPeriod: undefined
                                    })}
                                </p>
                                {sermon.description && (
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {sermon.description}
                                    </p>
                                )}
                                {(sermon.videoUrl || sermon.audioUrl) && (
                                    <div className="flex gap-2 pt-1">
                                        {sermon.videoUrl && (
                                            <a
                                                href={sermon.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
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
                                                className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                                            >
                                                <Play className="h-3 w-3" />
                                                Listen
                                            </a>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}