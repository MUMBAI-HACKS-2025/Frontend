"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EHRInspectorProps {
  json: unknown
}

export default function EHRInspector({ json }: EHRInspectorProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">EHR Inspector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-auto">
          <pre className="text-xs bg-gray-50 p-3 rounded border text-gray-700 whitespace-pre-wrap break-words">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}