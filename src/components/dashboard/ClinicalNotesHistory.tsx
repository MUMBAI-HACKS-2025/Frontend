import { useState, useEffect } from "react"
import { FileText, Mic, Upload, Trash2, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getNotesByPatient, deleteNote } from "@/lib/storage"
import { ClinicalNote } from "@/lib/storageTypes"

interface ClinicalNotesHistoryProps {
  patientId: string
  onNoteDeleted?: () => void
}

export default function ClinicalNotesHistory({ patientId, onNoteDeleted }: ClinicalNotesHistoryProps) {
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotes = () => {
      try {
        const patientNotes = getNotesByPatient(patientId)
        // Sort by date descending (newest first)
        const sortedNotes = patientNotes.sort((a, b) => 
          new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
        )
        setNotes(sortedNotes)
      } catch (error) {
        console.error('Failed to load clinical notes:', error)
        setNotes([])
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [patientId])

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this clinical note?')) {
      try {
        deleteNote(noteId)
        setNotes(notes.filter(n => n.id !== noteId))
        if (onNoteDeleted) {
          onNoteDeleted()
        }
        alert('Note deleted successfully')
      } catch (error) {
        console.error('Failed to delete note:', error)
        alert('Failed to delete note')
      }
    }
  }

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Clinical Notes History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading notes...</p>
        </CardContent>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Clinical Notes History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No clinical notes yet. Add your first note using the button above.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Clinical Notes History ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getTypeIcon(note.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(note.type)}`}>
                        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(note.date || note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {expandedNoteId === note.id
                        ? note.content
                        : truncateContent(note.content)}
                    </p>
                    {note.transcript && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                        <p className="font-semibold mb-1">Transcript:</p>
                        <p>{note.transcript}</p>
                      </div>
                    )}
                    {note.insights && note.insights.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <p className="font-semibold text-blue-900 mb-1">AI Insights:</p>
                        <ul className="list-disc list-inside text-blue-800">
                          {note.insights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {note.content.length > 150 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedNoteId(expandedNoteId === note.id ? null : note.id)
                      }
                      title={expandedNoteId === note.id ? "Collapse" : "Expand"}
                    >
                      {expandedNoteId === note.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
