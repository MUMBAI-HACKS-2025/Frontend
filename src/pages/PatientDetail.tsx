import { useParams } from "react-router-dom"
import VisualEHRDashboard from "@/components/dashboard/VisualEHRDashboard"

export function PatientDetailPage() {
  useParams<{ id: string }>()

  // TODO: In a real app, fetch patient data using the id from route params
  // For now, we'll render VisualEHRDashboard which can be enhanced to load patient-specific data
  
  return (
    <div className="min-h-screen bg-gray-50">
      <VisualEHRDashboard />
    </div>
  )
}
