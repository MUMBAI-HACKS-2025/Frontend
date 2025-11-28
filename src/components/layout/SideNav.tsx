import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react"

export function SideNav() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: FileText, label: "Clinical Notes", path: "/clinical-notes" },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-white text-blue-600 rounded-lg p-2 font-bold">
                MQ
              </div>
              <span className="font-bold text-lg">MedIQ</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-blue-500 rounded transition"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isOpen && (
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  )}
                  {isOpen && active && (
                    <ChevronRight size={16} className="text-blue-600" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-blue-500">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-500 transition">
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content area - children passed via layout */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Content injected here */}
      </div>
    </div>
  )
}
