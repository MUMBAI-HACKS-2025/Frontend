import { useState, useRef, useEffect } from "react"
import { transcribeWithDeepgram } from "../../../lib/deepgram"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Mic, MicOff, Loader2, Eye, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ClinicalNote {
  type: "text" | "voice" | "prescription"
  content: string
  file?: File | null
  timestamp: string
}

interface ClinicalNotesFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveNote: (note: ClinicalNote) => void
}

export function ClinicalNotesForm({
  open,
  onOpenChange,
  onSaveNote,
}: ClinicalNotesFormProps) {
  const [activeTab, setActiveTab] = useState<"write" | "voice" | "upload">("write")
  const [textNote, setTextNote] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewNote, setPreviewNote] = useState<ClinicalNote | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Clean up MediaRecorder on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      setTextNote("")
      setTranscript("")
      setUploadedFile(null)
      setFileName("")
      setIsRecording(false)
      setActiveTab("write")
      setShowPreview(false)
      setPreviewNote(null)
    }
  }, [open])

  const handleStartRecording = async () => {
    setTranscript("")
    setIsRecording(true)
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mediaRecorder = new MediaRecorder(stream)
  mediaRecorderRef.current = mediaRecorder
  mediaStreamRef.current = stream

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release microphone permission
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop())
          mediaStreamRef.current = null
        }
        setIsRecording(false)
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        try {
          setTranscript("Transcribing...")
          const result = await transcribeWithDeepgram(audioBlob)
          setTranscript(result)
        } catch (err) {
          setTranscript("")
          alert("Transcription failed. Please try again.")
        }
      }

      mediaRecorder.start()
    } catch (err) {
      setIsRecording(false)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      // Also ensure stream tracks are stopped in case onstop isn't reached
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setFileName(file.name)
    }
  }

  const prepareNote = (): ClinicalNote | null => {
    if (activeTab === "write" && textNote.trim()) {
      return {
        type: "text",
        content: textNote,
        timestamp: new Date().toISOString(),
      }
    } else if (activeTab === "voice" && transcript.trim()) {
      return {
        type: "voice",
        content: transcript,
        timestamp: new Date().toISOString(),
      }
    } else if (activeTab === "upload" && uploadedFile) {
      return {
        type: "prescription",
        content: fileName,
        file: uploadedFile,
        timestamp: new Date().toISOString(),
      }
    }
    return null
  }

  const handlePreview = () => {
    const note = prepareNote()
    if (note) {
      setPreviewNote(note)
      setShowPreview(true)
    }
  }

  const handleConfirmSave = () => {
    const note = previewNote || prepareNote()
    if (note) {
      // Log the note (later will send to API)
      console.log("Clinical Note Saved:", {
        type: note.type,
        content: note.content,
        file: note.file ? { 
          name: note.file.name, 
          size: note.file.size, 
          type: note.file.type 
        } : null,
        timestamp: note.timestamp,
      })

      onSaveNote(note)
      onOpenChange(false)
    }
  }

  const formatPreviewText = (note: ClinicalNote): string => {
    const date = new Date(note.timestamp).toLocaleString()
    let preview = `Type: ${note.type.charAt(0).toUpperCase() + note.type.slice(1)}\n`
    preview += `Date: ${date}\n`
    preview += `\n---\n\n`

    if (note.type === "prescription" && note.file) {
      preview += `File: ${note.content}\n`
      preview += `File Size: ${(note.file.size / 1024).toFixed(2)} KB\n`
      preview += `File Type: ${note.file.type}\n`
      preview += `\n---\n\n`
      preview += `[Prescription file uploaded: ${note.content}]\n`
      preview += `Note: File content will be processed and extracted.`
    } else {
      preview += `${note.content}`
    }

    return preview
  }

  const canSave = () => {
    if (activeTab === "write") return textNote.trim().length > 0
    if (activeTab === "voice") return transcript.trim().length > 0
    if (activeTab === "upload") return uploadedFile !== null
    return false
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <DrawerTitle>
              {showPreview ? "Preview Clinical Note" : "Add Clinical Notes"}
            </DrawerTitle>
          </div>
          <DrawerDescription>
            {showPreview
              ? "Review your clinical note before saving."
              : "Add clinical notes by writing, speaking, or uploading a prescription."}
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {showPreview && previewNote ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                      {formatPreviewText(previewNote)}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPreview(false)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Edit
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={handleConfirmSave}
                    >
                      Confirm & Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter clinical notes here..."
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-sm text-muted-foreground">
                  {textNote.length} characters
                </p>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      type="button"
                      onClick={handleStartRecording}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleStopRecording}
                      variant="destructive"
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <MicOff className="w-5 h-5" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="transcript">Transcription</Label>
                  <Textarea
                    id="transcript"
                    placeholder="Your transcribed notes will appear here..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="min-h-[300px]"
                    readOnly={isRecording}
                  />
                  <p className="text-sm text-muted-foreground">
                    {transcript.length} characters
                  </p>
                </div>

                {!isRecording && transcript && (
                  <p className="text-sm text-muted-foreground">
                    You can edit the transcription before saving.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Prescription, PDF, or image files
                  </p>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {uploadedFile && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{fileName}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null)
                          setFileName("")
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>

        {!showPreview && (
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
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handlePreview}
                disabled={!canSave() || isRecording}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleConfirmSave}
                disabled={!canSave() || isRecording}
              >
                Save Note
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

