import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { PatientCardData } from "@/components/dashboard/PatientCard"
import { AddPatientDrawer } from "@/components/dashboard/AddPatientDrawer"
import { staticPatientsList } from "@/data/staticPatient"

export function PatientGrid() {
  const [patients, setPatients] = useState<PatientCardData[]>(staticPatientsList)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAddPatient = (newPatient: PatientCardData) => {
    // Add to static list (in a real app, this would call the API)
    const patientData: PatientCardData = {
      id: `patient-${Date.now()}`,
      mrn: `MRN-${Date.now()}`,
      name: newPatient.name,
      age: newPatient.age,
      sex: newPatient.sex || "Other",
      phone: newPatient.phone,
      city: newPatient.city,
      lastVisit: new Date().toISOString(),
      status: "new",
      vitals: undefined,
      medsCount: 0,
      lastNoteSnippet: undefined,
    }
    setPatients((prev) => [patientData, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No patients found.</p>
            <Button className="mt-4">Add a New Patient</Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {patient.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-800">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.mrn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{patient.sex || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{patient.lastVisit || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${patient.status === "stable"
                            ? "bg-green-100 text-green-700"
                            : patient.status === "follow-up"
                              ? "bg-yellow-100 text-yellow-700"
                              : patient.status === "urgent"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {patient.status ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/patients/${patient.id}`)
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Patient Drawer */}
      <AddPatientDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAddPatient={handleAddPatient}
      />
    </div>
  )
}
