"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Highlighter, MessageSquare, Bookmark } from "lucide-react"

export default function AnnotationWorkbench() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Annotations & Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Add annotations and notes to clinical documents.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Highlighter className="w-4 h-4" />
              Highlight
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Comment
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Bookmark
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}