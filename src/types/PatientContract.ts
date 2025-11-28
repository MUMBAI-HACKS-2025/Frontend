/**
 * Patient Data Contract
 * 
 * Defines the data structures for creating and editing patient records.
 * Used across AddPatientDrawer, EditPatientForm, and API integrations.
 */

/**
 * Patient creation contract - minimal required fields for new patients
 * Matches AddPatientDrawer form fields: name, age, sex, phone, city
 */
export interface CreatePatientRequest {
  // Required fields
  name: string
  age: number
  sex: "M" | "F" | "Other"

  // Optional fields
  phone?: string
  city?: string
}

/**
 * Patient display contract - used in grid/table views
 * This is what PatientCardData should use
 * Same as PatientResponse but with additional display fields
 */
export interface PatientDisplayData {
  // Auto-generated identifiers
  id: string
  mrn: string

  // Personal info
  name: string
  age: number
  sex: "M" | "F" | "Other"

  // Contact info
  phone?: string
  city?: string

  // Status & history
  status: "new" | "stable" | "follow-up" | "urgent" | "inactive"
  lastVisit?: string // ISO timestamp
  nextAppt?: string // ISO timestamp

  // Display-specific fields
  vitals?: {
    bp?: string
    hr?: number
    temp?: number
  }
  medsCount?: number
  lastNoteSnippet?: string
  avatarUrl?: string | null
}

/**
 * Patient update contract - all fields optional for editing
 * At least one field should be provided for update
 */
export interface EditPatientRequest {
  // Identification (read-only in most cases, included for reference)
  id?: string
  mrn?: string

  // Personal info
  name?: string
  age?: number
  sex?: "M" | "F" | "Other"

  // Contact info
  phone?: string
  city?: string

  // Status
  status?: "new" | "stable" | "follow-up" | "urgent" | "inactive"
}

/**
 * Patient response contract - API response after create/update
 * Includes auto-generated fields and essential info
 */
export interface PatientResponse {
  // Auto-generated identifiers
  id: string // Internal patient ID (e.g., "001", "002")
  mrn: string // Medical Record Number (e.g., "MRN-2024-001-ABC12")

  // Personal info
  name: string
  age: number
  sex: "M" | "F" | "Other"

  // Contact info
  phone?: string
  city?: string

  // Visit history
  lastVisit?: string // ISO timestamp

  // Current status
  status: "new" | "stable" | "follow-up" | "urgent" | "inactive"
}

/**
 * Form validation contract
 * Defines required vs optional fields for form rendering
 */
export interface PatientFormValidation {
  // Required for both create and edit
  requiredFields: {
    create: (keyof CreatePatientRequest)[]
    edit: (keyof EditPatientRequest)[]
  }

  // Field-level validation rules
  rules: {
    [key: string]: {
      minLength?: number
      maxLength?: number
      pattern?: RegExp
      min?: number
      max?: number
      message?: string
    }
  }
}

/**
 * Default validation rules
 */
export const patientValidationRules: PatientFormValidation = {
  requiredFields: {
    create: ["name", "age", "sex"],
    edit: [], // No required fields for edit (partial update allowed)
  },
  rules: {
    name: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: "Name should contain only letters, spaces, hyphens, and apostrophes",
    },
    age: {
      min: 0,
      max: 150,
      message: "Age should be between 0 and 150",
    },
    phone: {
      minLength: 7,
      maxLength: 20,
      message: "Phone should be 7-20 characters",
    },
    city: {
      maxLength: 50,
      message: "City name should not exceed 50 characters",
    },
  },
}

/**
 * API Response contract for batch operations
 */
export interface PatientListResponse {
  data: PatientResponse[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * Form error contract
 */
export interface FormErrors {
  [key: string]: string
}

/**
 * Success response after patient create/update
 */
export interface PatientActionResponse {
  success: boolean
  message: string
  data?: PatientResponse
  errors?: FormErrors
}
