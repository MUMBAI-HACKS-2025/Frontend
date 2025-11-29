# API Contract for Backend Developer

## Patient Details Endpoint

### Endpoint
```
GET /api/v1/patients/{patient_id}/details/
```

### Headers Required
```
Accept: application/json
```

### Path Parameters
- `patient_id` (string, required): The unique identifier for the patient (e.g., "PT_20251129_795")

### Response

#### Success Response (200 OK)

```json
{
  "patient_id": "PT_20251129_795",
  "personal_info": {
    "name": "John Doe",
    "date_of_birth": "1980-01-15" | null,
    "age": 45,
    "sex": "M" | "F" | "Other",
    "phone": "+1-234-567-8900",
    "email": "john.doe@email.com" | null,
    "address": {
      "street": "123 Main St" | null,
      "city": "New York" | null,
      "state": "NY" | null,
      "zip_code": "10001" | null,
      "country": "USA" | null
    },
    "emergency_contact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1-234-567-8901"
    } | null
  },
  "medical_info": {
    "blood_type": "A+" | null,
    "allergies": [
      {
        "allergen": "Penicillin",
        "severity": "High" | "Medium" | "Low",
        "reaction": "Rash, difficulty breathing"
      }
    ],
    "chronic_conditions": [
      {
        "condition": "Hypertension",
        "diagnosed_date": "2020-05-10",
        "status": "Active" | "Managed" | "Resolved"
      }
    ],
    "current_medications": [
      {
        "medication_id": "MED_001",
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "prescribed_date": "2024-01-15",
        "prescribing_doctor": "Dr. Smith"
      }
    ]
  },
  "vital_signs": {
    "last_recorded": "2025-11-29T10:30:00Z" | null,
    "blood_pressure": {
      "systolic": 120,
      "diastolic": 80,
      "unit": "mmHg"
    } | null,
    "heart_rate": {
      "value": 72,
      "unit": "bpm"
    } | null,
    "temperature": {
      "value": 98.6,
      "unit": "°F"
    } | null,
    "respiratory_rate": {
      "value": 16,
      "unit": "breaths/min"
    } | null,
    "oxygen_saturation": {
      "value": 98,
      "unit": "%"
    } | null,
    "weight": {
      "value": 180,
      "unit": "lbs"
    } | null,
    "height": {
      "value": 70,
      "unit": "inches"
    } | null,
    "bmi": {
      "value": 25.8,
      "category": "Normal" | "Underweight" | "Overweight" | "Obese"
    } | null
  },
  "health_trajectory": {
    "current_status": "Stable" | "Improving" | "Declining" | "Unknown",
    "risk_level": "Low" | "Medium" | "High" | "Unknown",
    "predicted_trajectory": "Stable" | "Improving" | "Declining" | "Unknown",
    "last_assessment_date": "2025-11-29" | null,
    "key_metrics": {
      "blood_pressure_trend": "stable",
      "glucose_trend": "improving",
      "weight_trend": "stable"
    }
  },
  "recent_visits": [
    {
      "visit_id": "VISIT_001",
      "date": "2025-11-20",
      "type": "Follow-up",
      "doctor": "Dr. Smith",
      "reason": "Hypertension check",
      "notes": "Patient doing well, continue current medication"
    }
  ],
  "lab_results": [
    {
      "test_id": "LAB_001",
      "test_name": "Complete Blood Count",
      "result": "Normal",
      "unit": "",
      "reference_range": "Normal",
      "status": "Final" | "Pending" | "Abnormal",
      "date": "2025-11-15"
    }
  ],
  "appointments": {
    "upcoming": [
      {
        "appointment_id": "APT_001",
        "date": "2025-12-01T14:00:00Z",
        "doctor": "Dr. Smith",
        "type": "Follow-up",
        "reason": "Blood pressure check"
      }
    ],
    "past": [
      {
        "appointment_id": "APT_000",
        "date": "2025-11-20T10:00:00Z",
        "doctor": "Dr. Smith",
        "type": "Consultation",
        "reason": "Annual checkup",
        "status": "Completed"
      }
    ]
  },
  "insurance_info": {
    "provider": "Blue Cross Blue Shield" | null,
    "policy_number": "BC123456789" | null,
    "group_number": "GRP001" | null,
    "coverage_type": "PPO" | null,
    "effective_date": "2024-01-01" | null,
    "expiration_date": "2025-12-31" | null
  },
  "clinical_notes": [
    {
      "note_id": "NOTE_001",
      "date": "2025-11-20",
      "author": "Dr. Smith",
      "type": "Progress Note",
      "content": "Patient presents for follow-up..."
    }
  ],
  "documents": [
    {
      "document_id": "DOC_001",
      "type": "Lab Report",
      "name": "CBC Results - Nov 2025",
      "date": "2025-11-15",
      "url": "/documents/DOC_001.pdf"
    }
  ],
  "created_at": "2025-11-29T04:36:50.312000",
  "last_updated": "2025-11-29T06:18:16.946355"
}
```

#### Error Responses

**404 Not Found**
```json
{
  "detail": "Patient not found"
}
```

**500 Internal Server Error**
```json
{
  "detail": "Internal server error"
}
```

### Important Notes

#### 1. Nullable Fields
Many fields can be `null` if data is not available. The frontend handles this gracefully by:
- Showing "Not provided" for missing contact info
- Showing "No vital signs recorded" for missing vitals
- Hiding sections if arrays are empty
- Using fallback values (e.g., "Unknown" for risk level)

#### 2. Date Formats
- Use ISO 8601 format: `"YYYY-MM-DDTHH:mm:ssZ"`
- Example: `"2025-11-29T10:30:00Z"`

#### 3. Enums
Strictly typed fields should use these exact values:

**Sex:**
- `"M"` - Male
- `"F"` - Female
- `"Other"` - Other

**Severity:**
- `"High"`, `"Medium"`, `"Low"`

**Risk Level:**
- `"Low"`, `"Medium"`, `"High"`, `"Unknown"`

**Status (Appointments):**
- `"Completed"`, `"Cancelled"`, `"No-show"`

**BMI Category:**
- `"Underweight"`, `"Normal"`, `"Overweight"`, `"Obese"`

#### 4. CORS Headers Required
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

#### 5. Response Time
- Target: < 500ms
- Maximum: < 2000ms

### Testing the Endpoint

```bash
# Test with curl
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/PT_20251129_795/details/' \
  -H 'accept: application/json'

# Expected: 200 OK with patient data
# If patient doesn't exist: 404 Not Found
```

### Validation Rules

1. **patient_id**: 
   - Format: `PT_YYYYMMDD_XXX`
   - Must exist in database
   - Case-sensitive

2. **Arrays**: 
   - Always return empty array `[]` if no data
   - Never return `null` for array fields

3. **Dates**:
   - ISO 8601 format required
   - UTC timezone preferred

4. **Phone Numbers**:
   - International format: `+1-234-567-8900`
   - Or any standard format

### Current Implementation Status

✅ **Working:**
- Basic patient info (name, age, sex, phone, city)
- Empty arrays for medications, allergies, conditions
- Null values for missing data
- Created/updated timestamps

⏳ **To Be Implemented:**
- Vital signs data
- Medications list
- Allergies information
- Appointments
- Lab results
- Insurance details
- Clinical notes
- Documents

---

**Questions?** Contact frontend team for clarification on data format or additional fields needed.
