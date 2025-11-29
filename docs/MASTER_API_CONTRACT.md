# MedIQ Master API Contract

This consolidated document collects the API contracts required by the MedIQ frontend. It supersedes the previous per-feature docs. Keep this file as the single source of truth for backend implementers.

Base URL (example):
```
https://<your-backend>/api/v1
```

Required headers for all requests
```
Accept: application/json
ngrok-skip-browser-warning: true
Authorization: Bearer <token>  # recommended for production
```

Date & format conventions
- Dates and timestamps use ISO 8601 (e.g., 2025-11-29T12:00:00.000000)
- Sex values: "M", "F", "Other"

---

1) Patients - List (basic)

GET /patients/basic/?skip={skip}&limit={limit}

Response (200)
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

Notes: frontend expects these fields for patient list views.

---

2) Patients - Create

POST /patients/

Request body (JSON)
```json
{
  "name": "John Doe",
  "age": 45,
  "sex": "M",
  "phone": "+1-234-567-8900",
  "city": "New York"
}
```

Success response (201)
```json
{
  "patient_id": "PT_20251129_795",
  "name": "John Doe",
  "age": 45,
  "sex": "M",
  "phone": "+1-234-567-8900",
  "city": "New York",
  "created_at": "2025-11-29T04:36:50.312000"
}
```

Validation error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "name": "Name required" }
}
```

---

3) Patients - Details (detailed record)

GET /patients/{patient_id}/details/

Response (200) - trimmed example
```json
{
  "patient_id": "PT_20251129_795",
  "personal_info": { "name":"John Doe", "date_of_birth":"1980-05-15", "age":45, ... },
  "medical_info": { "blood_type": "O+", "allergies": [...], "current_medications": [...] },
  "vital_signs": { "last_recorded": "2025-11-28T10:30:00.000000", "blood_pressure": {"systolic":128, "diastolic":82, "unit":"mmHg"}, ... },
  "health_trajectory": {...},
  "recent_visits": [...],
  "lab_results": [...],
  "appointments": { "upcoming": [...], "past": [...] },
  "insurance_info": {...},
  "clinical_notes": [...],
  "documents": [...],
  "created_at": "2025-11-29T04:36:50.312000",
  "last_updated": "2025-11-29T10:30:00.000000"
}
```

Notes: the frontend detail page relies on this structure. Implement this endpoint as priority.

---

4) Clinical Notes

List notes for a patient
GET /patients/{patient_id}/notes/

Create a clinical note
POST /patients/{patient_id}/notes/

Create body (JSON)
```json
{
  "patient_id": "PT_20251129_795",
  "type": "text",
  "content": "Clinical note text or extracted text from file",
  "status": "final", // optional: draft | final | archived
  "file_url": "https://..." // optional
}
```

Success (201)
```json
{
  "success": true,
  "message": "Clinical note created",
  "data": {
    "note_id": "NOTE_20251129_001",
    "patient_id": "PT_20251129_795",
    "author": "Dr. Smith",
    "type": "text",
    "content": "...",
    "file_url": null,
    "status": "final",
    "created_at": "2025-11-29T12:00:00.000000"
  }
}
```

Status semantics
- draft: editable, not finalized
- final: finalized note
- archived: hidden/archived

File flow (prescriptions / uploads)
- POST /upload/ (multipart/form-data) with fields: patient_id, file
- Response should return `file_url` to be used by note creation

---

5) Uploads (documents)

POST /upload/
Request: multipart/form-data
Fields: patient_id, file
Response (200)
```json
{
  "document_id": "DOC001",
  "patient_id": "PT_20251129_795",
  "filename": "prescription.pdf",
  "file_url": "https://<your-backend>/media/DOC001/prescription.pdf",
  "file_type": "application/pdf",
  "upload_date": "2025-11-29T12:05:00.000000",
  "status": "success"
}
```

---

6) General guidance for backend implementers
- Return consistent error shapes: { success: false, message: string, errors?: Record<string,string> }
- Validate `patient_id` exists for patient-scoped endpoints
- Author and timestamp fields should be set server-side
- Enforce CORS and consider adding authentication (JWT recommended)
- Consider pagination for lists
- Ensure file uploads are secure and scanned for size/type

---

7) Quick curl examples

List patients:
```
curl -H 'accept: application/json' 'https://<your-backend>/api/v1/patients/basic/?skip=0&limit=100'
```

Create patient:
```
curl -X POST -H 'Content-Type: application/json' -d '{"name":"John","age":45,"sex":"M"}' 'https://<your-backend>/api/v1/patients/'
```

Upload file:
```
curl -X POST -F 'patient_id=PT_20251129_795' -F 'file=@prescription.pdf;type=application/pdf' 'https://<your-backend>/api/v1/upload/'
```

Create note (after upload):
```
curl -X POST -H 'Content-Type: application/json' -d '{"patient_id":"PT_20251129_795","type":"prescription","content":"Prescription uploaded","file_url":"https://<your-backend>/media/DOC001/prescription.pdf","status":"final"}' 'https://<your-backend>/api/v1/patients/PT_20251129_795/notes/'
```
