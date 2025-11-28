/**
 * Storage Types
 * 
 * Defines the shape of data stored in localStorage
 * These are separate from API contracts as they're frontend-specific
 */

/**
 * Clinical Note - stored with patient reference and enriched with AI insights
 */
export interface ClinicalNote {
  id: string // Unique note ID (e.g., "note-001")
  patientId: string // Reference to patient
  date: string // ISO timestamp when note was created
  type: "text" | "voice" | "prescription" // How the note was created
  content: string // The actual note content
  transcript?: string // For voice notes, the transcribed text
  insights?: string[] // AI-generated insights
  actions?: string[] // Recommended actions
  createdAt: string // ISO timestamp
  updatedAt?: string // ISO timestamp if edited
}

/**
 * Calendar Event - appointments, tasks, reminders
 */
export interface CalendarEvent {
  id: string // Unique event ID (e.g., "event-001")
  date: string // YYYY-MM-DD format
  time?: string // HH:mm format (optional for all-day events)
  patientId?: string // Reference to patient (optional for non-patient events)
  patientName?: string // Cache of patient name for display
  type: "appointment" | "task" | "reminder"
  title?: string // Event title/description
  notes?: string // Additional notes
  status: "scheduled" | "completed" | "cancelled"
  createdAt: string // ISO timestamp
}

/**
 * Patient Vital - health measurements for a patient
 * Stored separately per patient for easy querying
 */
export interface PatientVital {
  id: string // Unique vital ID (e.g., "vital-001")
  date: string // ISO timestamp when vital was recorded
  bp?: string // Blood pressure (e.g., "120/80")
  hr?: number // Heart rate (bpm)
  temp?: number // Temperature (°F or °C)
  weight?: number // Weight (lbs or kg)
  notes?: string // Additional notes
}

/**
 * Patient Medication - active/past medications for a patient
 * Stored separately per patient for easy querying
 */
export interface PatientMedication {
  id: string // Unique medication ID
  name: string // Medication name
  dosage: string // Dosage (e.g., "10mg")
  frequency: string // Frequency (e.g., "Once daily")
  startDate: string // ISO date when started
  endDate?: string // ISO date when stopped (if inactive)
  status: "active" | "inactive" | "paused"
  notes?: string
}

/**
 * Storage Statistics - aggregated data for HomePage
 * Calculated from other storage collections
 */
export interface StorageStats {
  totalPatients: number
  activePatients: number
  totalNotes: number
  todayAppointments: number
  urgentPatients: number
  lastUpdated: string
}

/**
 * Storage Metadata - track storage version and data integrity
 */
export interface StorageMetadata {
  version: string // Storage schema version
  lastSync: string // ISO timestamp of last data operation
  patientCount: number
  noteCount: number
  eventCount: number
}
