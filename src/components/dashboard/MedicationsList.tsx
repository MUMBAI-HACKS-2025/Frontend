import { Pill, Pencil } from "lucide-react"
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
  onEditMedication?: (index: number, medication: Medication) => void
}

export function MedicationsList({ medications, onAddMedication, onEditMedication }: MedicationsListProps) {
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
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-gray-900">{med.name}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">{med.status}</Badge>
                  {onEditMedication && (
                    <button
                      onClick={() => onEditMedication(idx, med)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      title="Edit medication"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
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

