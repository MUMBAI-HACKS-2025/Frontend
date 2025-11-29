# Backend API Requirements for Patient Details Page

## Priority: HIGH ⚠️

The frontend has been updated to support detailed patient information. The following API endpoint is **REQUIRED** for the patient details page to function.

---

## Required Endpoint

### `GET /api/v1/patients/{patient_id}/details/`

This endpoint must be implemented to provide comprehensive patient information for the patient detail page.

---

## Quick Start for Backend Developer

### Endpoint URL Pattern
```
GET https://3d4c09013fe8.ngrok-free.app/api/v1/patients/{patient_id}/details/
```

### Example Request
```bash
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/PT_20251129_795/details/' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true'
```

### Required Response Structure

The response must include ALL of the following sections:

```json
{
  "patient_id": "PT_20251129_795",
  
  "personal_info": {
    "name": "John Doe",
    "date_of_birth": "1980-05-15",
    "age": 45,
    "sex": "M",
    "phone": "+1-234-567-8900",
    "email": "john.doe@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "USA"
    },
    "emergency_contact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1-234-567-8901"
    }
  },
  
  "medical_info": {
    "blood_type": "O+",
    "allergies": [
      {
        "allergen": "Penicillin",
        "severity": "High",
        "reaction": "Anaphylaxis"
      }
    ],
    "chronic_conditions": [
      {
        "condition": "Hypertension",
        "diagnosed_date": "2015-03-20",
        "status": "Active"
      }
    ],
    "current_medications": [
      {
        "medication_id": "MED001",
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "prescribed_date": "2015-03-20",
        "prescribing_doctor": "Dr. Smith"
      }
    ]
  },
  
  "vital_signs": {
    "last_recorded": "2025-11-28T10:30:00.000000",
    "blood_pressure": {
      "systolic": 128,
      "diastolic": 82,
      "unit": "mmHg"
    },
    "heart_rate": {
      "value": 72,
      "unit": "bpm"
    },
    "temperature": {
      "value": 98.6,
      "unit": "°F"
    },
    "respiratory_rate": {
      "value": 16,
      "unit": "breaths/min"
    },
    "oxygen_saturation": {
      "value": 98,
      "unit": "%"
    },
    "weight": {
      "value": 180,
      "unit": "lbs"
    },
    "height": {
      "value": 70,
      "unit": "inches"
    },
    "bmi": {
      "value": 25.8,
      "category": "Overweight"
    }
  },
  
  "health_trajectory": {
    "current_status": "Stable",
    "risk_level": "Medium",
    "predicted_trajectory": "Improving",
    "last_assessment_date": "2025-11-28",
    "key_metrics": {
      "blood_pressure_trend": "Stable",
      "glucose_trend": "Improving",
      "weight_trend": "Stable"
    }
  },
  
  "recent_visits": [
    {
      "visit_id": "V001",
      "date": "2025-11-28T10:00:00.000000",
      "type": "Follow-up",
      "doctor": "Dr. Smith",
      "reason": "Diabetes management",
      "notes": "Patient showing good control"
    }
  ],
  
  "lab_results": [
    {
      "test_id": "LAB001",
      "test_name": "HbA1c",
      "result": "6.8",
      "unit": "%",
      "reference_range": "4.0-5.6",
      "status": "Slightly elevated",
      "date": "2025-11-28T10:30:00.000000"
    }
  ],
  
  "appointments": {
    "upcoming": [
      {
        "appointment_id": "APT001",
        "date": "2025-12-15T10:00:00.000000",
        "doctor": "Dr. Smith",
        "type": "Follow-up",
        "reason": "Check medication effectiveness"
      }
    ],
    "past": [
      {
        "appointment_id": "APT002",
        "date": "2025-11-28T10:00:00.000000",
        "doctor": "Dr. Smith",
        "type": "Follow-up",
        "reason": "Diabetes management",
        "status": "Completed"
      }
    ]
  },
  
  "insurance_info": {
    "provider": "Blue Cross Blue Shield",
    "policy_number": "BCBS123456789",
    "group_number": "GRP001",
    "coverage_type": "PPO",
    "effective_date": "2020-01-01",
    "expiration_date": "2025-12-31"
  },
  
  "clinical_notes": [
    {
      "note_id": "NOTE001",
      "date": "2025-11-28T10:30:00.000000",
      "author": "Dr. Smith",
      "type": "Progress Note",
      "content": "Patient continues to show improvement..."
    }
  ],
  
  "documents": [
    {
      "document_id": "DOC001",
      "type": "Lab Report",
      "name": "Blood Work Results - Nov 2025",
      "date": "2025-11-28",
      "url": "/api/v1/documents/DOC001"
    }
  ],
  
  "created_at": "2025-11-29T04:36:50.312000",
  "last_updated": "2025-11-29T10:30:00.000000"
}
```

---

## Critical Fields Required for UI

### Must Have (Frontend will break without these):
1. **personal_info** - All fields required
2. **medical_info** - At least empty arrays for allergies, chronic_conditions, current_medications
3. **vital_signs** - All fields required
4. **health_trajectory** - All fields required
5. **appointments** - Both upcoming and past arrays (can be empty)
6. **insurance_info** - All fields required

### Nice to Have (Frontend handles gracefully if missing):
- recent_visits (can be empty array)
- lab_results (can be empty array)
- clinical_notes (can be empty array)
- documents (can be empty array)

---

## Error Handling

### 404 Not Found
```json
{
  "detail": "Patient not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Invalid patient ID format"
}
```

---

## Implementation Checklist

- [ ] Create endpoint route: `GET /api/v1/patients/{patient_id}/details/`
- [ ] Implement database queries to fetch all required data
- [ ] Structure response according to the JSON schema above
- [ ] Add proper error handling (404 for not found, 400 for invalid ID)
- [ ] Test with existing patient IDs from `/patients/basic/` endpoint
- [ ] Verify CORS headers are set correctly
- [ ] Ensure `ngrok-skip-browser-warning` header is handled

---

## Testing

Test the endpoint with an existing patient:
```bash
# First, get a patient ID from the list
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/basic/?skip=0&limit=1' \
  -H 'accept: application/json'

# Then test the details endpoint with that patient_id
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/{patient_id}/details/' \
  -H 'accept: application/json'
```

---

## Frontend Integration Status

✅ Frontend route configured: `/patients/:id`
✅ API service function created: `fetchPatientDetails(patientId)`
✅ TypeScript interfaces defined for response structure
✅ Patient detail page UI implemented
✅ Navigation from home page to patient details working
✅ Loading and error states handled

⚠️ **Waiting for backend to implement the details endpoint**

---

## Questions or Issues?

Refer to the complete API contract at: `/docs/API_CONTRACT.md`
