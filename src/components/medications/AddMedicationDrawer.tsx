import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerCloseButton } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMedicationDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (medication: any) => void
}

export function AddMedicationDrawer({ open, onOpenChange, onAdd }: AddMedicationDrawerProps) {
    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [frequency, setFrequency] = useState("")
    const [doctor, setDoctor] = useState("")

    const handleSubmit = () => {
        if (!name || !dosage) return

        onAdd({
            medication_id: `med-${Date.now()}`,
            name,
            dosage,
            frequency,
            prescribing_doctor: doctor || "Dr. S. Nair", // Default for demo
            prescribed_date: new Date().toISOString()
        })

        // Reset and close
        setName("")
        setDosage("")
        setFrequency("")
        setDoctor("")
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Medication</DrawerTitle>
                    <DrawerDescription>Prescribe a new medication for the patient.</DrawerDescription>
                    <DrawerCloseButton />
                </DrawerHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Medication Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amoxicillin" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dosage">Dosage</Label>
                            <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 500mg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="2x Daily">2x Daily</SelectItem>
                                    <SelectItem value="3x Daily">3x Daily</SelectItem>
                                    <SelectItem value="Nightly">Nightly</SelectItem>
                                    <SelectItem value="As needed">As needed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="doctor">Prescribing Doctor</Label>
                        <Select value={doctor} onValueChange={setDoctor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dr. S. Nair">Dr. S. Nair</SelectItem>
                                <SelectItem value="Dr. Ananya Rao">Dr. Ananya Rao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit}>Prescribe Medication</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
