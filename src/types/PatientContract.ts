export interface PatientResponse {
  id: string
  mrn: string
  name: string
  age: number
  sex?: string
  phone?: string
  city?: string
  status?: string
  lastVisit?: string
}

export interface CreatePatientRequest {
  name: string
  age: number
  sex: "M" | "F" | "Other"
  phone?: string
  city?: string
}

export interface EditPatientRequest {
  name?: string
  age?: number
  sex?: "M" | "F" | "Other"
  phone?: string
  city?: string
}
