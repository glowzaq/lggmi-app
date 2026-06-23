'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface SermonModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    sermon?: any
}

export default function SermonModal({
    isOpen,
    onClose,
    onSuccess,
    sermon,
}: SermonModalProps) {
    const isEdit = !!sermon
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: sermon?.title ?? '',
        speaker: sermon?.speaker ?? '',
        sermonDate: sermon?.sermonDate
            ? new Date(sermon.sermonDate).toISOString().slice(0, 10)
            : '',
        seriesName: sermon?.seriesName ?? '',
        description: sermon?.description ?? '',
        videoUrl: sermon?.videoUrl ?? '',
        audioUrl: sermon?.audioUrl ?? '',
    })

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        if (!form.title || !form.speaker || !form.sermonDate) {
            setError('Title, speaker and date are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (isEdit) {
                await api.patch(`/sermons/${sermon.id}`, form)
            } else {
                await api.post('/sermons', form)
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
            title={isEdit ? 'Edit Sermon' : 'Add Sermon'}
            size="lg"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Title *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => set('title', e.target.value)}
                            placeholder="Sermon title"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Speaker *</Label>
                        <Input
                            value={form.speaker}
                            onChange={(e) => set('speaker', e.target.value)}
                            placeholder="e.g. Pastor John"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Date *</Label>
                        <Input
                            type="date"
                            value={form.sermonDate}
                            onChange={(e) => set('sermonDate', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Series Name</Label>
                        <Input
                            value={form.seriesName}
                            onChange={(e) => set('seriesName', e.target.value)}
                            placeholder="e.g. Walking by Faith"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Brief description of the sermon"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md
              text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Video URL</Label>
                        <Input
                            value={form.videoUrl}
                            onChange={(e) => set('videoUrl', e.target.value)}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Audio URL</Label>
                        <Input
                            value={form.audioUrl}
                            onChange={(e) => set('audioUrl', e.target.value)}
                            placeholder="https://soundcloud.com/..."
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Sermon'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}