import { LucideIcon, Heart, Droplet, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TrajectoryNode {
  id: number
  date: string
  title: string
  type: string
  status: "concern" | "neutral" | "improving" | "good" | "excellent"
  metrics: {
    bp: string
    glucose: string
    weight: string
  }
  notes: string
  icon: LucideIcon
}

interface HealthTrajectoryTimelineProps {
  nodes: TrajectoryNode[]
}

export function HealthTrajectoryTimeline({ nodes }: HealthTrajectoryTimelineProps) {
  const getStatusColor = (status: TrajectoryNode["status"]) => {
    switch (status) {
      case "concern":
        return "border-red-400 bg-red-50"
      case "neutral":
        return "border-amber-400 bg-amber-50"
      case "improving":
        return "border-blue-400 bg-blue-50"
      case "good":
        return "border-green-400 bg-green-50"
      case "excellent":
        return "border-green-500 bg-green-100"
      default:
        return "border-gray-400 bg-gray-50"
    }
  }

  const getNodeColor = (status: TrajectoryNode["status"]) => {
    switch (status) {
      case "concern":
        return "bg-red-500"
      case "neutral":
        return "bg-amber-500"
      case "improving":
        return "bg-blue-500"
      case "good":
        return "bg-green-500"
      case "excellent":
        return "bg-green-600"
      default:
        return "bg-gray-500"
    }
  }

  const getBadgeVariant = (status: TrajectoryNode["status"]) => {
    switch (status) {
      case "concern":
        return "destructive"
      case "neutral":
        return "warning"
      case "improving":
        return "info"
      default:
        return "success"
    }
  }

  return (
    <div className="relative h-[340px] overflow-y-auto">
      {/* Timeline line */}
      <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-red-300 via-amber-300 via-blue-300 to-green-400"></div>

      <div className="space-y-6 relative">
        {nodes.map((node) => {
          const Icon = node.icon
          return (
            <div key={node.id} className="flex items-start gap-4 relative">
              {/* Node */}
              <div
                className={cn(
                  "relative z-10 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0",
                  getNodeColor(node.status)
                )}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Card */}
              <Card
                className={cn(
                  "flex-1 border-2 hover:shadow-md transition-all cursor-pointer",
                  getStatusColor(node.status)
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{node.title}</div>
                      <div className="text-xs text-gray-500">{node.date}</div>
                    </div>
                    <Badge variant={getBadgeVariant(node.status)}>
                      {node.status}
                    </Badge>
                  </div>

                  <div className="flex gap-4 mb-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700">{node.metrics.bp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700">{node.metrics.glucose}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-700">{node.metrics.weight} lbs</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">{node.notes}</div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

