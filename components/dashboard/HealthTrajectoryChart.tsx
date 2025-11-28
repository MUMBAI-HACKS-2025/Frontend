"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface HealthDataPoint {
  date: string
  bp_sys: number
  bp_dia: number
  glucose: number
  weight: number
  hr: number
}

interface HealthTrajectoryChartProps {
  data: HealthDataPoint[]
}

export function HealthTrajectoryChart({ data }: HealthTrajectoryChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="bp_sys"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorBP)"
            name="Systolic BP"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="glucose"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorGlucose)"
            name="Glucose"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Blood Pressure trending down 6%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-600">Glucose levels improved 12%</span>
        </div>
      </div>
    </div>
  )
}

