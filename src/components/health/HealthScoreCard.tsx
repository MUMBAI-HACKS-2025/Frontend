import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Activity } from "lucide-react"

export default function HealthScoreCard() {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="w-5 h-5" />
            Health Score
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-100" onClick={() => alert('View scoring factors')}>Details</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-200" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="45.2" className="text-green-600" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-green-700">82</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-800">
              <TrendingUp className="w-4 h-4" />
              Top 15% of age group
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between"><span>Medication Adherence</span> <span className="font-medium text-green-600">High</span></div>
              <div className="flex justify-between"><span>Vitals Stability</span> <span className="font-medium text-green-600">Good</span></div>
              <div className="flex justify-between"><span>Lifestyle</span> <span className="font-medium text-yellow-600">Fair</span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
