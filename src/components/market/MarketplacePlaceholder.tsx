"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

export default function MarketplacePlaceholder() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Marketplace</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-sm text-gray-600 text-center">No marketplace integrations yet.</p>
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Browse Integrations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}