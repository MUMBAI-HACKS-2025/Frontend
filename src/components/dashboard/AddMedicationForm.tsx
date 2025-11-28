import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
} from "@/components/ui/drawer"
import { Pill } from "lucide-react"

export interface Medication {
  name: string
  dose: string
  frequency: string
  status: string
}

// Fixed enums for form fields
export const FREQUENCY_OPTIONS = [
  { value: "Once Daily", label: "Once Daily" },
  { value: "Twice Daily", label: "Twice Daily (2x Daily)" },
  { value: "Three Times Daily", label: "Three Times Daily (3x Daily)" },
  { value: "Four Times Daily", label: "Four Times Daily (4x Daily)" },
  { value: "Every 12 Hours", label: "Every 12 Hours" },
  { value: "Every 8 Hours", label: "Every 8 Hours" },
  { value: "Every 6 Hours", label: "Every 6 Hours" },
  { value: "Every 4 Hours", label: "Every 4 Hours" },
  { value: "As Needed", label: "As Needed (PRN)" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "With Meals", label: "With Meals" },
  { value: "Before Meals", label: "Before Meals" },
  { value: "After Meals", label: "After Meals" },
  { value: "At Bedtime", label: "At Bedtime" },
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
] as const

export const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Discontinued", label: "Discontinued" },
  { value: "On Hold", label: "On Hold" },
] as const

export const DOSE_UNITS = [
  { value: "mg", label: "mg (milligrams)" },
  { value: "g", label: "g (grams)" },
  { value: "mcg", label: "mcg (micrograms)" },
  { value: "ml", label: "ml (milliliters)" },
  { value: "units", label: "units" },
  { value: "tablets", label: "tablets" },
  { value: "capsules", label: "capsules" },
] as const

interface AddMedicationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMedication: (medication: Medication) => void
  onUpdateMedication?: (index: number, medication: Medication) => void
  medicationToEdit?: Medication | null
  editIndex?: number | null
}

export function AddMedicationForm({
  open,
  onOpenChange,
  onAddMedication,
  onUpdateMedication,
  medicationToEdit,
  editIndex,
}: AddMedicationFormProps) {
  const isEditMode = medicationToEdit !== null && medicationToEdit !== undefined && editIndex !== null && editIndex !== undefined

  const [formData, setFormData] = useState<Medication>({
    name: "",
    dose: "",
    frequency: "",
    status: "Active",
  })
  const [doseValue, setDoseValue] = useState("")
  const [doseUnit, setDoseUnit] = useState("mg")
  const [errors, setErrors] = useState<Partial<Record<keyof Medication, string>>>({})

  // Parse dose string to extract value and unit
  const parseDose = (dose: string): { value: string; unit: string } => {
    if (!dose) return { value: "", unit: "mg" }
    
    // Try to match patterns like "10mg", "5.5ml", "100units", etc.
    const match = dose.match(/^([\d.]+)([a-zA-Z]+)$/)
    if (match) {
      return { value: match[1], unit: match[2] }
    }
    
    // If no unit found, assume it's just a number
    const numMatch = dose.match(/^([\d.]+)/)
    if (numMatch) {
      return { value: numMatch[1], unit: "mg" }
    }
    
    return { value: "", unit: "mg" }
  }

  // Load medication data when editing
  useEffect(() => {
    if (open && isEditMode && medicationToEdit) {
      setFormData(medicationToEdit)
      const parsed = parseDose(medicationToEdit.dose)
      setDoseValue(parsed.value)
      setDoseUnit(parsed.unit)
    } else if (!open) {
      // Reset form when drawer closes
      setFormData({
        name: "",
        dose: "",
        frequency: "",
        status: "Active",
      })
      setDoseValue("")
      setDoseUnit("mg")
      setErrors({})
    }
  }, [open, isEditMode, medicationToEdit])

  // Auto-format dose with unit
  useEffect(() => {
    if (doseValue && doseUnit) {
      setFormData((prev) => ({
        ...prev,
        dose: `${doseValue}${doseUnit}`,
      }))
    } else {
      setFormData((prev) => ({ ...prev, dose: "" }))
    }
  }, [doseValue, doseUnit])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Medication, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Medication name is required"
    }

    if (!doseValue.trim()) {
      newErrors.dose = "Dose value is required"
    } else if (isNaN(Number(doseValue)) || Number(doseValue) <= 0) {
      newErrors.dose = "Dose must be a valid positive number"
    }

    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (isEditMode && onUpdateMedication && editIndex !== null && editIndex !== undefined) {
        onUpdateMedication(editIndex, formData)
      } else {
        onAddMedication(formData)
      }
      onOpenChange(false)
    }
  }

  const handleChange = (
    field: keyof Medication,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDoseValueChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")
    setDoseValue(numericValue)
    if (errors.dose) {
      setErrors((prev) => ({ ...prev, dose: undefined }))
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <DrawerTitle>{isEditMode ? "Edit Medication" : "Add New Medication"}</DrawerTitle>
          </div>
          <DrawerDescription>
            {isEditMode
              ? "Update the medication details in the patient's record."
              : "Enter the medication details to add it to the patient's record."}
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Lisinopril"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dose">Dose *</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="dose"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 10"
                      value={doseValue}
                      onChange={(e) => handleDoseValueChange(e.target.value)}
                      className={errors.dose ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="w-40">
                    <Select
                      id="doseUnit"
                      value={doseUnit}
                      onChange={(e) => setDoseUnit(e.target.value)}
                    >
                      {DOSE_UNITS.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {errors.dose && (
                  <p className="text-sm text-red-500">{errors.dose}</p>
                )}
                {doseValue && doseUnit && !errors.dose && (
                  <p className="text-sm text-muted-foreground">
                    Dose: {doseValue}{doseUnit}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                  className={errors.frequency ? "border-red-500" : ""}
                >
                  <option value="">Select frequency</option>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.frequency && (
                  <p className="text-sm text-red-500">{errors.frequency}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!formData.name || !doseValue || !formData.frequency}
              >
                {isEditMode ? "Update Medication" : "Add Medication"}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

