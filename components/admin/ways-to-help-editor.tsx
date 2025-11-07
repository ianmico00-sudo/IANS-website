"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { WayToHelp } from "@/lib/content"

export function WaysToHelpEditor() {
  const [ways, setWays] = useState<WayToHelp[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/ways-to-help")
      const data = await response.json()
      setWays(data)
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
      const response = await fetch("/api/content/ways-to-help", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ways),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Get Involved section updated successfully",
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

  const updateWay = (index: number, field: keyof WayToHelp, value: string) => {
    const newWays = [...ways]
    newWays[index] = { ...newWays[index], [field]: value }
    setWays(newWays)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Involved Section</CardTitle>
        <CardDescription>Edit the ways people can get involved</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {ways.map((way, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Option {index + 1}</h3>
            <div className="space-y-2">
              <Label htmlFor={`way-title-${index}`}>Title</Label>
              <Input
                id={`way-title-${index}`}
                value={way.title}
                onChange={(e) => updateWay(index, "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`way-desc-${index}`}>Description</Label>
              <Textarea
                id={`way-desc-${index}`}
                value={way.description}
                onChange={(e) => updateWay(index, "description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`way-action-${index}`}>Button Text</Label>
              <Input
                id={`way-action-${index}`}
                value={way.action}
                onChange={(e) => updateWay(index, "action", e.target.value)}
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
