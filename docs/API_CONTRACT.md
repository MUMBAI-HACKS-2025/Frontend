# MedIQ API Contract

## Base URL
```
https://3d4c09013fe8.ngrok-free.app/api/v1
```

## Headers Required for All Requests
```
Accept: application/json
ngrok-skip-browser-warning: true
```

---

## 1. Get Patient List

### Endpoint
```
GET /patients/basic/
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| skip | integer | No | 0 | Number of records to skip for pagination |
| limit | integer | No | 100 | Maximum number of records to return |

### Request Example
```bash
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/basic/?skip=0&limit=100' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true'
```

### Response (200 OK)
```json
[
  {
    "patient_id": "PT_20251129_795",
    "name": "John Doe",
    "age": 45,
    "sex": "M",
    "phone": "+1-234-567-8900",
    "city": "New York",
    "created_at": "2025-11-29T04:36:50.312000"
  }
]
```

---

## 2. Get Patient Details (REQUIRED - TO BE IMPLEMENTED)

### Endpoint
```
GET /patients/{patient_id}/details/
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patient_id | string | Yes | Unique patient identifier (e.g., "PT_20251129_795") |

### Request Example
```bash
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/PT_20251129_795/details/' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true'
```

### Expected Response (200 OK)
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
      },
      {
        "condition": "Type 2 Diabetes",
        "diagnosed_date": "2018-07-10",
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
      },
      {
        "medication_id": "MED002",
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "prescribed_date": "2018-07-10",
        "prescribing_doctor": "Dr. Johnson"
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
      "notes": "Patient showing good control of blood sugar levels"
    },
    {
      "visit_id": "V002",
      "date": "2025-10-15T14:30:00.000000",
      "type": "Regular checkup",
      "doctor": "Dr. Johnson",
      "reason": "Annual physical",
      "notes": "Overall health good, continue current medications"
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
    },
    {
      "test_id": "LAB002",
      "test_name": "Fasting Glucose",
      "result": "110",
      "unit": "mg/dL",
      "reference_range": "70-100",
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
      "content": "Patient continues to show improvement in glucose control. Current medications appear effective. Advised to continue diet and exercise regimen."
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

### Error Responses

#### 404 Not Found
```json
{
  "detail": "Patient not found"
}
```

#### 400 Bad Request
```json
{
  "detail": "Invalid patient ID format"
}
```

---

## 3. Upload Patient Document

### Endpoint
```
POST /upload/
```

### Request Body (multipart/form-data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patient_id | string | Yes | Unique patient identifier |
| file | file | Yes | Document file to upload (images, PDFs, etc.) |

### Request Example
```bash
curl -X 'POST' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/upload/' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true' \
  -H 'Content-Type: multipart/form-data' \
  -F 'patient_id=PT_20251129_795' \
  -F 'file=@document.pdf;type=application/pdf'
```

### Expected Response (200 OK)
```json
{
  "document_id": "DOC001",
  "patient_id": "PT_20251129_795",
  "filename": "document.pdf",
  "file_type": "application/pdf",
  "upload_date": "2025-11-29T10:30:00.000000",
  "status": "success",
  "message": "File uploaded successfully"
}
```

---

## Data Type Definitions

### Sex Values
- `"M"` - Male
- `"F"` - Female
- `"Other"` - Other

### Date Format
All dates follow ISO 8601 format: `YYYY-MM-DDTHH:MM:SS.mmmmmm`

### Allergy Severity
- `"High"` - Life-threatening
- `"Medium"` - Moderate reaction
- `"Low"` - Mild reaction

### Visit Types
- `"Follow-up"` - Follow-up appointment
- `"Regular checkup"` - Routine physical
- `"Emergency"` - Emergency visit
- `"Consultation"` - Specialist consultation

### Appointment Status
- `"Scheduled"` - Upcoming appointment
- `"Completed"` - Past appointment
- `"Cancelled"` - Cancelled appointment
- `"No-show"` - Patient didn't attend

---

## Notes for Backend Developer

1. **Patient Details Endpoint Priority**: The `/patients/{patient_id}/details/` endpoint is critical for the patient detail page functionality. This should be implemented with the exact structure shown above.

2. **CORS Headers**: Ensure proper CORS headers are set for cross-origin requests.

3. **Authentication**: Currently no authentication is shown. Consider adding JWT or API key authentication in future versions.

4. **Pagination**: The patient list endpoint supports pagination. Consider implementing cursor-based pagination for better performance with large datasets.

5. **Error Handling**: Implement consistent error response format across all endpoints.

6. **Rate Limiting**: Consider implementing rate limiting to prevent abuse.

7. **Validation**: Validate all input parameters and return appropriate 400 errors for invalid inputs.

8. **Data Privacy**: Ensure all patient data is properly secured and complies with HIPAA regulations.
