import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    iconColor: string
    iconBg: string
    subtitle?: string
    subtitleColor?: string
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    iconColor,
    iconBg,
    subtitle,
    subtitleColor = 'text-slate-500',
}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                {subtitle && (
                    <p className={`text-xs mt-1 ${subtitleColor}`}>{subtitle}</p>
                )}
            </CardContent>
        </Card>
    )
}