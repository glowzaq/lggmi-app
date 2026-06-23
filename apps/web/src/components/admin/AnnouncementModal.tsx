'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface AnnouncementModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    announcement?: any
}

export default function AnnouncementModal({
    isOpen,
    onClose,
    onSuccess,
    announcement,
}: AnnouncementModalProps) {
    const isEdit = !!announcement
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: announcement?.title ?? '',
        content: announcement?.content ?? '',
        expiresAt: announcement?.expiresAt
            ? new Date(announcement.expiresAt).toISOString().slice(0, 10)
            : '',
    })

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError('Title and content are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (isEdit) {
                await api.patch(`/announcements/${announcement.id}`, form)
            } else {
                await api.post('/announcements', form)
            }
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Announcement' : 'New Announcement'}
        >
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="Announcement title"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Content *</Label>
                    <textarea
                        value={form.content}
                        onChange={(e) => set('content', e.target.value)}
                        placeholder="Write your announcement here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Expiry Date (optional)</Label>
                    <Input
                        type="date"
                        value={form.expiresAt}
                        onChange={(e) => set('expiresAt', e.target.value)}
                    />
                    <p className="text-xs text-slate-400">
                        Leave blank to keep active indefinitely
                    </p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Post Announcement'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}