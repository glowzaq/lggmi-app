'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, BookOpen, DollarSign } from 'lucide-react'
import api from '@/services/api'

interface Stats {
    total: number
    men: number
    women: number
    newThisMonth: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        api.get('/members/stats').then(({ data }) => setStats(data.data))
    }, [])

    const cards = [
        {
            title: 'Total Members',
            value: stats?.total ?? '—',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'New This Month',
            value: stats?.newThisMonth ?? '—',
            icon: Calendar,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            title: 'Men',
            value: stats?.men ?? '—',
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'Women',
            value: stats?.women ?? '—',
            icon: Users,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500">Welcome back. Here's what's happening.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}