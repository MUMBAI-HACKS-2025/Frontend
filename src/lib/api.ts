/**
 * API Service
 * 
 * Handles API calls to the backend server
 */

// API Base URL - update this with your actual backend URL
const API_BASE_URL = 'https://7c8ba3b34bff.ngrok-free.app/api/v1'

/**
 * API Patient Response from backend
 */
export interface ApiPatientResponse {
  patient_id: string
  name: string
  age: number
  sex: "M" | "F" | "Other"
  phone: string
  city: string
  created_at: string
}

/**
 * Detailed Patient Information Response
 */
export interface ApiPatientDetailResponse {
  patient_id: string
  personal_info: {
    name: string
    date_of_birth: string | null
    age: number
    sex: "M" | "F" | "Other"
    phone: string
    email: string | null
    address: {
      street: string | null
      city: string | null
      state: string | null
      zip_code: string | null
      country: string | null
    }
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    } | null
  }
  medical_info: {
    blood_type: string | null
    allergies: Array<{
      allergen: string
      severity: "High" | "Medium" | "Low"
      reaction: string
    }>
    chronic_conditions: Array<{
      condition: string
      diagnosed_date: string
      status: string
    }>
    current_medications: Array<{
      medication_id: string
      name: string
      dosage: string
      frequency: string
      prescribed_date: string
      prescribing_doctor: string
    }>
  }
  vital_signs: {
    last_recorded: string | null
    blood_pressure: {
      systolic: number
      diastolic: number
      unit: string
    } | null
    heart_rate: {
      value: number
      unit: string
    } | null
    temperature: {
      value: number
      unit: string
    } | null
    respiratory_rate: {
      value: number
      unit: string
    } | null
    oxygen_saturation: {
      value: number
      unit: string
    } | null
    weight: {
      value: number
      unit: string
    } | null
    height: {
      value: number
      unit: string
    } | null
    bmi: {
      value: number
      category: string
    } | null
  }
  health_trajectory: {
    current_status: string
    risk_level: string
    predicted_trajectory: string
    last_assessment_date: string | null
    key_metrics: Record<string, string | number | null>
  }
  recent_visits: Array<{
    visit_id: string
    date: string
    type: string
    doctor: string
    reason: string
    notes: string
  }>
  lab_results: Array<{
    test_id: string
    test_name: string
    result: string
    unit: string
    reference_range: string
    status: string
    date: string
  }>
  appointments: {
    upcoming: Array<{
      appointment_id: string
      date: string
      doctor: string
      type: string
      reason: string
    }>
    past: Array<{
      appointment_id: string
      date: string
      doctor: string
      type: string
      reason: string
      status: string
    }>
  }
  insurance_info: {
    provider: string | null
    policy_number: string | null
    group_number: string | null
    coverage_type: string | null
    effective_date: string | null
    expiration_date: string | null
  }
  clinical_notes: Array<{
    note_id: string
    date: string
    author: string
    type: string
    content: string
  }>
  documents: Array<{
    document_id: string
    type: string
    name: string
    date: string
    url: string
  }>
  created_at: string
  last_updated: string
}

/**
 * Upload file for a patient
 */
export async function uploadPatientFile(patientId: string, file: File): Promise<unknown> {
  const formData = new FormData()
  formData.append('patient_id', patientId)
  formData.append('file', file)

  try {
    const response = await fetch(`${API_BASE_URL}/upload/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier to bypass the warning page
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

/**
 * Fetch all patients from the backend
 */
export async function fetchPatients(skip: number = 0, limit: number = 100): Promise<ApiPatientResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/basic/?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier to bypass the warning page
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Fetched patients:', data)
    return data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

/**
 * Convert API patient response to internal PatientResponse format
 */
export function convertApiPatientToInternal(apiPatient: ApiPatientResponse) {
  return {
    id: apiPatient.patient_id,
    mrn: apiPatient.patient_id, // Using patient_id as MRN for now
    name: apiPatient.name,
    age: apiPatient.age,
    sex: apiPatient.sex,
    phone: apiPatient.phone,
    city: apiPatient.city,
    status: "new" as const,
    lastVisit: apiPatient.created_at,
  }
}

/**
 * Fetch detailed patient information by patient ID
 */
export async function fetchPatientDetails(patientId: string): Promise<ApiPatientDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ehr/${patientId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier to bypass the warning page
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Patient not found: ${patientId}`)
      }
      throw new Error(`Failed to fetch patient details: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Fetched patient details:', data)
    return data
  } catch (error) {
    console.error('Error fetching patient details:', error)
    throw error
  }
}

/**
 * Create a new patient
 * Endpoint: POST /patients/
 * Body: { name, age, sex, phone?, city? }
 */
export interface CreatePatientRequest {
  name: string
  age: number
  sex: "M" | "F" | "Other"
  phone?: string
  city?: string
}

export interface CreatePatientResponse {
  success: boolean
  message?: string
  data?: ApiPatientResponse
  errors?: Record<string, string>
}

export async function createPatient(payload: CreatePatientRequest): Promise<CreatePatientResponse> {
  try {
    // POST to /patients/basic/ as requested
    const response = await fetch(`${API_BASE_URL}/patients/basic/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      // Return structured error information when possible
      return {
        success: false,
        message: data?.message || response.statusText,
        errors: data?.errors || undefined,
      }
    }

    return {
      success: true,
      message: data?.message || 'Patient created',
      data: data as ApiPatientResponse,
    }
  } catch (error: unknown) {
    // Safely extract message from unknown error
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating patient:', message)
    return {
      success: false,
      message,
    }
  }
}

/**
 * Clinical Notes API
 * - GET /patients/{patient_id}/notes/  -> list notes for a patient
 * - POST /patients/{patient_id}/notes/ -> create a note for a patient
 */

export type ClinicalNoteType = "text" | "voice" | "prescription"

export type ClinicalNoteStatus = "draft" | "final" | "archived"

export interface ApiClinicalNote {
  note_id: string
  patient_id: string
  author?: string | null
  type: ClinicalNoteType
  content: string
  file_url?: string | null
  status: ClinicalNoteStatus
  created_at: string
  last_updated?: string
}

export interface CreateClinicalNoteRequest {
  patient_id: string
  type: ClinicalNoteType
  content: string
  status?: ClinicalNoteStatus // default to 'final' or 'draft' based on UI
  file_url?: string | null
}

export interface CreateClinicalNoteResponse {
  success: boolean
  message?: string
  data?: ApiClinicalNote
  errors?: Record<string, string>
}

export async function fetchClinicalNotes(patientId: string): Promise<ApiClinicalNote[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/notes/`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch clinical notes: ${response.statusText}`)
    }

    const data = await response.json()
    return data as ApiClinicalNote[]
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching clinical notes:', message)
    throw new Error(message)
  }
}

export async function createClinicalNote(payload: CreateClinicalNoteRequest): Promise<CreateClinicalNoteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${payload.patient_id}/notes/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || response.statusText,
        errors: data?.errors || undefined,
      }
    }

    return {
      success: true,
      message: data?.message || 'Clinical note created',
      data: data as ApiClinicalNote,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating clinical note:', message)
    return { success: false, message }
  }
}

/**
 * UNIFIED EHR UPDATE API
 * Updates any part of the patient's EHR using a single endpoint
 * Accepts partial updates - only send the fields you want to update
 */

export interface UpdateEHRRequest {
  patient_id: string
  data: Partial<ApiPatientDetailResponse>
}

export interface UpdateEHRResponse {
  success: boolean
  message?: string
  data?: ApiPatientDetailResponse
  errors?: Record<string, string>
}

/**
 * Update patient EHR data (medications, vitals, notes, timeline, etc.)
 * Uses PATCH method for partial updates
 */
export async function updatePatientEHR(patientId: string, updates: Partial<ApiPatientDetailResponse>): Promise<UpdateEHRResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ehr/${patientId}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(updates),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || response.statusText,
        errors: data?.errors || undefined,
      }
    }

    return {
      success: true,
      message: data?.message || 'Patient EHR updated',
      data: data as ApiPatientDetailResponse,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error updating patient EHR:', message)
    return { success: false, message }
  }
}

/**
 * Helper: Add a medication to patient's EHR
 */
export async function addMedication(patientId: string, medication: {
  name: string
  dosage: string
  frequency: string
  prescribed_date?: string
  prescribing_doctor?: string
  status?: string
}) {
  const medicationData = {
    medication_id: `med_${Date.now()}`, // Temporary ID, backend should generate proper one
    name: medication.name,
    dosage: medication.dosage,
    frequency: medication.frequency,
    prescribed_date: medication.prescribed_date || new Date().toISOString().split('T')[0],
    prescribing_doctor: medication.prescribing_doctor || 'Unknown',
    status: medication.status || 'Active'
  }

  // Note: Backend should append to existing medications array
  // This is a simplified version - backend handles array merging
  return updatePatientEHR(patientId, {
    medical_info: {
      blood_type: null,
      allergies: [],
      chronic_conditions: [],
      current_medications: [medicationData]
    }
  })
}

/**
 * Helper: Add a clinical note to patient's EHR
 */
export async function addClinicalNoteToEHR(patientId: string, note: {
  author?: string
  type: ClinicalNoteType
  content: string
  file_url?: string | null
  status?: ClinicalNoteStatus
}) {
  const noteData = {
    note_id: `note_${Date.now()}`, // Temporary ID
    date: new Date().toISOString(),
    author: note.author || 'Dr. Unknown',
    type: note.type,
    content: note.content,
    file_url: note.file_url || null,
    status: note.status || 'final',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  }

  return updatePatientEHR(patientId, {
    clinical_notes: [noteData]
  })
}

/**
 * Helper: Update vital signs in patient's EHR
 */
export async function updateVitalSigns(patientId: string, vitals: {
  blood_pressure?: { systolic: number; diastolic: number }
  heart_rate?: number
  temperature?: number
  respiratory_rate?: number
  oxygen_saturation?: number
  weight?: number
  height?: number
}) {
  const vitalSignsData: {
    last_recorded: string
    blood_pressure?: { systolic: number; diastolic: number; unit: string }
    heart_rate?: { value: number; unit: string }
    temperature?: { value: number; unit: string }
    respiratory_rate?: { value: number; unit: string }
    oxygen_saturation?: { value: number; unit: string }
    weight?: { value: number; unit: string }
    height?: { value: number; unit: string }
    bmi?: { value: number; category: string }
  } = {
    last_recorded: new Date().toISOString(),
  }

  if (vitals.blood_pressure) {
    vitalSignsData.blood_pressure = {
      systolic: vitals.blood_pressure.systolic,
      diastolic: vitals.blood_pressure.diastolic,
      unit: 'mmHg'
    }
  }

  if (vitals.heart_rate) {
    vitalSignsData.heart_rate = {
      value: vitals.heart_rate,
      unit: 'bpm'
    }
  }

  if (vitals.temperature) {
    vitalSignsData.temperature = {
      value: vitals.temperature,
      unit: 'F'
    }
  }

  if (vitals.weight) {
    vitalSignsData.weight = {
      value: vitals.weight,
      unit: 'lbs'
    }
  }

  if (vitals.height) {
    vitalSignsData.height = {
      value: vitals.height,
      unit: 'in'
    }
  }

  return updatePatientEHR(patientId, {
    // client-side demo: cast to ApiPatientDetailResponse['vital_signs'] for structural compatibility
    vital_signs: vitalSignsData as unknown as ApiPatientDetailResponse['vital_signs']
  })
}

/**
 * Helper: Add a timeline event to patient's health trajectory
 */
export async function addTimelineEvent(patientId: string) {
  // demo placeholder: server handles adding timeline events; UI calls this to trigger a sample update
  return updatePatientEHR(patientId, {
    health_trajectory: {
      current_status: 'Good',
      risk_level: 'Low',
      predicted_trajectory: 'Stable',
      last_assessment_date: new Date().toISOString(),
      key_metrics: {},
    }
  })
}
