"use client"

import React from "react"
import {
  Activity,
  Heart,
  Droplet,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User,
  Pill,
  FileText,
} from "lucide-react"
import { PatientHeader } from "./PatientHeader"
import { VitalSignsGrid } from "./VitalSignsGrid"
import { HealthTrajectory } from "./HealthTrajectory"
import { MedicationsList } from "./MedicationsList"
import { AIInsights } from "./AIInsights"

const VisualEHRDashboard = () => {
  // Sample patient data
  const patientInfo = {
    name: "Sarah Johnson",
    age: 45,
    id: "MRN-78392",
    lastVisit: "Nov 15, 2024",
  }

  // Health trajectory data
  const healthData = [
    { date: "Jun", bp_sys: 128, bp_dia: 82, glucose: 105, weight: 165, hr: 72 },
    { date: "Jul", bp_sys: 132, bp_dia: 85, glucose: 110, weight: 163, hr: 75 },
    { date: "Aug", bp_sys: 125, bp_dia: 80, glucose: 98, weight: 161, hr: 70 },
    { date: "Sep", bp_sys: 130, bp_dia: 83, glucose: 102, weight: 159, hr: 73 },
    { date: "Oct", bp_sys: 122, bp_dia: 78, glucose: 95, weight: 158, hr: 68 },
    { date: "Nov", bp_sys: 120, bp_dia: 76, glucose: 92, weight: 156, hr: 67 },
  ]

  // AI Insights
  const aiInsights = [
    {
      type: "positive" as const,
      icon: TrendingDown,
      title: "Blood Pressure Improving",
      description:
        "Consistent downward trend over 6 months. Current readings within optimal range.",
      confidence: 94,
    },
    {
      type: "positive" as const,
      icon: CheckCircle,
      title: "Glucose Management Excellent",
      description:
        "Fasting glucose levels normalized. Lifestyle modifications showing strong results.",
      confidence: 91,
    },
    {
      type: "warning" as const,
      icon: AlertCircle,
      title: "Heart Rate Variability",
      description:
        "Consider stress management assessment. Slight irregularity detected in recent readings.",
      confidence: 76,
    },
    {
      type: "info" as const,
      icon: TrendingUp,
      title: "Weight Loss Progress",
      description:
        "Healthy weight reduction of 9 lbs over 6 months. On track with care plan goals.",
      confidence: 88,
    },
  ]

  // Vital signs summary
  const vitalSigns = [
    {
      label: "Blood Pressure",
      value: "120/76",
      unit: "mmHg",
      status: "good" as const,
      icon: Heart,
      color: "text-green-600",
    },
    {
      label: "Heart Rate",
      value: "67",
      unit: "bpm",
      status: "good" as const,
      icon: Activity,
      color: "text-green-600",
    },
    {
      label: "Blood Glucose",
      value: "92",
      unit: "mg/dL",
      status: "good" as const,
      icon: Droplet,
      color: "text-green-600",
    },
    {
      label: "Weight",
      value: "156",
      unit: "lbs",
      status: "improving" as const,
      icon: TrendingDown,
      color: "text-blue-600",
    },
  ]

  // Medications
  const medications = [
    { name: "Lisinopril", dose: "10mg", frequency: "Daily", status: "Active" },
    { name: "Metformin", dose: "500mg", frequency: "2x Daily", status: "Active" },
    { name: "Atorvastatin", dose: "20mg", frequency: "Evening", status: "Active" },
  ]

  // Health trajectory nodes
  const trajectoryNodes = [
    {
      id: 1,
      date: "Jun 2024",
      title: "Initial Consultation",
      type: "visit",
      status: "concern" as const,
      metrics: { bp: "128/82", glucose: "105", weight: "165" },
      notes: "Pre-diabetes diagnosis, elevated BP",
      icon: User,
    },
    {
      id: 2,
      date: "Jul 2024",
      title: "Started Medications",
      type: "medication",
      status: "neutral" as const,
      metrics: { bp: "132/85", glucose: "110", weight: "163" },
      notes: "Prescribed Lisinopril & Metformin",
      icon: Pill,
    },
    {
      id: 3,
      date: "Aug 2024",
      title: "Follow-up Lab Work",
      type: "lab",
      status: "improving" as const,
      metrics: { bp: "125/80", glucose: "98", weight: "161" },
      notes: "Glucose levels improving, weight down",
      icon: FileText,
    },
    {
      id: 4,
      date: "Sep 2024",
      title: "Lifestyle Check-in",
      type: "visit",
      status: "improving" as const,
      metrics: { bp: "130/83", glucose: "102", weight: "159" },
      notes: "Exercise routine established",
      icon: Activity,
    },
    {
      id: 5,
      date: "Oct 2024",
      title: "Quarterly Review",
      type: "lab",
      status: "good" as const,
      metrics: { bp: "122/78", glucose: "95", weight: "158" },
      notes: "All metrics within target range",
      icon: CheckCircle,
    },
    {
      id: 6,
      date: "Nov 2024",
      title: "Current Status",
      type: "current",
      status: "excellent" as const,
      metrics: { bp: "120/76", glucose: "92", weight: "156" },
      notes: "Treatment goals achieved",
      icon: Heart,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <PatientHeader
          patientInfo={patientInfo}
          onScheduleFollowUp={() => {
            // TODO: Implement schedule follow-up functionality
          }}
        />

        {/* Vital Signs Grid */}
        <VitalSignsGrid vitalSigns={vitalSigns} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Trajectory Chart */}
          <HealthTrajectory chartData={healthData} timelineNodes={trajectoryNodes} />

          {/* Medications */}
          <MedicationsList
            medications={medications}
            onAddMedication={() => {
              // TODO: Implement add medication functionality
            }}
          />
        </div>

        {/* AI Insights */}
        <AIInsights insights={aiInsights} lastUpdated="2 hours ago" />
      </div>
    </div>
  )
}

export default VisualEHRDashboard

