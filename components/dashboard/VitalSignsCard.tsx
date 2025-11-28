import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface VitalSignsCardProps {
  label: string
  value: string
  unit: string
  status: "good" | "improving" | "warning" | "critical"
  icon: LucideIcon
  color?: string
}

export function VitalSignsCard({
  label,
  value,
  unit,
  status,
  icon: Icon,
  color,
}: VitalSignsCardProps) {
  const statusConfig = {
    good: {
      badge: "bg-green-100 text-green-700",
      text: "good",
    },
    improving: {
      badge: "bg-blue-100 text-blue-700",
      text: "improving",
    },
    warning: {
      badge: "bg-amber-100 text-amber-700",
      text: "warning",
    },
    critical: {
      badge: "bg-red-100 text-red-700",
      text: "critical",
    },
  }

  const config = statusConfig[status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Icon className={cn("w-5 h-5", color || "text-blue-600")} />
          <Badge variant="outline" className={config.badge}>
            {config.text}
          </Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-xs text-gray-400 mt-1">{unit}</div>
      </CardContent>
    </Card>
  )
}

