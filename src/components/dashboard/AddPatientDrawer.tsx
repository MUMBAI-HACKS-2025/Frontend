import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
} from "@/components/ui/drawer"
import { PatientCardData } from "./PatientCard"

interface AddPatientDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (patient: PatientCardData) => void
}

export function AddPatientDrawer({ open, onOpenChange, onAddPatient }: AddPatientDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "" as "M" | "F" | "Other" | "",
    phone: "",
    city: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateMRN = () => {
    return `MRN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  }

  const generatePatientID = () => {
    return String(Math.floor(Math.random() * 100000) + 1).padStart(3, "0")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.age || !formData.gender) {
      alert("Please fill in all required fields")
      return
    }

    const newPatient: PatientCardData = {
      id: generatePatientID(),
      name: formData.name,
      age: parseInt(formData.age),
      sex: formData.gender,
      mrn: generateMRN(),
      phone: formData.phone || undefined,
      city: formData.city || undefined,
      lastVisit: undefined, // New patient has no last visit
      status: "new", // Status is 'new' for new patients
      vitals: undefined,
      medsCount: 0,
      lastNoteSnippet: undefined,
    }

    onAddPatient(newPatient)
    setFormData({
      name: "",
      age: "",
      gender: "",
      phone: "",
      city: "",
    })
    onOpenChange(false)
  }

  const isFormValid = formData.name && formData.age && formData.gender

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Patient</DrawerTitle>
          <DrawerDescription>
            Fill in the patient information below.
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter patient name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* Age */}
            <div>
              <Label htmlFor="age">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter phone number (optional)"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city (optional)"
                value={formData.city}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Welcome to the patient registry. Once added, this patient will appear in your patient list and you can start managing their health records.
              </p>
            </div>
          </div>
        </form>

        <DrawerFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Patient
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
