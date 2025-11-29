import { Brain, LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AIInsight {
  type: "positive" | "warning" | "info"
  icon: LucideIcon
  title: string
  description: string
  confidence: number
}

interface AIInsightsProps {
  insights: AIInsight[]
  lastUpdated?: string
}

export function AIInsights({ insights, lastUpdated }: AIInsightsProps) {
  const getInsightStyles = (type: AIInsight["type"]) => {
    switch (type) {
      case "positive":
        return {
          container: "bg-green-50 border-green-200",
          icon: "text-green-600",
        }
      case "warning":
        return {
          container: "bg-amber-50 border-amber-200",
          icon: "text-amber-600",
        }
      case "info":
        return {
          container: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
        }
      default:
        return {
          container: "bg-gray-50 border-gray-200",
          icon: "text-gray-600",
        }
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50/50 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <CardTitle>AI-Powered Insights</CardTitle>
          {lastUpdated && (
            <span className="ml-auto text-xs text-gray-500">Updated {lastUpdated}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon
            const styles = getInsightStyles(insight.type)
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-sm bg-white",
                  styles.container
                )}
              >
                <div className={cn("p-2 rounded-full shrink-0", styles.container.replace('border', 'bg-opacity-50'))}>
                  <Icon className={cn("w-5 h-5", styles.icon)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{insight.title}</h3>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", styles.container)}>
                      {insight.confidence}% Conf.
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

