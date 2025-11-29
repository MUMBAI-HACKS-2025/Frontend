import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Plus, Edit2, AlertCircle } from "lucide-react"

export interface Medication {
    medication_id: string
    name: string
    dosage: string
    frequency: string
    prescribed_date: string
    prescribing_doctor: string
}

interface MedicationListProps {
    medications: Medication[]
    onAdd: () => void
    onEdit: (medication: Medication) => void
}

export default function MedicationList({ medications, onAdd, onEdit }: MedicationListProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        Current Medications
                    </CardTitle>
                    <Button size="sm" className="h-8" onClick={onAdd}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <div className="space-y-1">
                    {medications.map((med) => (
                        <div
                            key={med.medication_id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded">
                                    <Pill className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-sm truncate text-gray-900">{med.name} <span className="text-gray-500 font-normal">{med.dosage}</span></div>
                                    <div className="text-xs text-gray-500">
                                        {med.frequency} • {med.prescribing_doctor}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEdit(med)}>
                                <Edit2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-100 flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <span className="font-semibold block mb-1">Interaction Alert</span>
                        Potential interaction between Metformin and contrast media if imaging is planned.
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
