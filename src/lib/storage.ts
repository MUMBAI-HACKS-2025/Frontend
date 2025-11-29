/**
 * Storage Service
 * 
 * Utility functions for managing localStorage with type safety
 * Handles CRUD operations for patients, notes, events, vitals, and medications
 */

import {
  ClinicalNote,
  CalendarEvent,
  PatientVital,
  PatientMedication,
  StorageStats,
  StorageMetadata,
} from "@/lib/storageTypes"
import { PatientResponse, CreatePatientRequest, EditPatientRequest } from "@/types/PatientContract"

const STORAGE_NAMESPACE = "mediq"

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: `${STORAGE_NAMESPACE}_patients`,
  CLINICAL_NOTES: `${STORAGE_NAMESPACE}_clinical_notes`,
  CALENDAR_EVENTS: `${STORAGE_NAMESPACE}_calendar_events`,
  VITALS_PREFIX: `${STORAGE_NAMESPACE}_vitals`,
  MEDICATIONS_PREFIX: `${STORAGE_NAMESPACE}_medications`,
  METADATA: `${STORAGE_NAMESPACE}_metadata`,
} as const

/**
 * Get all data from localStorage (for debugging/export)
 */
export function getAllStorageData() {
  return {
    patients: getPatients(),
    clinicalNotes: getNotes(),
    calendarEvents: getEvents(),
    metadata: getMetadata(),
  }
}

/**
 * ============================================================================
 * PATIENT OPERATIONS
 * ============================================================================
 */

/**
 * Get all patients from localStorage
 */
export function getPatients(): PatientResponse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading patients from storage:", error)
    return []
  }
}

/**
 * Get a specific patient by ID
 */
export function getPatientById(id: string): PatientResponse | null {
  const patients = getPatients()
  return patients.find((p) => p.id === id) || null
}

/**
 * Add a new patient to localStorage
 * Auto-generates ID and MRN
 */
export function addPatient(createRequest: CreatePatientRequest): PatientResponse {
  const patients = getPatients()

  // Generate ID (padded 3-digit number)
  const nextId = String(patients.length + 1).padStart(3, "0")

  // Generate MRN (timestamp-based)
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  const mrn = `MRN-${new Date().getFullYear()}-${nextId}-${randomSuffix}`

  const newPatient: PatientResponse = {
    id: nextId,
    mrn,
    name: createRequest.name,
    age: createRequest.age,
    sex: createRequest.sex,
    phone: createRequest.phone,
    city: createRequest.city,
    status: "new",
    lastVisit: new Date().toISOString(),
  }

  patients.push(newPatient)
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
  updateMetadata()

  return newPatient
}

/**
 * Update an existing patient
 */
export function updatePatient(id: string, updates: EditPatientRequest): PatientResponse {
  const patients = getPatients()
  const index = patients.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error(`Patient with ID ${id} not found`)
  }

  const updated = {
    ...patients[index],
    ...updates,
  }

  patients[index] = updated
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
  updateMetadata()

  return updated
}

/**
 * Delete a patient and all associated data
 */
export function deletePatient(id: string): void {
  const patients = getPatients()
  const filtered = patients.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered))

  // Also delete associated notes, events, vitals, medications
  const notes = getNotes()
  const filteredNotes = notes.filter((n) => n.patientId !== id)
  localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(filteredNotes))

  const events = getEvents()
  const filteredEvents = events.filter((e) => e.patientId !== id)
  localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(filteredEvents))

  localStorage.removeItem(`${STORAGE_KEYS.VITALS_PREFIX}_${id}`)
  localStorage.removeItem(`${STORAGE_KEYS.MEDICATIONS_PREFIX}_${id}`)

  updateMetadata()
}

/**
 * ============================================================================
 * CLINICAL NOTES OPERATIONS
 * ============================================================================
 */

/**
 * Get all clinical notes
 */
export function getNotes(): ClinicalNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLINICAL_NOTES)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading notes from storage:", error)
    return []
  }
}

/**
 * Get notes for a specific patient
 */
export function getNotesByPatient(patientId: string): ClinicalNote[] {
  return getNotes().filter((note) => note.patientId === patientId)
}

/**
 * Add a new clinical note
 */
export function addNote(note: Omit<ClinicalNote, "id" | "createdAt">): ClinicalNote {
  const notes = getNotes()

  // Generate unique ID
  const id = `note-${Date.now()}-${Math.random().toString(36).substring(7)}`

  const newNote: ClinicalNote = {
    ...note,
    id,
    createdAt: new Date().toISOString(),
  }

  notes.push(newNote)
  localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(notes))
  updateMetadata()

  return newNote
}

/**
 * Update an existing note
 */
export function updateNote(id: string, updates: Partial<ClinicalNote>): ClinicalNote {
  const notes = getNotes()
  const index = notes.findIndex((n) => n.id === id)

  if (index === -1) {
    throw new Error(`Note with ID ${id} not found`)
  }

  const updated: ClinicalNote = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  notes[index] = updated
  localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(notes))
  updateMetadata()

  return updated
}

/**
 * Delete a note
 */
export function deleteNote(id: string): void {
  const notes = getNotes()
  const filtered = notes.filter((n) => n.id !== id)
  localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(filtered))
  updateMetadata()
}

/**
 * ============================================================================
 * CALENDAR EVENTS OPERATIONS
 * ============================================================================
 */

/**
 * Get all calendar events
 */
export function getEvents(): CalendarEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading events from storage:", error)
    return []
  }
}

/**
 * Get events for a specific date
 */
export function getEventsByDate(dateStr: string): CalendarEvent[] {
  return getEvents().filter((event) => event.date === dateStr)
}

/**
 * Get today's events
 */
export function getTodayEvents(): CalendarEvent[] {
  const today = new Date().toISOString().split("T")[0]
  return getEventsByDate(today)
}

/**
 * Add a new calendar event
 */
export function addEvent(event: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent {
  const events = getEvents()

  const id = `event-${Date.now()}-${Math.random().toString(36).substring(7)}`

  const newEvent: CalendarEvent = {
    ...event,
    id,
    createdAt: new Date().toISOString(),
  }

  events.push(newEvent)
  localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events))
  updateMetadata()

  return newEvent
}

/**
 * Update an existing event
 */
export function updateEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent {
  const events = getEvents()
  const index = events.findIndex((e) => e.id === id)

  if (index === -1) {
    throw new Error(`Event with ID ${id} not found`)
  }

  const updated = {
    ...events[index],
    ...updates,
  }

  events[index] = updated
  localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events))
  updateMetadata()

  return updated
}

/**
 * Delete an event
 */
export function deleteEvent(id: string): void {
  const events = getEvents()
  const filtered = events.filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(filtered))
  updateMetadata()
}

/**
 * ============================================================================
 * PATIENT VITALS OPERATIONS
 * ============================================================================
 */

/**
 * Get all vitals for a patient
 */
export function getVitalsByPatient(patientId: string): PatientVital[] {
  try {
    const key = `${STORAGE_KEYS.VITALS_PREFIX}_${patientId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading vitals for patient ${patientId}:`, error)
    return []
  }
}

/**
 * Add a vital reading for a patient
 */
export function addVital(patientId: string, vital: Omit<PatientVital, "id">): PatientVital {
  const vitals = getVitalsByPatient(patientId)

  const id = `vital-${Date.now()}`
  const newVital: PatientVital = {
    ...vital,
    id,
  }

  vitals.push(newVital)
  const key = `${STORAGE_KEYS.VITALS_PREFIX}_${patientId}`
  localStorage.setItem(key, JSON.stringify(vitals))
  updateMetadata()

  return newVital
}

/**
 * ============================================================================
 * PATIENT MEDICATIONS OPERATIONS
 * ============================================================================
 */

/**
 * Get all medications for a patient
 */
export function getMedicationsByPatient(patientId: string): PatientMedication[] {
  try {
    const key = `${STORAGE_KEYS.MEDICATIONS_PREFIX}_${patientId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading medications for patient ${patientId}:`, error)
    return []
  }
}

/**
 * Add a medication for a patient
 */
export function addMedication(patientId: string, med: Omit<PatientMedication, "id">): PatientMedication {
  const meds = getMedicationsByPatient(patientId)

  const id = `med-${Date.now()}`
  const newMed: PatientMedication = {
    ...med,
    id,
  }

  meds.push(newMed)
  const key = `${STORAGE_KEYS.MEDICATIONS_PREFIX}_${patientId}`
  localStorage.setItem(key, JSON.stringify(meds))
  updateMetadata()

  return newMed
}

/**
 * Get active medications for a patient
 */
export function getActiveMedicationsByPatient(patientId: string): PatientMedication[] {
  return getMedicationsByPatient(patientId).filter((med) => med.status === "active")
}

/**
 * ============================================================================
 * STORAGE METADATA & UTILITIES
 * ============================================================================
 */

/**
 * Get storage metadata
 */
export function getMetadata(): StorageMetadata {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.METADATA)
    if (!data) return getDefaultMetadata()
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading metadata:", error)
    return getDefaultMetadata()
  }
}

/**
 * Update storage metadata
 */
function updateMetadata(): void {
  const metadata: StorageMetadata = {
    version: "1.0.0",
    lastSync: new Date().toISOString(),
    patientCount: getPatients().length,
    noteCount: getNotes().length,
    eventCount: getEvents().length,
  }
  localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata))
}

/**
 * Get default metadata
 */
function getDefaultMetadata(): StorageMetadata {
  return {
    version: "1.0.0",
    lastSync: new Date().toISOString(),
    patientCount: 0,
    noteCount: 0,
    eventCount: 0,
  }
}

/**
 * Calculate storage statistics
 */
export function getStorageStats(): StorageStats {
  const patients = getPatients()
  const notes = getNotes()
  const todayEvents = getTodayEvents()

  return {
    totalPatients: patients.length,
    activePatients: patients.filter((p) => p.status !== "inactive").length,
    totalNotes: notes.length,
    todayAppointments: todayEvents.filter((e) => e.type === "appointment").length,
    urgentPatients: patients.filter((p) => p.status === "urgent").length,
    lastUpdated: getMetadata().lastSync,
  }
}

/**
 * Clear all storage (use for testing/reset)
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    // Remove main keys
    localStorage.removeItem(key)
  })

  // Remove patient-specific keys (vitals, medications)
  const patients = getPatients()
  patients.forEach((p) => {
    localStorage.removeItem(`${STORAGE_KEYS.VITALS_PREFIX}_${p.id}`)
    localStorage.removeItem(`${STORAGE_KEYS.MEDICATIONS_PREFIX}_${p.id}`)
  })
}

/**
 * Initialize storage with sample data (for demo/testing)
 */
export function initializeSampleData(): void {
  // Only initialize when explicitly enabled via VITE_ENABLE_SAMPLE_DATA
  // This prevents accidental writes to localStorage in production/API-only mode.
  const meta = (import.meta as unknown as { env?: Record<string, string> })
  const enableSample = typeof import.meta !== 'undefined' && meta.env?.VITE_ENABLE_SAMPLE_DATA === 'true'
  if (!enableSample) {
    console.log('Sample data initialization skipped (VITE_ENABLE_SAMPLE_DATA not set)')
    return
  }

  // Only initialize if storage is empty
  if (getPatients().length > 0) {
    console.log("Storage already initialized")
    return
  }

  // Add sample patients
  const samplePatients: CreatePatientRequest[] = [
    { name: "John Doe", age: 45, sex: "M", phone: "555-0001", city: "New York" },
    { name: "Sarah Johnson", age: 38, sex: "F", phone: "555-0002", city: "Boston" },
    { name: "Michael Chen", age: 52, sex: "M", phone: "555-0003", city: "San Francisco" },
    { name: "Emily Davis", age: 29, sex: "F", phone: "555-0004", city: "Austin" },
    { name: "Robert Wilson", age: 67, sex: "M", phone: "555-0005", city: "Chicago" },
  ]

  const addedPatients = samplePatients.map((p) => addPatient(p))

  // Add sample notes
  const sampleNotes = [
    {
      patientId: addedPatients[0].id,
      date: new Date().toISOString(),
      type: "text" as const,
      content: "Patient showing improvement in blood pressure control",
      insights: ["Good compliance with medication", "Continue current regimen"],
      actions: ["Schedule follow-up in 1 month"],
    },
    {
      patientId: addedPatients[1].id,
      date: new Date().toISOString(),
      type: "voice" as const,
      content: "Routine checkup, vitals stable",
      transcript: "Routine checkup, vitals stable",
      insights: ["All values within normal range"],
      actions: ["Continue annual preventive care"],
    },
  ]

  sampleNotes.forEach((note) => {
    addNote({
      patientId: note.patientId,
      date: note.date,
      type: note.type,
      content: note.content,
      transcript: note.transcript,
      insights: note.insights,
      actions: note.actions,
    })
  })

  // Add sample events
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  const todayStr = today.toISOString().split("T")[0]
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const sampleEvents = [
    {
      date: todayStr,
      time: "09:00",
      patientId: addedPatients[0].id,
      patientName: addedPatients[0].name,
      type: "appointment" as const,
      title: "Follow-up Consultation",
      status: "completed" as const,
    },
    {
      date: todayStr,
      time: "14:00",
      patientId: addedPatients[1].id,
      patientName: addedPatients[1].name,
      type: "appointment" as const,
      title: "Annual Physical",
      status: "scheduled" as const,
    },
    {
      date: tomorrowStr,
      time: "10:00",
      patientId: addedPatients[2].id,
      patientName: addedPatients[2].name,
      type: "appointment" as const,
      title: "Lab Results Review",
      status: "scheduled" as const,
    },
  ]

  sampleEvents.forEach((event) => {
    addEvent({
      date: event.date,
      time: event.time,
      patientId: event.patientId,
      patientName: event.patientName,
      type: event.type,
      title: event.title,
      status: event.status,
    })
  })

  console.log("✓ Sample data initialized")
  updateMetadata()
}

/**
 * Export data as JSON
 */
export function exportToJSON(): string {
  const data = getAllStorageData()
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON
 */
export function importFromJSON(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString)
    clearAllStorage()

    if (data.patients) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(data.patients))
    }
    if (data.clinicalNotes) {
      localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(data.clinicalNotes))
    }
    if (data.calendarEvents) {
      localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(data.calendarEvents))
    }

    updateMetadata()
    console.log("✓ Data imported successfully")
  } catch (error) {
    console.error("Error importing data:", error)
    throw new Error("Invalid JSON format")
  }
}
