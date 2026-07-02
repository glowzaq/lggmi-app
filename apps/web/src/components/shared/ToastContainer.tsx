'use client'

import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}

interface ToastContainerProps {
    toasts: Toast[]
    dismiss: (id: string) => void
}

const config = {
    success: {
        icon: CheckCircle,
        bg: 'bg-green-50 border-green-200',
        icon_color: 'text-green-600',
        text: 'text-green-800',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-50 border-red-200',
        icon_color: 'text-red-600',
        text: 'text-red-800',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 border-blue-200',
        icon_color: 'text-blue-600',
        text: 'text-blue-800',
    },
}

export default function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
    if (!toasts.length) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {toasts.map((t) => {
                const c = config[t.type]
                return (
                    <div
                        key={t.id}
                        className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg ${c.bg} animate-in slide-in-from-right`}
                    >
                        <c.icon className={`h-4 w-4 shrink-0 mt-0.5 ${c.icon_color}`} />
                        <p className={`text-sm flex-1 ${c.text}`}>{t.message}</p>
                        <button onClick={() => dismiss(t.id)}>
                            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}