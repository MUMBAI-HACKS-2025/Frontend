# Clinical Notes API Contract

This document describes the API endpoints and payloads for clinical notes related to patients. The frontend expects these endpoints to be available and to follow the shapes described here.

Base URL (example):
```
https://<your-backend>/api/v1
```

Headers required for all requests (examples):
```
Accept: application/json
Content-Type: application/json
ngrok-skip-browser-warning: true
```

---

1) List clinical notes for a patient

Endpoint
```
GET /patients/{patient_id}/notes/
```
Path parameters
- patient_id: string (required)

Query parameters
- (optional) skip: integer
- (optional) limit: integer

Success response (200)
```json
[
  {
    "note_id": "NOTE_20251129_001",
    "patient_id": "PT_20251129_795",
    "author": "Dr. Smith",
    "type": "text",
    "content": "Patient reports improved sleep...",
    "file_url": null,
    "status": "final",
    "created_at": "2025-11-29T12:00:00.000000",
    "last_updated": null
  }
]
```

Error responses
- 404 Not Found: patient not found
- 500 Internal Server Error: standard error payload

---

2) Create clinical note for a patient

Endpoint
```
POST /patients/{patient_id}/notes/
```
Path parameters
- patient_id: string (required)

Request body (JSON)
- patient_id: string (must match the path parameter)
- type: "text" | "voice" | "prescription"
- content: string (text content or file name / extracted text)
- status: "draft" | "final" | "archived" (optional; default: "final")
- file_url: string (optional; if a file is uploaded separately)

Example request
```json
{
  "patient_id": "PT_20251129_795",
  "type": "text",
  "content": "Patient reports improved sleep and lower glucose readings.",
  "status": "final"
}
```

Success response (201 Created)
```json
{
  "success": true,
  "message": "Clinical note created",
  "data": {
    "note_id": "NOTE_20251129_001",
    "patient_id": "PT_20251129_795",
    "author": "Dr. Smith",
    "type": "text",
    "content": "Patient reports improved sleep and lower glucose readings.",
    "file_url": null,
    "status": "final",
    "created_at": "2025-11-29T12:00:00.000000"
  }
}
```

Validation error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "content": "Content is required",
    "type": "Invalid note type"
  }
}
```

---

3) Upload document (prescription) for a patient

Endpoint
```
POST /upload/
```
Request: multipart/form-data
Fields:
- patient_id: string (required)
- file: file (required)

Success response (200)
```json
{
  "document_id": "DOC001",
  "patient_id": "PT_20251129_795",
  "filename": "prescription.pdf",
  "file_url": "https://<your-backend>/media/DOC001/prescription.pdf",
  "file_type": "application/pdf",
  "upload_date": "2025-11-29T12:05:00.000000",
  "status": "success",
  "message": "File uploaded successfully"
}
```

Frontend flow for files:
- Upload file to `/upload/` multipart endpoint first.
- Use the returned `file_url` in the `file_url` field when creating the clinical note.

---

4) Status semantics
- draft: not finalized; editable
- final: finalized clinical note (recommended default for saves)
- archived: hidden/archived note

---

5) Security and validation notes
- Backend should validate that `patient_id` exists and matches the path parameter.
- Author/audit fields should be set server-side (author, timestamps).
- Enforce size/type limits for uploads and sanitize content.
- Return consistent error format as shown above.

---

6) Implementation tips for backend
- Use UUIDs or a stable note id format (`NOTE_{YYYYMMDD}_{nnn}`) for `note_id`.
- Store file metadata and serve files from a secure media URL.
- Consider pagination for large note lists.
- Consider audit logs and permissions (who can create/view notes).

---

Questions or changes:
- If your backend returns a different upload response shape, adjust the frontend `uploadPatientFile` parsing accordingly.
- If you prefer different status names, update both frontend enums and this doc.

