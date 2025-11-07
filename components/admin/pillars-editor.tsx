"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Pillar } from "@/lib/content"
import { ImageUpload } from "@/components/admin/image-upload"

export function PillarsEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/pillars")
      const data = await response.json()
      setPillars(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/content/pillars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pillars),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pillars updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePillar = (index: number, field: keyof Pillar, value: string) => {
    const newPillars = [...pillars]
    newPillars[index] = { ...newPillars[index], [field]: value }
    setPillars(newPillars)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Five Pillars</CardTitle>
        <CardDescription>Edit the five pillars of your organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pillars.map((pillar, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Pillar {index + 1}</h3>
            <div className="space-y-2">
              <Label htmlFor={`pillar-title-${index}`}>Title</Label>
              <Input
                id={`pillar-title-${index}`}
                value={pillar.title}
                onChange={(e) => updatePillar(index, "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`pillar-desc-${index}`}>Description</Label>
              <Textarea
                id={`pillar-desc-${index}`}
                value={pillar.description}
                onChange={(e) => updatePillar(index, "description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon/Image</Label>
              <ImageUpload
                value={pillar.icon || ""}
                onChange={(value) => updatePillar(index, "icon", value)}
                placeholder="Upload icon or enter URL"
              />
            </div>
          </div>
        ))}
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
