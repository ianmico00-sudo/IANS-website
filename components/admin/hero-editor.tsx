"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { HeroContent } from "@/lib/content"
import { ImageUpload } from "@/components/admin/image-upload"

export function HeroEditor() {
  const [content, setContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    backgroundImage: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/hero")
      const data = await response.json()
      setContent(data)
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
      const response = await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hero section updated successfully",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Edit the main hero section of your website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Never Again Rwanda"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea
            id="subtitle"
            value={content.subtitle}
            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            placeholder="Building sustainable peace..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Background Image</Label>
          <ImageUpload
            value={content.backgroundImage || ""}
            onChange={(value) => setContent({ ...content, backgroundImage: value })}
            placeholder="Upload background image or enter URL"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryButton">Primary Button Text</Label>
            <Input
              id="primaryButton"
              value={content.primaryButtonText}
              onChange={(e) => setContent({ ...content, primaryButtonText: e.target.value })}
              placeholder="Get Involved"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryButton">Secondary Button Text</Label>
            <Input
              id="secondaryButton"
              value={content.secondaryButtonText}
              onChange={(e) => setContent({ ...content, secondaryButtonText: e.target.value })}
              placeholder="Learn More"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
