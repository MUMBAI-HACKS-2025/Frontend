# MedIQ - Static Doctor-Facing Demo

A fully static, doctor-facing demo of the MedIQ product, built with React, TypeScript, Vite, and shadcn/ui. This demo showcases a unified EHR view, automated document ingestion, annotation workbench, and AI-powered insights without requiring a backend.

## Features

- **Unified Patient View**: Comprehensive dashboard showing patient vitals, medications, and history.
- **Static Data Mode**: All data is driven by a realistic static patient object (`src/data/staticPatient.ts`), ensuring reliable demo performance without API dependencies.
- **Document Management**: Static UI for uploading, listing, and viewing patient documents.
- **Annotation Workbench**: Interactive demo for labeling and redacting clinical notes (local interactions).
- **Unified EHR Inspector**: JSON viewer to inspect the underlying unified patient data model.
- **Medication Management**: List and edit medications with local state interactions.
- **Health Trajectory**: Visual charts and timelines for patient health trends.
- **AI Insights & Health Score**: Demo of AI-driven health scoring and actionable insights.
- **Patient Marketplace**: Placeholder for recommended products and services.

## Project Structure

```
MedIQ/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard widgets (Vitals, Trajectory, AI Insights)
│   │   ├── documents/       # Document upload and list
│   │   ├── annotation/      # Annotation workbench
│   │   ├── ehr/             # JSON Inspector
│   │   ├── health/          # Health Score card
│   │   ├── market/          # Marketplace placeholder
│   │   ├── medications/     # Medication list and edit
│   │   └── ui/              # shadcn/ui components
│   ├── data/
│   │   └── staticPatient.ts # Static patient data for the demo
│   ├── pages/
│   │   ├── HomePage.tsx     # Patient list (static)
│   │   └── PatientDetail.tsx # Main demo page
│   ├── lib/
│   │   └── ai.ts            # Utility for local AI endpoint (optional)
│   └── App.tsx
└── README.md
```

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Demo Instructions

- **Navigation**: Click on any patient in the "Active Patients" list on the home page to view the detailed static demo for "Rohit Sharma".
- **Interactions**: Most buttons (Save, Upload, Edit) will trigger a browser alert or update local component state to demonstrate functionality.
- **AI Integration**: The app is configured to optionally use a local OpenAI-compatible endpoint at `http://localhost:8000/api/v1/openai` for dynamic insights if available.

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React Icons
- Recharts
