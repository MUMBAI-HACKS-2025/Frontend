import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerCloseButton } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditMedicationDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    medication: any
    onSave: (medication: any) => void
}

export function EditMedicationDrawer({ open, onOpenChange, medication, onSave }: EditMedicationDrawerProps) {
    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [frequency, setFrequency] = useState("")
    const [doctor, setDoctor] = useState("")

    useEffect(() => {
        if (medication) {
            setName(medication.name)
            setDosage(medication.dosage)
            setFrequency(medication.frequency)
            setDoctor(medication.prescribing_doctor)
        }
    }, [medication])

    const handleSubmit = () => {
        if (!name || !dosage) return

        onSave({
            ...medication,
            name,
            dosage,
            frequency,
            prescribing_doctor: doctor
        })

        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit Medication</DrawerTitle>
                    <DrawerDescription>Update prescription details.</DrawerDescription>
                    <DrawerCloseButton />
                </DrawerHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Medication Name</Label>
                        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-dosage">Dosage</Label>
                            <Input id="edit-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-frequency">Frequency</Label>
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
                        <Label htmlFor="edit-doctor">Prescribing Doctor</Label>
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
                    <Button onClick={handleSubmit}>Save Changes</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
