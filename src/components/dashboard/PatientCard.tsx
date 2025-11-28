import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, ChevronRight } from "lucide-react"

export interface PatientCardData {
  id: string
  name: string
  age: number
  sex?: "M" | "F" | "Other"
  mrn?: string
  lastVisit?: string
  nextAppt?: string
  vitals?: {
    bp?: string
    hr?: number
    temp?: number
  }
  medsCount?: number
  lastNoteSnippet?: string
  status?: "stable" | "follow-up" | "urgent" | "new"
  avatarUrl?: string | null
  phone?: string
  city?: string
}

interface PatientCardProps {
  patient: PatientCardData
}

export function PatientCard({ patient }: PatientCardProps) {
  const navigate = useNavigate()

  const handleOpenPatient = () => {
    navigate(`/patients/${patient.id}`)
  }

  const handleQuickNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    // This will be wired to open ClinicalNotesForm modal
    console.log("Quick note for patient:", patient.id)
  }

  const statusColor = {
    stable: "bg-green-100 text-green-800",
    "follow-up": "bg-yellow-100 text-yellow-800",
    urgent: "bg-red-100 text-red-800",
    new: "bg-blue-100 text-blue-800",
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleOpenPatient}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {patient.avatarUrl ? (
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-800">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {patient.age} y/o {patient.sex || ""}
              </p>
            </div>
          </div>
          {patient.status && (
            <Badge
              className={`${
                statusColor[patient.status as keyof typeof statusColor] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Patient ID */}
        {patient.mrn && (
          <div className="text-sm">
            <span className="text-gray-600">MRN: </span>
            <span className="font-medium">{patient.mrn}</span>
          </div>
        )}

        {/* Vitals Summary */}
        {patient.vitals && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            {patient.vitals.bp && (
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">BP</p>
                <p className="font-medium">{patient.vitals.bp}</p>
              </div>
            )}
            {patient.vitals.hr && (
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">HR</p>
                <p className="font-medium">{patient.vitals.hr} bpm</p>
              </div>
            )}
            {patient.vitals.temp && (
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Temp</p>
                <p className="font-medium">{patient.vitals.temp}°F</p>
              </div>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
          <div>
            <p className="text-xs text-gray-600">Last Visit</p>
            <p className="font-medium">{formatDate(patient.lastVisit)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Next Appt</p>
            <p className="font-medium">{formatDate(patient.nextAppt)}</p>
          </div>
        </div>

        {/* Medications & Notes */}
        {(patient.medsCount !== undefined || patient.lastNoteSnippet) && (
          <div className="text-sm border-t pt-3 space-y-1">
            {patient.medsCount !== undefined && (
              <p className="text-gray-600">
                <span className="font-medium">{patient.medsCount}</span> active medications
              </p>
            )}
            {patient.lastNoteSnippet && (
              <p className="text-gray-600 italic truncate">
                "{patient.lastNoteSnippet}"
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleQuickNote}
          >
            <Mic className="w-4 h-4 mr-1" />
            Quick Note
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={handleOpenPatient}
            aria-label="Open patient"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
