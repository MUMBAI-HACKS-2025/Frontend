import { useState, useEffect } from "react"
import { Search, FileText, Mic, Upload, Lightbulb, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchClinicalNotes, fetchPatients, ApiClinicalNote } from "@/lib/api"

interface ClinicalNoteWithPatient extends ApiClinicalNote {
  patientName: string
  // Map 'created_at' to 'date' to match previous UI usage
  date: string
  transcript?: string
  insights?: string[]
  actions?: string[]
}

export function ClinicalNotes() {
  const [notes, setNotes] = useState<ClinicalNoteWithPatient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "text" | "voice" | "prescription">("all")

  // Load notes from API on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const apiPatients = await fetchPatients(0, 100)
        const patientsById = new Map(apiPatients.map((p) => [p.patient_id, p.name]))
        const apiNotes = await fetchClinicalNotes("all")
        const enriched = apiNotes.map((note: ApiClinicalNote) => ({
          ...note,
          date: note.created_at || new Date().toISOString(),
          patientName: patientsById.get(note.patient_id) || `Patient #${note.patient_id}`,
        }))
        if (mounted) setNotes(enriched as ClinicalNoteWithPatient[])
      } catch (err) {
        console.error('Failed to load clinical notes from API:', err)
        if (mounted) setNotes([])
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || note.type === filterType

    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: "text" | "voice" | "prescription") => {
    switch (type) {
      case "text":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "voice":
        return <Mic className="w-5 h-5 text-green-600" />
      case "prescription":
        return <Upload className="w-5 h-5 text-purple-600" />
    }
  }

  const getTypeBadge = (type: "text" | "voice" | "prescription") => {
    switch (type) {
      case "text":
        return "bg-blue-100 text-blue-800"
      case "voice":
        return "bg-green-100 text-green-800"
      case "prescription":
        return "bg-purple-100 text-purple-800"
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinical Notes</h1>
              <p className="text-gray-600 mt-1">
                View all clinical notes across patients with AI insights and recommended actions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name or note content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {(["all", "text", "voice", "prescription"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No clinical notes found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div key={note.note_id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(note.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{note.patientName}</h3>
                      <p className="text-sm text-gray-600">{formatDate(note.date)}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(
                      note.type
                    )}`}
                  >
                    {note.type === "text" ? "Written" : note.type === "voice" ? "Voice" : "Prescription"}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-gray-800 text-sm leading-relaxed">{note.content}</p>
                  {note.transcript && (
                    <div className="mt-3 p-3 bg-gray-100 rounded flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{note.transcript}</span>
                    </div>
                  )}
                </div>

                {/* AI Insights */}
                {note.insights && note.insights.length > 0 && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">AI Insights</p>
                        {note.insights.map((insight, idx) => (
                          <p key={idx} className="text-sm text-blue-800 mt-1">{insight}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {note.actions && note.actions.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold text-green-900">Recommended Actions</p>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {note.actions.map((action, idx) => (
                        <li key={idx} className="text-sm text-green-800">
                          • {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
