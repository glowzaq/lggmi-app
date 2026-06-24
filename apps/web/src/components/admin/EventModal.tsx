'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    event?: any
}

const eventTypes = [
    'SUNDAY_SERVICE',
    'BIBLE_STUDY',
    'PRAYER_MEETING',
    'SPECIAL_PROGRAM',
    'YOUTH_SERVICE',
    'OTHER',
]

export default function EventModal({
    isOpen,
    onClose,
    onSuccess,
    event,
}: EventModalProps) {
    const isEdit = !!event
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: event?.title ?? '',
        type: event?.type ?? 'SUNDAY_SERVICE',
        location: event?.location ?? '',
        description: event?.description ?? '',
        startTime: event?.startTime
            ? new Date(event.startTime).toISOString().slice(0, 16)
            : '',
        endTime: event?.endTime
            ? new Date(event.endTime).toISOString().slice(0, 16)
            : '',
    })

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    useEffect(() => {
        if (isOpen) {
            setForm({
                title: event?.title ?? '',
                type: event?.type ?? 'SUNDAY_SERVICE',
                location: event?.location ?? '',
                description: event?.description ?? '',
                startTime: event?.startTime
                    ? new Date(event.startTime).toISOString().slice(0, 16)
                    : '',
                endTime: event?.endTime
                    ? new Date(event.endTime).toISOString().slice(0, 16)
                    : '',
            })
            setError('')
        }
    }, [event, isOpen])

    const handleSubmit = async () => {
        if (!form.title || !form.startTime) {
            setError('Title and start time are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (isEdit) {
                await api.patch(`/events/${event.id}`, form)
            } else {
                await api.post('/events', form)
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
            title={isEdit ? 'Edit Event' : 'Create Event'}
        >
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="e.g. Sunday Morning Service"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Type</Label>
                    <select
                        value={form.type}
                        onChange={(e) => set('type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {eventTypes.map((t) => (
                            <option key={t} value={t}>
                                {t.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input
                        value={form.location}
                        onChange={(e) => set('location', e.target.value)}
                        placeholder="e.g. Main Auditorium"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Start Time *</Label>
                        <Input
                            type="datetime-local"
                            value={form.startTime}
                            onChange={(e) => set('startTime', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>End Time</Label>
                        <Input
                            type="datetime-local"
                            value={form.endTime}
                            onChange={(e) => set('endTime', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Optional details about this event"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#693465] hover:bg-[#52284f] text-white"
                    >
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}