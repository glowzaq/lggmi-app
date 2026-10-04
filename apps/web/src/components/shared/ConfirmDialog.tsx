'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    confirmClassName?: string
    loading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmClassName = 'bg-red-600 hover:bg-red-700 text-white',
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={confirmClassName}
                    >
                        {loading ? 'Please wait...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}