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
import { Sparkles, Plus, Pencil, Trash2, Check } from 'lucide-react'
import api from '@/services/api'

interface MonthlyTheme {
    id: string
    title: string
    scripture: string | null
    month: number
    year: number
    isActive: boolean
    createdBy: { firstName: string; lastName: string }
}

const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
]

export default function AdminMonthlyThemePage() {
    const [themes, setThemes] = useState<MonthlyTheme[]>([])
    const [activeTheme, setActiveTheme] = useState<MonthlyTheme | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTheme, setEditingTheme] = useState<MonthlyTheme | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        scripture: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })

    const fetchData = async () => {
        const [themesRes, activeRes] = await Promise.all([
            api.get('/monthly-theme'),
            api.get('/monthly-theme/active'),
        ])
        setThemes(themesRes.data.data)
        setActiveTheme(activeRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleOpenCreate = () => {
        setEditingTheme(null)
        setForm({
            title: '',
            scripture: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (theme: MonthlyTheme) => {
        setEditingTheme(theme)
        setForm({
            title: theme.title,
            scripture: theme.scripture ?? '',
            month: theme.month,
            year: theme.year,
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        if (!form.title) {
            setError('Theme title is required')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            if (editingTheme) {
                await api.patch(`/monthly-theme/${editingTheme.id}`, {
                    title: form.title,
                    scripture: form.scripture || undefined,
                })
            } else {
                await api.post('/monthly-theme', form)
            }
            setModalOpen(false)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleActivate = async (id: string) => {
        await api.patch(`/monthly-theme/${id}/activate`)
        fetchData()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this theme?')) return
        await api.delete(`/monthly-theme/${id}`)
        setThemes((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Theme of the Month
                        </h1>
                        <p className="text-slate-500">
                            Set and manage monthly church themes
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex bg-[#3f2039] hover:bg-[#693565] text-white items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Theme
                    </Button>
                </div>

                {/* Active theme banner */}
                {activeTheme && (
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700
            rounded-xl p-5 text-white">
                        <p className="text-purple-200 text-xs font-medium uppercase tracking-wider">
                            Current Theme — {MONTHS[activeTheme.month - 1]} {activeTheme.year}
                        </p>
                        <h2 className="text-2xl font-bold mt-1">{activeTheme.title}</h2>
                        {activeTheme.scripture && (
                            <p className="text-purple-200 text-sm mt-1 italic">
                                "{activeTheme.scripture}"
                            </p>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading themes..." />
                    </div>
                ) : themes.length === 0 ? (
                    <EmptyState
                        icon={Sparkles}
                        title="No themes yet"
                        description="Create the first theme of the month"
                        action={
                            <Button onClick={handleOpenCreate} className="flex bg-[#3f2039] hover:bg-[#693565] text-white items-center gap-2">
                                <Plus className="h-4 w-4" /> New Theme
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <Card
                                key={theme.id}
                                className={`hover:shadow-md transition-shadow ${theme.isActive ? 'border-purple-400 border-2' : ''
                                    }`}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {MONTHS[theme.month - 1]} {theme.year}
                                            </p>
                                            <CardTitle className="text-base font-semibold
                        text-slate-800 mt-0.5">
                                                {theme.title}
                                            </CardTitle>
                                        </div>
                                        {theme.isActive && (
                                            <span className="text-xs bg-purple-100 text-purple-700
                        px-2 py-0.5 rounded-full font-medium shrink-0">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {theme.scripture && (
                                        <p className="text-xs text-slate-500 italic">
                                            "{theme.scripture}"
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 pt-1 border-t">
                                        {!theme.isActive && (
                                            <button
                                                onClick={() => handleActivate(theme.id)}
                                                className="flex items-center gap-1 text-xs px-2 py-1
                          bg-purple-50 text-purple-700 rounded hover:bg-purple-100
                          transition-colors"
                                            >
                                                <Check className="h-3 w-3" />
                                                Set Active
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleOpenEdit(theme)}
                                            className="p-1.5 hover:bg-slate-100 rounded transition-colors ml-auto"
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(theme.id)}
                                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setError('') }}
                title={editingTheme ? 'Edit Theme' : 'New Theme of the Month'}
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Theme Title *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Walking in Faith"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Scripture Reference</Label>
                        <Input
                            value={form.scripture}
                            onChange={(e) =>
                                setForm({ ...form, scripture: e.target.value })
                            }
                            placeholder="e.g. Hebrews 11:1"
                        />
                    </div>

                    {!editingTheme && (
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
                    focus:ring-2 focus:ring-blue-500"
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

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => { setModalOpen(false); setError('') }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className='bg:[#3f2039] text-white hover:bg[#693565]' disabled={submitting}>
                            {submitting
                                ? 'Saving...'
                                : editingTheme ? 'Save Changes' : 'Create Theme'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}