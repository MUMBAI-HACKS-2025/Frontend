import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, File } from "lucide-react"

interface Document {
  document_id: string
  type: string
  name: string
  date: string
  url: string
}

interface DocumentsListProps {
  documents: Document[]
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents
            <span className="text-sm font-normal text-gray-500 ml-2">({documents.length})</span>
          </CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-1">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                  <File className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => alert(`Viewing ${doc.name}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => alert(`Downloading ${doc.name}`)}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
