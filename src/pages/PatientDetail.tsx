import { Button } from "@/components/ui/button"
// import { ApiPatientDetailResponse } from "@/lib/api"
import { ArrowLeft, FileText, Activity, Heart, TrendingDown, AlertCircle, CheckCircle, User, Pill } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
// import VisualEHRDashboard from "@/components/dashboard/VisualEHRDashboard"
import DocumentUploadDrawer from "@/components/documents/DocumentUploadDrawer"
import DocumentsList from "@/components/documents/DocumentsList"
import HealthScoreCard from "@/components/health/HealthScoreCard"
import MedicationList, { Medication } from "@/components/medications/MedicationList"
import { AddMedicationDrawer } from "@/components/medications/AddMedicationDrawer"
import { EditMedicationDrawer } from "@/components/medications/EditMedicationDrawer"
import { ClinicalNotesForm, type ClinicalNote } from "@/components/dashboard/ClinicalNotesForm"
import { ScheduleAppointmentDrawer } from "@/components/appointments/ScheduleAppointmentDrawer"
import { getPatientById, staticPatient } from "@/data/staticPatient"
import { VitalSignsGrid } from "@/components/dashboard/VitalSignsGrid"
import { HealthTrajectory } from "@/components/dashboard/HealthTrajectory"
import { AIInsights } from "@/components/dashboard/AIInsights"
import { addNote } from "@/lib/storage"
import ClinicalNotesHistory from "@/components/dashboard/ClinicalNotesHistory"

export function PatientDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Get patient data dynamically based on URL parameter
  const patient = id ? getPatientById(id) : null

  // Fallback to static patient if not found
  const currentPatient = patient || staticPatient

  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // State for functional demos
  const [medications, setMedications] = useState<Medication[]>(currentPatient.medical_info.current_medications)
  const [isAddMedOpen, setIsAddMedOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [notesRefreshKey, setNotesRefreshKey] = useState(0)

  const handleAddMedication = (newMed: Medication) => {
    setMedications([newMed, ...medications])
  }

  const handleEditMedication = (updatedMed: Medication) => {
    setMedications(medications.map(m => m.medication_id === updatedMed.medication_id ? updatedMed : m))
  }

  const handleAddNote = (note: ClinicalNote) => {
    try {
      // Store note to localStorage
      addNote({
        patientId: currentPatient.patient_id,
        type: note.type,
        content: note.content,
        date: note.timestamp,
      })
      
      console.log('Clinical note saved to localStorage:', note)
      alert('Clinical note saved successfully!')
      setIsAddNoteOpen(false)
      // Refresh the clinical notes history
      setNotesRefreshKey(prev => prev + 1)
    } catch (error) {
      console.error('Error saving clinical note:', error)
      alert('An error occurred while saving the clinical note')
    }
  }

  const handleScheduleAppointment = (appointment: any) => {
    console.log('Appointment scheduled:', appointment)
    // In a real app, this would update state
  }

  // Derived data for dashboard components
  const vitalSigns = [
    { label: "Blood Pressure", value: `${currentPatient.vital_signs?.blood_pressure?.systolic ?? '--'}/${currentPatient.vital_signs?.blood_pressure?.diastolic ?? '--'}`, unit: currentPatient.vital_signs?.blood_pressure?.unit ?? 'mmHg', status: "good" as const, icon: Heart, color: "text-green-600" },
    { label: "Heart Rate", value: String(currentPatient.vital_signs?.heart_rate?.value ?? '--'), unit: currentPatient.vital_signs?.heart_rate?.unit ?? 'bpm', status: "good" as const, icon: Activity, color: "text-green-600" },
    { label: "Weight", value: String(currentPatient.vital_signs?.weight?.value ?? '--'), unit: currentPatient.vital_signs?.weight?.unit ?? 'lbs', status: "improving" as const, icon: TrendingDown, color: "text-blue-600" },
    { label: "BMI", value: String(currentPatient.vital_signs?.bmi?.value ?? '--'), unit: "", status: "good" as const, icon: User, color: "text-green-600" },
  ]

  const healthData = [
    { date: "Jun", bp_sys: 135, bp_dia: 85, glucose: 110, weight: 175, hr: 78 },
    { date: "Jul", bp_sys: 132, bp_dia: 84, glucose: 108, weight: 174, hr: 76 },
    { date: "Aug", bp_sys: 130, bp_dia: 82, glucose: 105, weight: 173, hr: 75 },
    { date: "Sep", bp_sys: 128, bp_dia: 82, glucose: 100, weight: 172, hr: 74 },
    { date: "Oct", bp_sys: 128, bp_dia: 80, glucose: 98, weight: 172, hr: 72 },
    { date: "Nov", bp_sys: 128, bp_dia: 82, glucose: 95, weight: 172, hr: 76 },
  ]

  const trajectoryNodes = [
    { id: 1, date: "Jun 2025", title: "Initial Diagnosis", type: "visit", status: "concern" as const, metrics: { bp: "135/85", glucose: "110", weight: "175" }, notes: "Diagnosed with T2DM", icon: User },
    { id: 2, date: "Jul 2025", title: "Medication Started", type: "medication", status: "neutral" as const, metrics: { bp: "132/84", glucose: "108", weight: "174" }, notes: "Started Metformin", icon: Pill },
    { id: 3, date: "Sep 2025", title: "Follow-up", type: "visit", status: "improving" as const, metrics: { bp: "128/82", glucose: "100", weight: "172" }, notes: "Responding well", icon: Activity },
    { id: 4, date: "Nov 2025", title: "Current Status", type: "current", status: "good" as const, metrics: { bp: "128/82", glucose: "95", weight: "172" }, notes: "Stable", icon: CheckCircle },
  ]

  const aiInsights = [
    { type: "positive" as const, icon: TrendingDown, title: "Blood Pressure Improving", description: "Consistent downward trend over 6 months.", confidence: 94 },
    { type: "positive" as const, icon: CheckCircle, title: "Glucose Management Excellent", description: "Fasting glucose levels normalized.", confidence: 91 },
    { type: "warning" as const, icon: AlertCircle, title: "Heart Rate Variability", description: "Slight irregularity detected.", confidence: 76 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Button variant="outline" onClick={() => setIsAddNoteOpen(true)}>
              Add Clinical Note
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsScheduleOpen(true)}>
              Schedule Appointment
            </Button>
          </div>
        </div>

        {/* Visual EHR Dashboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Health Analytics Dashboard</h2>
              <p className="text-gray-500">Patient: {currentPatient.personal_info.name} ({currentPatient.patient_id})</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium">{new Date(currentPatient.last_updated).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="mb-8">
            <VitalSignsGrid vitalSigns={vitalSigns} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <HealthTrajectory chartData={healthData} timelineNodes={trajectoryNodes} />
              <AIInsights insights={aiInsights} lastUpdated="Just now" />
              <ClinicalNotesHistory 
                key={notesRefreshKey}
                patientId={currentPatient.patient_id}
                onNoteDeleted={() => setNotesRefreshKey(prev => prev + 1)}
              />
            </div>
            <div className="space-y-6">
              <HealthScoreCard />
              <MedicationList
                medications={medications}
                onAdd={() => setIsAddMedOpen(true)}
                onEdit={(med) => setEditingMedication(med)}
              />
              <DocumentsList documents={currentPatient.documents} />
            </div>
          </div>
        </div>

        <DocumentUploadDrawer open={isUploadOpen} onOpenChange={setIsUploadOpen} />
        <AddMedicationDrawer open={isAddMedOpen} onOpenChange={setIsAddMedOpen} onAdd={handleAddMedication} />
        <EditMedicationDrawer
          open={!!editingMedication}
          onOpenChange={(open) => !open && setEditingMedication(null)}
          medication={editingMedication}
          onSave={handleEditMedication}
        />
        <ClinicalNotesForm open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} onSaveNote={handleAddNote} />
        <ScheduleAppointmentDrawer open={isScheduleOpen} onOpenChange={setIsScheduleOpen} onSchedule={handleScheduleAppointment} />
      </div>
    </div>
  )
}
