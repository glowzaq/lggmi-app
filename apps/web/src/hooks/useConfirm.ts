'use client'

import { useState, useCallback } from 'react'

interface ConfirmOptions {
    title: string
    message: string
    confirmLabel?: string
    confirmClassName?: string
}

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<ConfirmOptions>({
        title: '',
        message: '',
    })
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => Promise<void>) | null> (null)

    const confirm = useCallback(
        (opts: ConfirmOptions, callback: () => Promise<void>) => {
            setOptions(opts)
            setOnConfirmCallback(() => callback)
            setIsOpen(true)
        },
        []
    )

    const handleConfirm = async () => {
        if (!onConfirmCallback) return
        setLoading(true)
        try {
            await onConfirmCallback()
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    }

    const handleClose = () => {
        if (loading) return
        setIsOpen(false)
    }

    return {
        confirm,
        dialogProps: {
            isOpen,
            onClose: handleClose,
            onConfirm: handleConfirm,
            loading,
            ...options,
        },
    }
}