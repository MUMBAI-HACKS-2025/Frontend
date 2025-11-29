import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerCloseButton } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddClinicalNoteDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (note: any) => void
}

export function AddClinicalNoteDrawer({ open, onOpenChange, onAdd }: AddClinicalNoteDrawerProps) {
    const [type, setType] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("")

    const handleSubmit = () => {
        if (!content || !type) return

        onAdd({
            note_id: `note-${Date.now()}`,
            date: new Date().toISOString(),
            author: author || "Dr. S. Nair",
            type,
            content
        })

        // Reset and close
        setType("")
        setContent("")
        setAuthor("")
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Clinical Note</DrawerTitle>
                    <DrawerDescription>Document patient observations and treatment notes.</DrawerDescription>
                    <DrawerCloseButton />
                </DrawerHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="note-type">Note Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="progress">Progress Note</SelectItem>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="physical">Physical Exam</SelectItem>
                                <SelectItem value="procedure">Procedure Note</SelectItem>
                                <SelectItem value="discharge">Discharge Summary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Select value={author} onValueChange={setAuthor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select author" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dr. S. Nair">Dr. S. Nair</SelectItem>
                                <SelectItem value="Dr. Ananya Rao">Dr. Ananya Rao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Note Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter clinical observations, treatment plan, or other relevant notes..."
                            rows={8}
                            className="resize-none"
                        />
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit}>Save Note</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
