import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
} from "@/components/ui/drawer"
import { getEvents, addEvent, deleteEvent, getEventsByDate, initializeSampleData } from "@/lib/storage"
import { CalendarEvent } from "@/lib/storageTypes"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 29))
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "appointment" as "appointment" | "task" | "reminder",
    time: "",
    notes: "",
  })

  // Load events from localStorage on mount
  useEffect(() => {
    // Initialize sample data if no events exist
    const existingEvents = getEvents()
    if (existingEvents.length === 0) {
      initializeSampleData()
    }
    setEvents(getEvents())
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(dateStr)
    setIsDrawerOpen(true)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !selectedDate) {
      alert("Please fill in all required fields")
      return
    }

    const newEvent = addEvent({
      date: selectedDate,
      time: formData.time || undefined,
      title: formData.title,
      type: formData.type,
      notes: formData.notes || undefined,
      status: "scheduled",
    })

    setEvents((prev) => [...prev, newEvent])
    setFormData({
      title: "",
      type: "appointment",
      time: "",
      notes: "",
    })
    setIsDrawerOpen(false)
  }

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const getEventsForDate = (dateStr: string) => {
    return getEventsByDate(dateStr)
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  // Calendar grid generation
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = []

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your appointments and tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return (
                    <div key={`empty-${idx}`} className="aspect-square bg-gray-50 rounded-lg" />
                  )
                }

                const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayEvents = getEventsForDate(dateStr)
                const isToday =
                  new Date().toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square p-2 rounded-lg border-2 cursor-pointer transition ${
                      isToday
                        ? "border-blue-500 bg-blue-50"
                        : dayEvents.length > 0
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-800">{day}</div>
                    {dayEvents.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">{dayEvents.length} event(s)</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Upcoming Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming</h3>

            {events.length === 0 ? (
              <p className="text-gray-600 text-sm">No events scheduled</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        event.type === "appointment"
                          ? "bg-blue-50 border-blue-500"
                          : "bg-yellow-50 border-yellow-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {event.date}
                            {event.time && ` at ${event.time}`}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
              onClick={() => {
                setSelectedDate(formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
                setIsDrawerOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Add Event Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Event</DrawerTitle>
            <DrawerDescription>
              {selectedDate && `Date: ${selectedDate}`}
            </DrawerDescription>
            <DrawerCloseButton />
          </DrawerHeader>

          <form onSubmit={handleAddEvent} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Patient Appointment, Lab Review"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type">Event Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as "appointment" | "task",
                    }))
                  }
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="appointment">Appointment</option>
                  <option value="task">Task</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <Label htmlFor="time">Time (Optional)</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="notes">Description (Optional)</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add notes or details..."
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </form>

          <DrawerFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!formData.title}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Event
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
