import { Activity, Heart, Droplet, TrendingDown } from "lucide-react"
import { VitalSignsCard } from "./VitalSignsCard"

interface VitalSign {
  label: string
  value: string
  unit: string
  status: "good" | "improving" | "warning" | "critical"
  icon: typeof Heart
  color?: string
}

interface VitalSignsGridProps {
  vitalSigns: VitalSign[]
}

export function VitalSignsGrid({ vitalSigns }: VitalSignsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {vitalSigns.map((vital, idx) => (
        <VitalSignsCard key={idx} {...vital} />
      ))}
    </div>
  )
}

