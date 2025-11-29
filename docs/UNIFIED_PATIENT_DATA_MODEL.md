# Unified Patient Data Model

## Overview
This document defines the **master collection** for all patient-related data. Every piece of information displayed in the UI (medications, vitals, trajectory, AI insights, clinical notes, etc.) is stored in a single unified response from the backend.

## Master API Endpoint

### GET `/api/v1/ehr/{patient_id}`
Returns complete patient Electronic Health Record with all nested collections.

### PATCH/PUT `/api/v1/ehr/{patient_id}`
Updates any section of the patient's EHR. Accepts partial updates.

---

## Complete Data Structure

```typescript
{
  // 1. BASIC PATIENT INFO
  "patient_id": "string",
  "personal_info": {
    "name": "string",
    "date_of_birth": "YYYY-MM-DD | null",
    "age": number,
    "sex": "M" | "F" | "Other",
    "phone": "string",
    "email": "string | null",
    "address": {
      "street": "string | null",
      "city": "string | null",
      "state": "string | null",
      "zip_code": "string | null",
      "country": "string | null"
    },
    "emergency_contact": {
      "name": "string",
      "relationship": "string",
      "phone": "string"
    } | null
  },

  // 2. MEDICAL INFORMATION
  "medical_info": {
    "blood_type": "string | null",
    "allergies": [
      {
        "allergen": "string",
        "severity": "High" | "Medium" | "Low",
        "reaction": "string"
      }
    ],
    "chronic_conditions": [
      {
        "condition": "string",
        "diagnosed_date": "YYYY-MM-DD",
        "status": "Active" | "Controlled" | "Resolved"
      }
    ],
    
    // MEDICATIONS COLLECTION (UI: MedicationsList component)
    "current_medications": [
      {
        "medication_id": "string",
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "prescribed_date": "YYYY-MM-DD",
        "prescribing_doctor": "string",
        "status": "Active" | "Discontinued" | "On Hold"
      }
    ]
  },

  // 3. VITAL SIGNS (UI: VitalSignsGrid component)
  "vital_signs": {
    "last_recorded": "ISO8601 timestamp | null",
    "blood_pressure": {
      "systolic": number,
      "diastolic": number,
      "unit": "mmHg"
    } | null,
    "heart_rate": {
      "value": number,
      "unit": "bpm"
    } | null,
    "temperature": {
      "value": number,
      "unit": "F" | "C"
    } | null,
    "respiratory_rate": {
      "value": number,
      "unit": "breaths/min"
    } | null,
    "oxygen_saturation": {
      "value": number,
      "unit": "%"
    } | null,
    "weight": {
      "value": number,
      "unit": "lbs" | "kg"
    } | null,
    "height": {
      "value": number,
      "unit": "in" | "cm"
    } | null,
    "bmi": {
      "value": number,
      "category": "Underweight" | "Normal" | "Overweight" | "Obese"
    } | null,
    
    // VITAL SIGNS HISTORY (UI: HealthTrajectoryChart)
    "history": [
      {
        "recorded_at": "ISO8601 timestamp",
        "blood_pressure": { "systolic": number, "diastolic": number },
        "heart_rate": number,
        "glucose": number | null,
        "weight": number | null,
        "temperature": number | null
      }
    ]
  },

  // 4. HEALTH TRAJECTORY (UI: HealthTrajectory component)
  "health_trajectory": {
    "current_status": "Excellent" | "Good" | "Fair" | "Poor",
    "risk_level": "Low" | "Medium" | "High",
    "predicted_trajectory": "Improving" | "Stable" | "Declining",
    "last_assessment_date": "ISO8601 | null",
    "key_metrics": {
      "bp_trend": "improving" | "stable" | "worsening",
      "glucose_trend": "improving" | "stable" | "worsening",
      "weight_trend": "improving" | "stable" | "worsening"
    },
    
    // TIMELINE EVENTS (UI: HealthTrajectoryTimeline)
    "timeline": [
      {
        "event_id": "string",
        "date": "YYYY-MM-DD",
        "title": "string",
        "type": "visit" | "medication" | "lab" | "procedure" | "current",
        "status": "excellent" | "good" | "improving" | "neutral" | "concern",
        "metrics": {
          "bp": "120/76",
          "glucose": "92",
          "weight": "156"
        },
        "notes": "string",
        "icon": "string"
      }
    ]
  },

  // 5. AI INSIGHTS (UI: AIInsights component)
  "ai_insights": {
    "last_updated": "ISO8601 timestamp",
    "insights": [
      {
        "insight_id": "string",
        "type": "positive" | "warning" | "info" | "critical",
        "title": "string",
        "description": "string",
        "confidence": number,  // 0-100
        "category": "blood_pressure" | "glucose" | "weight" | "heart_rate" | "general",
        "actionable": boolean,
        "recommended_action": "string | null"
      }
    ]
  },

  // 6. CLINICAL NOTES (UI: ClinicalNotesForm, ClinicalNotesPage)
  "clinical_notes": [
    {
      "note_id": "string",
      "date": "ISO8601 timestamp",
      "author": "string",
      "type": "text" | "voice" | "prescription" | "progress" | "diagnosis",
      "content": "string",
      "file_url": "string | null",
      "status": "draft" | "final" | "archived",
      "created_at": "ISO8601 timestamp",
      "last_updated": "ISO8601 timestamp"
    }
  ],

  // 7. VISITS & APPOINTMENTS
  "recent_visits": [
    {
      "visit_id": "string",
      "date": "ISO8601 timestamp",
      "type": "In-person" | "Telehealth" | "Emergency",
      "doctor": "string",
      "reason": "string",
      "notes": "string"
    }
  ],
  
  "appointments": {
    "upcoming": [
      {
        "appointment_id": "string",
        "date": "ISO8601 timestamp",
        "doctor": "string",
        "type": "string",
        "reason": "string"
      }
    ],
    "past": [
      {
        "appointment_id": "string",
        "date": "ISO8601 timestamp",
        "doctor": "string",
        "type": "string",
        "reason": "string",
        "status": "Completed" | "Cancelled" | "No-show"
      }
    ]
  },

  // 8. LAB RESULTS
  "lab_results": [
    {
      "test_id": "string",
      "test_name": "string",
      "result": "string",
      "unit": "string",
      "reference_range": "string",
      "status": "Normal" | "Abnormal" | "Critical",
      "date": "ISO8601 timestamp"
    }
  ],

  // 9. DOCUMENTS & FILES
  "documents": [
    {
      "document_id": "string",
      "type": "Lab Report" | "Imaging" | "Prescription" | "Insurance" | "Other",
      "name": "string",
      "date": "ISO8601 timestamp",
      "url": "string"
    }
  ],

  // 10. INSURANCE INFORMATION
  "insurance_info": {
    "provider": "string | null",
    "policy_number": "string | null",
    "group_number": "string | null",
    "coverage_type": "string | null",
    "effective_date": "YYYY-MM-DD | null",
    "expiration_date": "YYYY-MM-DD | null"
  },

  // 11. METADATA
  "created_at": "ISO8601 timestamp",
  "last_updated": "ISO8601 timestamp"
}
```

---

## UI Component Mapping

| UI Component | Data Source in Master Collection |
|-------------|----------------------------------|
| `PatientHeader` | `personal_info` |
| `VitalSignsGrid` | `vital_signs` (current values) |
| `HealthTrajectoryChart` | `vital_signs.history` |
| `HealthTrajectoryTimeline` | `health_trajectory.timeline` |
| `MedicationsList` | `medical_info.current_medications` |
| `AIInsights` | `ai_insights.insights` |
| `ClinicalNotesForm` | `clinical_notes` |
| Documents Section | `documents` |
| Appointments | `appointments.upcoming` + `appointments.past` |
| Lab Results | `lab_results` |

---

## Update Operations

### Adding a Medication
```typescript
PATCH /api/v1/ehr/{patient_id}
{
  "medical_info": {
    "current_medications": [
      {
        "medication_id": "auto-generated",
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Daily",
        "prescribed_date": "2024-11-29",
        "prescribing_doctor": "Dr. Smith",
        "status": "Active"
      }
    ]
  }
}
```

### Adding a Clinical Note
```typescript
PATCH /api/v1/ehr/{patient_id}
{
  "clinical_notes": [
    {
      "note_id": "auto-generated",
      "date": "2024-11-29T10:30:00Z",
      "author": "Dr. Johnson",
      "type": "text",
      "content": "Patient reports improvement...",
      "status": "final",
      "created_at": "2024-11-29T10:30:00Z"
    }
  ]
}
```

### Updating Vital Signs
```typescript
PATCH /api/v1/ehr/{patient_id}
{
  "vital_signs": {
    "last_recorded": "2024-11-29T10:30:00Z",
    "blood_pressure": {
      "systolic": 120,
      "diastolic": 76,
      "unit": "mmHg"
    },
    "heart_rate": {
      "value": 67,
      "unit": "bpm"
    }
  }
}
```

### Adding a Timeline Event
```typescript
PATCH /api/v1/ehr/{patient_id}
{
  "health_trajectory": {
    "timeline": [
      {
        "event_id": "auto-generated",
        "date": "2024-11-29",
        "title": "Follow-up Visit",
        "type": "visit",
        "status": "good",
        "metrics": {
          "bp": "120/76",
          "weight": "156"
        },
        "notes": "All vitals normal"
      }
    ]
  }
}
```

---

## Implementation Notes

1. **Single Source of Truth**: All UI components fetch data from the unified EHR endpoint
2. **Optimistic Updates**: Frontend can update UI immediately, then sync with backend
3. **Partial Updates**: PATCH endpoint allows updating specific sections without sending entire object
4. **Auto-generated IDs**: Backend generates unique IDs for medications, notes, timeline events, etc.
5. **Timestamps**: All timestamps in ISO8601 format for consistency
6. **Status Enums**: Predefined status values for consistency across the system

---

## Migration Path

1. ✅ Backend implements unified EHR endpoint
2. ✅ Frontend fetches complete EHR on patient detail page load
3. ✅ All "Add" forms (medications, notes, vitals) send PATCH requests
4. ✅ Remove individual API endpoints (use only unified EHR endpoint)
5. ✅ Update UI components to work with unified data structure
