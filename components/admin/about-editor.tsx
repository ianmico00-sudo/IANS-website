"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { AboutContent } from "@/lib/content"
import { ImageUpload } from "@/components/admin/image-upload"

export function AboutEditor() {
  const [content, setContent] = useState<AboutContent>({
    title: "",
    paragraphs: ["", ""],
    image: "", // Added image field
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/about")
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
      const response = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "About section updated successfully",
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
        <CardTitle>About Section</CardTitle>
        <CardDescription>Edit the about/mission section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Our Mission"
          />
        </div>
        <div className="space-y-2">
          <Label>Section Image</Label>
          <ImageUpload
            value={content.image || ""}
            onChange={(value) => setContent({ ...content, image: value })}
            placeholder="Upload image or enter URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paragraph1">First Paragraph</Label>
          <Textarea
            id="paragraph1"
            value={content.paragraphs[0]}
            onChange={(e) => {
              const newParagraphs = [...content.paragraphs]
              newParagraphs[0] = e.target.value
              setContent({ ...content, paragraphs: newParagraphs })
            }}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paragraph2">Second Paragraph</Label>
          <Textarea
            id="paragraph2"
            value={content.paragraphs[1]}
            onChange={(e) => {
              const newParagraphs = [...content.paragraphs]
              newParagraphs[1] = e.target.value
              setContent({ ...content, paragraphs: newParagraphs })
            }}
            rows={4}
          />
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
