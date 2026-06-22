interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export default function Spinner({ size = 'md', text }: SpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizes[size]} border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin`}
            />
            {text && <p className="text-sm text-slate-500">{text}</p>}
        </div>
    )
}