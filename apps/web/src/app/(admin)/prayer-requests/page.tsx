'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Clock, CheckCircle, Star } from 'lucide-react'
import api from '@/services/api'

interface PrayerRequest {
    id: string
    title: string
    content: string
    status: 'PENDING' | 'PRAYED' | 'ANSWERED'
    isPrivate: boolean
    createdAt: string
    member: { firstName: string; lastName: string }
}

const statusConfig = {
    PENDING: {
        label: 'Pending',
        icon: Clock,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        badge: 'bg-orange-100 text-orange-700',
    },
    PRAYED: {
        label: 'Prayed',
        icon: Heart,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-700',
    },
    ANSWERED: {
        label: 'Answered',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        badge: 'bg-green-100 text-green-700',
    },
}

export default function PrayerRequestsPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([])
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/prayer-requests'),
            api.get('/prayer-requests/stats'),
        ]).then(([reqRes, statsRes]) => {
            setRequests(reqRes.data.data)
            setStats(statsRes.data.data)
            setLoading(false)
        })
    }, [])

    const handleStatusUpdate = async (
        id: string,
        status: 'PENDING' | 'PRAYED' | 'ANSWERED'
    ) => {
        const { data } = await api.patch(`/prayer-requests/${id}/status`, { status })
        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: data.data.status } : r))
        )
    }

    const filtered = activeFilter
        ? requests.filter((r) => r.status === activeFilter)
        : requests

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Prayer Requests</h1>
                <p className="text-slate-500">View and manage congregation prayer needs</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <Card
                            key={key}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                                setActiveFilter(activeFilter === key ? null : key)
                            }
                        >
                            <CardContent className="pt-4">
                                <div className={`p-2 rounded-lg ${config.bg} w-fit mb-2`}>
                                    <config.icon className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats[key.toLowerCase()]}
                                </p>
                                <p className="text-sm text-slate-500">{config.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="p-2 rounded-lg bg-slate-100 w-fit mb-2">
                                <Star className="h-4 w-4 text-slate-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            <p className="text-sm text-slate-500">Total</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Requests list */}
            {loading ? (
                <p className="text-slate-500">Loading prayer requests...</p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((request) => {
                        const config = statusConfig[request.status]
                        return (
                            <Card key={request.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold text-slate-800">
                                                {request.title}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {request.member.firstName} {request.member.lastName}
                                                {request.isPrivate && (
                                                    <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                                        Private
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${config.badge}`}
                                        >
                                            {config.label}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-slate-600">{request.content}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                        {/* Status action buttons */}
                                        <div className="flex gap-2">
                                            {request.status !== 'PRAYED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(request.id, 'PRAYED')}
                                                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                                >
                                                    Mark Prayed
                                                </button>
                                            )}
                                            {request.status !== 'ANSWERED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(request.id, 'ANSWERED')}
                                                    className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                                                >
                                                    Mark Answered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}