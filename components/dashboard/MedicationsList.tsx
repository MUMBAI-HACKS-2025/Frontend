"use client"

import { Pill } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Medication {
  name: string
  dose: string
  frequency: string
  status: string
}

interface MedicationsListProps {
  medications: Medication[]
  onAddMedication?: () => void
}

export function MedicationsList({ medications, onAddMedication }: MedicationsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          <CardTitle>Medications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {medications.map((med, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-gray-900">{med.name}</div>
                <Badge variant="success">{med.status}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {med.dose} • {med.frequency}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full mt-2 border-dashed"
            onClick={onAddMedication}
          >
            + Add Medication
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

