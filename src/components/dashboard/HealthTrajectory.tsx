import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { HealthTrajectoryChart } from "./HealthTrajectoryChart"
import { HealthTrajectoryTimeline } from "./HealthTrajectoryTimeline"
import { LucideIcon } from "lucide-react"

interface HealthDataPoint {
  date: string
  bp_sys: number
  bp_dia: number
  glucose: number
  weight: number
  hr: number
}

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


interface HealthTrajectoryProps {
  chartData: HealthDataPoint[]
  timelineNodes: TrajectoryNode[]
}

export function HealthTrajectory({ chartData, timelineNodes }: HealthTrajectoryProps) {
  const [activeTab, setActiveTab] = useState<"timeline" | "chart">("timeline")

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Health Trajectory</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "timeline" | "chart")}>
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <HealthTrajectoryTimeline nodes={timelineNodes} />
          </TabsContent>
          <TabsContent value="chart">
            <HealthTrajectoryChart data={chartData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

