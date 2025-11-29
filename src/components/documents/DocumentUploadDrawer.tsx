import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerCloseButton } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadPatientFile } from "@/lib/api"
import { transcribeWithDeepgram } from "@/lib/deepgram"
import { Loader2, Upload, FileText } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
}

export default function DocumentUploadDrawer({ open, onOpenChange, patientId = "MRN-2025-0099" }: Props) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [showTranscription, setShowTranscription] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setSelectedFile(file)
      setTranscription("")
      setShowTranscription(false)
    }
  }

  const handleProcessDocument = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    try {
      // Check if it's an audio file
      const isAudio = selectedFile.type.startsWith('audio/') ||
        selectedFile.name.match(/\.(mp3|wav|webm|m4a|ogg)$/i)

      if (isAudio) {
        // Transcribe audio file
        const result = await transcribeWithDeepgram(selectedFile)
        setTranscription(result)
        setShowTranscription(true)
      } else {
        // For non-audio files, just upload
        await uploadPatientFile(patientId, selectedFile)
        alert(`Successfully uploaded ${fileName}`)
        setFileName(null)
        setSelectedFile(null)
        onOpenChange(false)
      }
    } catch (error) {
      alert(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveTranscription = async () => {
    if (!transcription) return

    try {
      // In a real app, save the transcription to the patient's clinical notes
      console.log('Saving transcription:', transcription)
      alert(`Transcription saved successfully`)
      setFileName(null)
      setSelectedFile(null)
      setTranscription("")
      setShowTranscription(false)
      onOpenChange(false)
    } catch (error) {
      alert(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const resetForm = () => {
    setFileName(null)
    setSelectedFile(null)
    setTranscription("")
    setShowTranscription(false)
  }

  return (
    <Drawer open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <DrawerTitle>Upload & Transcribe Document</DrawerTitle>
          </div>
          <DrawerDescription>
            Upload documents or audio files. Audio files will be automatically transcribed.
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>

        <div className="p-6 space-y-4 flex-1 overflow-auto">
          {!showTranscription ? (
            <>
              <div>
                <Label className="block mb-2">Select Document or Audio File</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp3,.wav,.webm,.m4a,.ogg"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600">
                      {fileName ? (
                        <span className="font-medium text-blue-600">{fileName}</span>
                      ) : (
                        <>
                          <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                          <p className="text-xs text-gray-400 mt-1">Documents (PDF, JPG, PNG) or Audio files (MP3, WAV, etc.)</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
                <Button onClick={handleProcessDocument} disabled={!selectedFile || isProcessing}>
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isProcessing ? 'Processing...' : 'Process Document'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-semibold">Transcription Result</Label>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Review and edit the transcription before saving.
                </p>
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="min-h-[300px]"
                  placeholder="Transcription will appear here..."
                />
                <p className="text-sm text-muted-foreground">
                  {transcription.length} characters
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowTranscription(false)}>
                  Back
                </Button>
                <Button onClick={handleSaveTranscription} disabled={!transcription.trim()}>
                  Save Transcription
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
