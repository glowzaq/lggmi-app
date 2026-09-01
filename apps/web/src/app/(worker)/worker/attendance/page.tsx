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
import { CheckSquare, Plus, Pencil, Trash2, Users } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import api from '@/services/api'

interface AttendanceRecord {
    id: string
    date: string
    maleCount: number
    femaleCount: number
    childrenCount: number
    newcomersCount: number
    totalCount: number
    note: string | null
    event: { title: string; type: string } | null
}

export default function WorkerAttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [stats, setStats] = useState<any>(null)
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        eventId: '',
        date: new Date().toISOString().slice(0, 10),
        maleCount: 0,
        femaleCount: 0,
        childrenCount: 0,
        newcomersCount: 0,
        note: '',
    })

    const fetchData = async () => {
        const [recordsRes, statsRes, eventsRes] = await Promise.all([
            api.get('/attendance'),
            api.get('/attendance/stats'),
            api.get('/events'),
        ])
        setRecords(recordsRes.data.data)
        setStats(statsRes.data.data)
        setEvents(eventsRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const totalForForm =
        form.maleCount + form.femaleCount +
        form.childrenCount + form.newcomersCount

    const handleOpenCreate = () => {
        setForm({
            eventId: '',
            date: new Date().toISOString().slice(0, 10),
            maleCount: 0,
            femaleCount: 0,
            childrenCount: 0,
            newcomersCount: 0,
            note: '',
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError('')

        try {
                await api.post('/attendance', {
                    ...form,
                    eventId: form.eventId || undefined,
                })
            setModalOpen(false)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
                        <p className="text-slate-500">
                            Record service attendance by category
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center text-white hover:bg-[#3f2029] bg-[#693565] gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Record Attendance
                    </Button>
                </div>

                {/* All time stats */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {[
                            { label: 'Total (All Time)', value: stats.allTime?.total ?? 0, color: 'text-slate-800' },
                            { label: 'Men', value: stats.allTime?.male ?? 0, color: 'text-[#9B7E93]' },
                            { label: 'Women', value: stats.allTime?.female ?? 0, color: 'text-[#D4AFA0]' },
                            { label: 'Children', value: stats.allTime?.children ?? 0, color: 'text-[#A8B8A6]' },
                            { label: 'Newcomers', value: stats.allTime?.newcomers ?? 0, color: 'text-[#d6b68d]' },
                        ].map((s) => (
                            <Card key={s.label}>
                                <CardContent className="pt-4 text-center">
                                    <p className={`text-2xl font-bold ${s.color}`}>
                                        {s.value}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Trend chart */}
                {stats?.trend?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Recent Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={stats.trend}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(v) => v.split(' ')[0]}
                                    />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="male" fill="#9B7E93" name="Men" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="female" fill="#D4AFA0" name="Women" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="children" fill="#A8B8A6" name="Children" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="newcomers" fill="#d6b68d" name="Newcomers" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Records list */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading attendance records..." />
                    </div>
                ) : records.length === 0 ? (
                    <EmptyState
                        icon={CheckSquare}
                        title="No attendance records yet"
                        description="Start recording attendance for your services"
                        action={
                            <Button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Record Attendance
                            </Button>
                        }
                    />
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-slate-50">
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Event / Date
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Men
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Women
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Children
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Newcomers
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Total
                                            </th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="border-b last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-800">
                                                        {record.event?.title ?? '—'}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(record.date).toLocaleDateString(
                                                            'en-US',
                                                            { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-blue-600 font-medium">
                                                    {record.maleCount}
                                                </td>
                                                <td className="px-4 py-3 text-pink-600 font-medium">
                                                    {record.femaleCount}
                                                </td>
                                                <td className="px-4 py-3 text-green-600 font-medium">
                                                    {record.childrenCount}
                                                </td>
                                                <td className="px-4 py-3 text-orange-600 font-medium">
                                                    {record.newcomersCount}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-slate-800">
                                                    {record.totalCount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setError('') }}
                title={'Record Attendance'}
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Service / Event (optional)</Label>
                        <select
                            value={form.eventId}
                            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select an event...</option>
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.title} — {new Date(e.startTime).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </div>

                    {/* Count inputs */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-blue-600">Men</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.maleCount}
                                onChange={(e) =>
                                    setForm({ ...form, maleCount: Number(e.target.value) })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-pink-600">Women</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.femaleCount}
                                onChange={(e) =>
                                    setForm({ ...form, femaleCount: Number(e.target.value) })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-green-600">Children</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.childrenCount}
                                onChange={(e) =>
                                    setForm({ ...form, childrenCount: Number(e.target.value) })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-orange-600">Newcomers</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.newcomersCount}
                                onChange={(e) =>
                                    setForm({ ...form, newcomersCount: Number(e.target.value) })
                                }
                            />
                        </div>
                    </div>

                    {/* Live total */}
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center
            justify-between">
                        <p className="text-sm text-slate-600 font-medium">
                            Total Attendance
                        </p>
                        <p className="text-xl font-bold text-slate-800">{totalForForm}</p>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Note (optional)</Label>
                        <Input
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder="Any notes about this service..."
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
                        <Button onClick={handleSubmit} className='hover:bg-[#3f2039] text-white bg-[#693565]' disabled={submitting}>
                            {submitting
                                ? 'Saving...'
                                : 'Record Attendance'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}