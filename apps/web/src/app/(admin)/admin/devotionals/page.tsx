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
import { BookMarked, Plus, Pencil, Trash2 } from 'lucide-react'
import api from '@/services/api'
import { useConfirm } from '@/hooks/useConfirm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Devotional {
    id: string
    title: string
    scripture: string
    scriptureText: string | null
    body: string
    prayerPoint: string
    devotionalDate: string
    author: string
    createdBy: { firstName: string; lastName: string }
}

export default function AdminDevotionalsPage() {
    const [devotionals, setDevotionals] = useState<Devotional[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingDevotional, setEditingDevotional] =
        useState<Devotional | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        scripture: '',
        scriptureText: '',
        body: '',
        prayerPoint: '',
        author: '',
        devotionalDate: new Date().toISOString().slice(0, 10),
    })

    const { confirm, dialogProps } = useConfirm()

    const fetchDevotionals = async () => {
        const { data } = await api.get('/devotionals')
        setDevotionals(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchDevotionals() }, [])

    const handleOpenCreate = () => {
        setEditingDevotional(null)
        setForm({
            title: '',
            scripture: '',
            scriptureText: '',
            body: '',
            prayerPoint: '',
            author: '',
            devotionalDate: new Date().toISOString().slice(0, 10),
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (d: Devotional) => {
        setEditingDevotional(d)
        setForm({
            title: d.title,
            scripture: d.scripture,
            scriptureText: d.scriptureText ?? '',
            body: d.body,
            prayerPoint: d.prayerPoint,
            author: d.author,
            devotionalDate: new Date(d.devotionalDate)
                .toISOString()
                .slice(0, 10),
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        if (!form.title || !form.scripture || !form.body || !form.prayerPoint) {
            setError('Title, scripture, body and prayer point are required')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            if (editingDevotional) {
                await api.patch(`/devotionals/${editingDevotional.id}`, form)
            } else {
                await api.post('/devotionals', form)
            }
            setModalOpen(false)
            fetchDevotionals()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        confirm(
            {
            title: 'Delete Record',
            message: 'This action cannot be undone. Are you sure?',
            confirmLabel: 'Yes, Delete',
        },
        async () => {
            await api.delete(`/devotionals/${id}`)
            setDevotionals((prev) => prev.filter((d) => d.id !== id))
        }
    )
}

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Daily Devotionals
                        </h1>
                        <p className="text-slate-500">
                            Create and manage daily devotional content for members
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-[#3f2039] hover:bg-[#693565] "
                    >
                        <Plus className="h-4 w-4" />
                        Add Devotional
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading devotionals..." />
                    </div>
                ) : devotionals.length === 0 ? (
                    <EmptyState
                        icon={BookMarked}
                        title="No devotionals yet"
                        description="Create the first daily devotional for your congregation"
                        action={
                            <Button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2 bg-[#3f2039] hover:bg-[#693565]"
                            >
                                <Plus className="h-4 w-4" /> New Devotional
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {devotionals.map((d) => (
                            <Card key={d.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-[#693565] font-medium">
                                                {new Date(d.devotionalDate).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </p>
                                            <CardTitle className="text-base font-semibold
                        text-slate-800 mt-0.5">
                                                {d.title}
                                            </CardTitle>
                                            <p className="text-sm text-[#693565] font-medium mt-0.5">
                                                📖 {d.scripture}
                                            </p>
                                            <p className='text-sm text-slate-500 font-small mt-0.5'>
                                                {d.author}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => handleOpenEdit(d)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg
                          transition-colors"
                                            >
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg
                          transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {d.scriptureText && (
                                        <p className="text-xs text-slate-500 italic border-l-2
                      border-[#693565] pl-3">
                                            "{d.scriptureText}"
                                        </p>
                                    )}
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {d.body}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Posted by {d.createdBy.firstName} {d.createdBy.lastName}
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
                title={editingDevotional ? 'Edit Devotional' : 'New Daily Devotional'}
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Title *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                placeholder="e.g. Walking by Faith"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={form.devotionalDate}
                                onChange={(e) =>
                                    setForm({ ...form, devotionalDate: e.target.value })
                                }
                                disabled={!!editingDevotional}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Author</Label>
                        <Input
                            value={form.author}
                            onChange={(e) =>
                                setForm({ ...form, author: e.target.value })
                            }
                            placeholder="e.g. Pastor Folu"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Scripture Reference *</Label>
                        <Input
                            value={form.scripture}
                            onChange={(e) =>
                                setForm({ ...form, scripture: e.target.value })
                            }
                            placeholder="e.g. Hebrews 11:1"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Scripture Text (optional)</Label>
                        <textarea
                            value={form.scriptureText}
                            onChange={(e) =>
                                setForm({ ...form, scriptureText: e.target.value })
                            }
                            placeholder="Paste the actual scripture verse here..."
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Devotional Body *</Label>
                        <textarea
                            value={form.body}
                            onChange={(e) =>
                                setForm({ ...form, body: e.target.value })
                            }
                            placeholder="Write the devotional message here..."
                            rows={5}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Prayer Point *</Label>
                        <textarea
                            value={form.prayerPoint}
                            onChange={(e) =>
                                setForm({ ...form, prayerPoint: e.target.value })
                            }
                            placeholder="e.g. Lord, help me to trust you in every situation..."
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-500"
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
                        <Button onClick={handleSubmit} disabled={submitting} className='bg-[#3f2039] hover:bg-[#693565]'>
                            {submitting
                                ? 'Saving...'
                                : editingDevotional
                                    ? 'Save Changes'
                                    : 'Publish Devotional'}
                        </Button>
                    </div>
                </div>
            </Modal>
            <ConfirmDialog {...dialogProps} />
        </DashboardLayout>
    )
}