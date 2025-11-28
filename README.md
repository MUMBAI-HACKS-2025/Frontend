# MedIQ - Electronic Health Records Dashboard

A modern, modular EHR dashboard built with React, TypeScript, Vite, and shadcn/ui.

## Features

- **Modular Component Architecture**: Broken down into reusable, maintainable components
- **shadcn/ui Integration**: Consistent UI components using shadcn/ui
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first, responsive layout
- **Health Trajectory Visualization**: Interactive charts and timeline views
- **AI-Powered Insights**: Intelligent health analytics and recommendations

## Project Structure

```
MedIQ/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── PatientHeader.tsx
│   │   │   ├── VitalSignsCard.tsx
│   │   │   ├── VitalSignsGrid.tsx
│   │   │   ├── HealthTrajectory.tsx
│   │   │   ├── HealthTrajectoryChart.tsx
│   │   │   ├── HealthTrajectoryTimeline.tsx
│   │   │   ├── MedicationsList.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   └── VisualEHRDashboard.tsx
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── button.tsx
│   │       ├── badge.tsx
│   │       └── tabs.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
└── vite.config.ts
```

## Components

### Dashboard Components

- **PatientHeader**: Patient information and quick actions
- **VitalSignsGrid**: Grid of vital sign cards
- **VitalSignsCard**: Individual vital sign display card
- **HealthTrajectory**: Main health trajectory container with chart/timeline views
- **HealthTrajectoryChart**: Area chart visualization of health metrics
- **HealthTrajectoryTimeline**: Timeline view of health events
- **MedicationsList**: Current medications display
- **AIInsights**: AI-powered health insights and recommendations

### UI Components (shadcn/ui)

- **Card**: Container component
- **Button**: Button component with variants
- **Badge**: Status badge component
- **Tabs**: Tab navigation component

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`

## Build

```bash
npm run build
```

This creates a production build in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Dependencies

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts (for data visualization)
- Lucide React (for icons)

## Usage

The main dashboard component is already set up in `src/App.tsx`. You can import and use individual components:

```tsx
import { PatientHeader, VitalSignsGrid } from "@/components/dashboard"

function MyComponent() {
  return (
    <>
      <PatientHeader patientInfo={...} />
      <VitalSignsGrid vitalSigns={...} />
    </>
  )
}
```

## Path Aliases

The project uses `@/` as an alias for the `src/` directory, configured in both `vite.config.ts` and `tsconfig.json`.
