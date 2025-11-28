import { Brain, LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    <Card>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon
            const styles = getInsightStyles(insight.type)
            return (
              <Card
                key={idx}
                className={cn(
                  "border-2 transition-all hover:shadow-md",
                  styles.container
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-5 h-5 mt-0.5", styles.icon)} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Confidence: {insight.confidence}%
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-0">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

