# Patient Details API Integration

## Overview
This document describes the successful integration of the Patient Details API endpoint in the MedIQ application.

## API Endpoint

### Get Patient Details
```
GET /api/v1/patients/{patient_id}/details/
```

**Base URL:** `https://3d4c09013fe8.ngrok-free.app/api/v1`

**Example Request:**
```bash
curl -X 'GET' \
  'https://3d4c09013fe8.ngrok-free.app/api/v1/patients/PT_20251129_795/details/' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true'
```

## Response Structure

The API returns a comprehensive patient details object with the following structure:

```typescript
{
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
    allergies: Array<{...}>
    chronic_conditions: Array<{...}>
    current_medications: Array<{...}>
  }
  vital_signs: {
    last_recorded: string | null
    blood_pressure: {...} | null
    heart_rate: {...} | null
    temperature: {...} | null
    oxygen_saturation: {...} | null
    // ... other vitals
  }
  health_trajectory: {
    current_status: string
    risk_level: string
    predicted_trajectory: string
    last_assessment_date: string | null
    key_metrics: Record<string, string | number | null>
  }
  appointments: {
    upcoming: Array<{...}>
    past: Array<{...}>
  }
  insurance_info: {
    provider: string | null
    policy_number: string | null
    // ... other insurance fields
  }
  // ... other fields
}
```

## Implementation

### 1. API Service (`src/lib/api.ts`)

**Interface Definition:**
```typescript
export interface ApiPatientDetailResponse {
  // See complete interface in api.ts
}
```

**Fetch Function:**
```typescript
export async function fetchPatientDetails(patientId: string): Promise<ApiPatientDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}/details/`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  })
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Patient not found: ${patientId}`)
    }
    throw new Error(`Failed to fetch patient details: ${response.statusText}`)
  }
  
  return await response.json()
}
```

### 2. HomePage Navigation (`src/pages/HomePage.tsx`)

**Patient Card Click Handler:**
```typescript
const handlePatientClick = (patientId: string) => {
  navigate(`/patients/${patientId}`)
}
```

Patient cards are now clickable and navigate to the detail page:
```tsx
<div onClick={() => handlePatientClick(patient.patient_id)} className="cursor-pointer">
  {/* Patient card content */}
</div>
```

### 3. Patient Detail Page (`src/pages/PatientDetail.tsx`)

**Data Fetching:**
```typescript
useEffect(() => {
  const loadPatientDetails = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const data = await fetchPatientDetails(id)
      setPatient(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  loadPatientDetails()
}, [id])
```

**Null Safety:**
All nullable fields are properly handled with conditional rendering:
- Vital signs show "No vital signs recorded yet" if empty
- Medications show "No current medications" if empty
- Contact info shows "Not provided" for null values
- Insurance shows "No insurance information available" if empty

## Features

### ✅ Implemented Features

1. **Navigation Flow**
   - Click on any patient card in HomePage
   - Automatically navigates to `/patients/{patient_id}`
   - Fetches detailed patient information

2. **Loading States**
   - Spinner animation during data fetch
   - Loading message displayed

3. **Error Handling**
   - 404 errors for non-existent patients
   - Network error handling
   - User-friendly error messages
   - "Back to Home" button on error

4. **Null Safety**
   - All nullable fields handled gracefully
   - Empty states for missing data
   - Conditional rendering for optional sections

5. **Data Display Sections**
   - Personal Information
   - Contact Details
   - Vital Signs (with visual cards)
   - Current Medications
   - Chronic Conditions
   - Allergies
   - Upcoming Appointments
   - Insurance Information
   - Health Risk Assessment

## Testing

### Test the Integration:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to HomePage:**
   - Open `http://localhost:5175/`
   - View the "Active Patients" section

3. **Click on a patient card:**
   - Click on any patient (e.g., "John Doe - PT_20251129_795")
   - Should navigate to `/patients/PT_20251129_795`

4. **Verify the detail page:**
   - Check loading state appears briefly
   - Verify all patient information displays correctly
   - Check for proper handling of null/missing data

### Sample API Response (Current Data):
```json
{
  "patient_id": "PT_20251129_795",
  "personal_info": {
    "name": "John Doe",
    "age": 45,
    "sex": "M",
    "phone": "+1-234-567-8900",
    "city": "New York"
  },
  "health_trajectory": {
    "current_status": "Unknown",
    "risk_level": "Unknown"
  }
}
```

## Notes

### Important Headers

When making requests to ngrok URLs, always include:
```typescript
'ngrok-skip-browser-warning': 'true'
```

This header bypasses ngrok's browser warning page and allows API calls to work correctly.

### URL Pattern

- Patient List: `/` (HomePage)
- Patient Detail: `/patients/:id` (PatientDetailPage)

### State Management

- Patient data is fetched fresh on each page load
- No caching implemented (can be added later)
- Error states preserved until page reload

## Future Enhancements

1. **Add patient data caching** to reduce API calls
2. **Implement real-time updates** for vital signs
3. **Add edit functionality** for patient information
4. **File upload integration** for medical documents
5. **Appointment scheduling** directly from detail page
6. **Print/Export patient records** functionality

## Troubleshooting

### Common Issues:

1. **"No patient found" error:**
   - Verify patient_id exists in backend
   - Check API endpoint URL is correct
   - Ensure ngrok tunnel is active

2. **CORS errors:**
   - Backend should have proper CORS headers
   - Check `access-control-allow-origin: *` in response

3. **Loading forever:**
   - Check network tab in browser DevTools
   - Verify API endpoint is responding
   - Check console for errors

## API Contract for Backend

See `API_CONTRACT.md` for the complete API specification that should be implemented by the backend team.
