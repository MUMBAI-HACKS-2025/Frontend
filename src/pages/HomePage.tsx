import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, FileText, Users, Clock, Bell, Plus, Activity, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTodayEvents } from "@/lib/storage"
import { CalendarEvent } from "@/lib/storageTypes"
import { ApiPatientResponse } from "@/lib/api"
import { staticPatientsList } from "@/data/staticPatient"

export function HomePage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingTasks: 0,
    activePatients: 0,
    avgWaitTime: "15m",
  })
  const [todayAppointments, setTodayAppointments] = useState<CalendarEvent[]>([])
  const [patients, setPatients] = useState<ApiPatientResponse[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  // Load data from localStorage and API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingPatients(true)
        setApiError(null)

        // Use static patients for demo
        // const apiPatients = await fetchPatients()
        const apiPatients = staticPatientsList as unknown as ApiPatientResponse[]
        setPatients(apiPatients)

        const activePatients = apiPatients.length

        // Get today's appointments from localStorage (calendar remains local)
        const todayEvents = getTodayEvents()
        const appointments = todayEvents.filter((e) => e.type === "appointment")
        const tasks = todayEvents.filter((e) => e.type === "task" && e.status === "scheduled")

        setStats({
          todayAppointments: appointments.length,
          pendingTasks: tasks.length,
          activePatients,
          avgWaitTime: "15m",
        })

        setTodayAppointments(appointments.slice(0, 5))
      } catch (apiError) {
        console.error('Failed to fetch patients from API:', apiError)
        setApiError(apiError instanceof Error ? apiError.message : String(apiError))
        setPatients([])
        setStats((s) => ({ ...s, activePatients: 0 }))
        setTodayAppointments([])
      } finally {
        setIsLoadingPatients(false)
      }
    }

    loadData()
  }, [])

  const displayStats = [
    { label: "Today's Appointments", value: stats.todayAppointments.toString(), icon: Calendar, color: "bg-blue-500" },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: FileText, color: "bg-orange-500" },
    { label: "Active Patients", value: stats.activePatients.toString(), icon: Users, color: "bg-green-500" },
    { label: "Avg Wait Time", value: stats.avgWaitTime, icon: Clock, color: "bg-purple-500" },
  ]

  const alerts = [
    {
      id: 1,
      type: "urgent",
      message: "Critical lab result for John Smith - Immediate attention required",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "info",
      message: "New prescription request from pharmacy for Sarah Johnson",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "warning",
      message: "Annual physical due for 5 patients this week",
      time: "2 hours ago",
    },
  ]

  const formatTime = (time?: string) => {
    if (!time) return "All Day"
    // Convert HH:mm to 12-hour format
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayHour = h % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Good Morning, Dr. Smith</h1>
          <p className="text-gray-600">Saturday, November 29, 2025</p>

          {/* Loading and Error States */}
          {isLoadingPatients && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">Loading patient data from server...</p>
            </div>
          )}
          {apiError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">{apiError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center space-x-4 hover:shadow-md transition">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {todayAppointments.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No appointments scheduled for today</p>
              ) : (
                todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold text-gray-800">{formatTime(apt.time)}</p>
                      </div>
                      <div className="h-12 w-px bg-gray-300"></div>
                      <div>
                        <p className="font-semibold text-gray-800">{apt.patientName || apt.title || 'Appointment'}</p>
                        <p className="text-sm text-gray-600">{apt.notes || 'No notes'}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : apt.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Alerts
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${alert.type === "urgent"
                      ? "bg-red-50 border-red-500"
                      : alert.type === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                      }`}
                  >
                    <p className="text-sm text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
                <Button className="w-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
                <Button className="w-full bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center">
                  <Activity className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Active Patients ({patients.length})
            </h2>
          </div>
          <div className="p-6">
            {isLoadingPatients ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 mt-2">Loading patients...</p>
              </div>
            ) : patients.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No patients found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient) => (
                  <div
                    key={patient.patient_id}
                    onClick={() => handlePatientClick(patient.patient_id)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{patient.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{patient.patient_id}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {patient.sex}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Age: {patient.age} years</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{patient.city}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Added: {new Date(patient.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
