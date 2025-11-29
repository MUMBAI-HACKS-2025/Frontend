import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerCloseButton } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScheduleAppointmentDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSchedule: (appointment: any) => void
}

export function ScheduleAppointmentDrawer({ open, onOpenChange, onSchedule }: ScheduleAppointmentDrawerProps) {
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [doctor, setDoctor] = useState("")
    const [type, setType] = useState("")
    const [reason, setReason] = useState("")

    const handleSubmit = () => {
        if (!date || !time || !doctor || !type) return

        const appointmentDateTime = `${date}T${time}:00Z`

        onSchedule({
            appointment_id: `apt-${Date.now()}`,
            date: appointmentDateTime,
            doctor,
            type,
            reason: reason || "Routine visit"
        })

        // Reset and close
        setDate("")
        setTime("")
        setDoctor("")
        setType("")
        setReason("")
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Schedule Appointment</DrawerTitle>
                    <DrawerDescription>Book a new appointment for the patient.</DrawerDescription>
                    <DrawerCloseButton />
                </DrawerHeader>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="doctor">Doctor</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="type">Appointment Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Check-up">Check-up</SelectItem>
                                <SelectItem value="Follow-up">Follow-up</SelectItem>
                                <SelectItem value="Lab Review">Lab Review</SelectItem>
                                <SelectItem value="Consultation">Consultation</SelectItem>
                                <SelectItem value="Vaccination">Vaccination</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Brief reason for visit..."
                            rows={3}
                            className="resize-none"
                        />
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit}>Schedule Appointment</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
