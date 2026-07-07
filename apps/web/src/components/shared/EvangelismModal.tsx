'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface EvangelismModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
  record?: any
}

export default function EvangelismModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  record,
}: EvangelismModalProps) {
  const isEdit = !!record
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: record?.title ?? '',
    date: record?.date
      ? new Date(record.date).toISOString().slice(0, 10)
      : '',
    location: record?.location ?? '',
    numberOfReached: record?.numberOfReached ?? 0,
    numberOfConverted: record?.numberOfConverted ?? 0,
    numberOfFilledSpirit: record?.numberOfFilledSpirit ?? 0,
    followedUp: record?.followedUp ?? false,
    followUpNote: record?.followUpNote ?? '',
    assimilated: record?.assimilated ?? 0,
    notes: record?.notes ?? '',
  })

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.title || !form.date) {
      setError('Title and date are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await api.patch(`/evangelism/${record.id}`, form)
      } else {
        await api.post('/evangelism', {
          ...form,
          conductedById: userId,
        })
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
      title={isEdit ? 'Edit Evangelism Record' : 'New Evangelism Record'}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Street Outreach - Maitama"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Wuse Market, Abuja"
          />
        </div>

        {/* Numbers grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Number Reached</Label>
            <Input
              type="number"
              min="0"
              value={form.numberOfReached}
              onChange={(e) =>
                set('numberOfReached', Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Number Converted</Label>
            <Input
              type="number"
              min="0"
              value={form.numberOfConverted}
              onChange={(e) =>
                set('numberOfConverted', Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Filled with Spirit</Label>
            <Input
              type="number"
              min="0"
              value={form.numberOfFilledSpirit}
              onChange={(e) =>
                set('numberOfFilledSpirit', Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assimilated to Church</Label>
            <Input
              type="number"
              min="0"
              value={form.assimilated}
              onChange={(e) =>
                set('assimilated', Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Followed up toggle */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <input
            type="checkbox"
            id="followedUp"
            checked={form.followedUp}
            onChange={(e) => set('followedUp', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label
            htmlFor="followedUp"
            className="text-sm font-medium text-slate-800 cursor-pointer"
          >
            Converts were followed up
          </label>
        </div>

        {form.followedUp && (
          <div className="space-y-1.5">
            <Label>Follow Up Note</Label>
            <textarea
              value={form.followUpNote}
              onChange={(e) => set('followUpNote', e.target.value)}
              placeholder="Describe how follow up was done..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200
                rounded-md text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label>General Notes</Label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Any additional notes about this outreach..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-200
              rounded-md text-sm resize-none focus:outline-none
              focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className='bg-[#3f2039] text-white hover:bg-[#3f2039] hover:text-white' disabled={loading}>
            {loading
              ? 'Saving...'
              : isEdit
              ? 'Save Changes'
              : 'Create Record'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}