'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/shared/Modal'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { FileText, Plus, Pencil } from 'lucide-react'
import api from '@/services/api'

interface MonthlyReport {
    id: string
    month: number
    year: number
    themeTitle: string | null
    totalMeetings: number
    regularAttendance: number
    inviteesCount: number
    notes: string | null
    createdBy: { firstName: string; lastName: string }
}

const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
]

export default function PastorMonthlyReportPage() {
    const [reports, setReports] = useState<MonthlyReport[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchReports = async () => {
        const { data } = await api.get('/monthly-report')
        setReports(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchReports() }, [])


    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Monthly Reports
                        </h1>
                        <p className="text-slate-500">
                            Church activity summary by month
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading reports..." />
                    </div>
                ) : reports.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No reports yet"
                        description="No report found"
                    />
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <Card key={report.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-800">
                                                {MONTHS[report.month - 1]} {report.year}
                                            </CardTitle>
                                            {report.themeTitle && (
                                                <p className="text-sm text-purple-600 font-medium mt-0.5">
                                                    Theme: {report.themeTitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 mb-3">
                                        {[
                                            {
                                                label: 'Total Meetings',
                                                value: report.totalMeetings,
                                                color: 'text-blue-600',
                                            },
                                            {
                                                label: 'Regular Members',
                                                value: report.regularAttendance,
                                                color: 'text-green-600',
                                            },
                                            {
                                                label: 'Invitees/Newcomers',
                                                value: report.inviteesCount,
                                                color: 'text-orange-600',
                                            },
                                        ].map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="text-center p-3 bg-slate-50 rounded-lg"
                                            >
                                                <p className={`text-2xl font-bold ${stat.color}`}>
                                                    {stat.value}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 font-medium">
                                            Total Attendance
                                        </p>
                                        <p className="text-xl font-bold text-slate-800 mt-0.5">
                                            {report.regularAttendance + report.inviteesCount}
                                        </p>
                                    </div>

                                    {report.notes && (
                                        <p className="text-sm text-slate-600 mt-3 italic">
                                            {report.notes}
                                        </p>
                                    )}

                                    <p className="text-xs text-slate-400 mt-3">
                                        Created by{' '}
                                        <span className="font-medium text-slate-600">
                                            {report.createdBy.firstName} {report.createdBy.lastName}
                                        </span>
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}