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

export default function AdminMonthlyReportPage() {
    const [reports, setReports] = useState<MonthlyReport[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingReport, setEditingReport] = useState<MonthlyReport | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        themeTitle: '',
        totalMeetings: 0,
        regularAttendance: 0,
        inviteesCount: 0,
        notes: '',
    })

    const fetchReports = async () => {
        const { data } = await api.get('/monthly-report')
        setReports(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchReports() }, [])

    const handleOpenCreate = () => {
        setEditingReport(null)
        setForm({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            themeTitle: '',
            totalMeetings: 0,
            regularAttendance: 0,
            inviteesCount: 0,
            notes: '',
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (report: MonthlyReport) => {
        setEditingReport(report)
        setForm({
            month: report.month,
            year: report.year,
            themeTitle: report.themeTitle ?? '',
            totalMeetings: report.totalMeetings,
            regularAttendance: report.regularAttendance,
            inviteesCount: report.inviteesCount,
            notes: report.notes ?? '',
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError('')

        try {
            if (editingReport) {
                await api.patch(`/monthly-report/${editingReport.id}`, form)
            } else {
                await api.post('/monthly-report', form)
            }
            setModalOpen(false)
            fetchReports()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <DashboardLayout role="ADMIN">
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
                    <Button
                        onClick={handleOpenCreate}
                        className="flex bg-[#3f2039] hover:bg-[#693565] text-white items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Report
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading reports..." />
                    </div>
                ) : reports.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No reports yet"
                        description="Create the first monthly report"
                        action={
                            <Button onClick={handleOpenCreate} className="flex bg-[#3f2039] hover:bg-[#693565] text-white items-center gap-2">
                                <Plus className="h-4 w-4" /> New Report
                            </Button>
                        }
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
                                        <button
                                            onClick={() => handleOpenEdit(report)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Pencil className="h-4 w-4 text-slate-500" />
                                        </button>
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

            <Modal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setError('') }}
                title={editingReport ? 'Edit Monthly Report' : 'New Monthly Report'}
                size="lg"
            >
                <div className="space-y-4">
                    {!editingReport && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Month</Label>
                                <select
                                    value={form.month}
                                    onChange={(e) =>
                                        setForm({ ...form, month: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border border-slate-200
                    rounded-md text-sm bg-white focus:outline-none
                    focus:ring-2 focus:ring-[#693565]"
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={m} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Year</Label>
                                <Input
                                    type="number"
                                    value={form.year}
                                    onChange={(e) =>
                                        setForm({ ...form, year: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label>Theme of the Month</Label>
                        <Input
                            value={form.themeTitle}
                            onChange={(e) =>
                                setForm({ ...form, themeTitle: e.target.value })
                            }
                            placeholder="e.g. Walking in Faith"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Total Meetings</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.totalMeetings}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        totalMeetings: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Regular Members</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.regularAttendance}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        regularAttendance: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Invitees/Newcomers</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.inviteesCount}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        inviteesCount: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">
                            Total Attendance:{' '}
                            <span className="font-bold text-slate-800">
                                {form.regularAttendance + form.inviteesCount}
                            </span>
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Notes</Label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="General notes about this month..."
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-[#693565]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => { setModalOpen(false); setError('') }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting} className='bg-[#3f2039] hover:bg-[#693565] text-white'>
                            {submitting
                                ? 'Saving...'
                                : editingReport ? 'Save Changes' : 'Create Report'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}