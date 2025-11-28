import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"
import { PatientGrid } from "@/pages/Dashboard"
import { PatientDetailPage } from "@/pages/PatientDetail"
import { CalendarView } from "@/pages/CalendarView"
import { ClinicalNotes } from "@/pages/ClinicalNotesPage"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/patients" element={<PatientGrid />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/appointments" element={<CalendarView />} />
          <Route path="/clinical-notes" element={<ClinicalNotes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

