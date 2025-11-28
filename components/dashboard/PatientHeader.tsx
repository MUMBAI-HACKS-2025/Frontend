"use client"

import { Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PatientInfo {
  name: string
  age: number
  id: string
  lastVisit: string
}

interface PatientHeaderProps {
  patientInfo: PatientInfo
  onScheduleFollowUp?: () => void
}

export function PatientHeader({ patientInfo, onScheduleFollowUp }: PatientHeaderProps) {
  const initials = patientInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patientInfo.name}</h1>
              <p className="text-gray-500 text-sm">
                Patient ID: {patientInfo.id} • Age: {patientInfo.age}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Last Visit: {patientInfo.lastVisit}
            </div>
            <Button
              onClick={onScheduleFollowUp}
              className="mt-2"
              size="sm"
            >
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

