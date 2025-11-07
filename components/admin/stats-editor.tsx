"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Stat } from "@/lib/content"

export function StatsEditor() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/stats")
      const data = await response.json()
      setStats(data)
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
      const response = await fetch("/api/content/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Statistics updated successfully",
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

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Statistics</CardTitle>
        <CardDescription>Edit the impact statistics displayed on your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <h3 className="font-semibold">Statistic {index + 1}</h3>
              <div className="space-y-2">
                <Label htmlFor={`stat-number-${index}`}>Number</Label>
                <Input
                  id={`stat-number-${index}`}
                  value={stat.number}
                  onChange={(e) => updateStat(index, "number", e.target.value)}
                  placeholder="20+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`stat-label-${index}`}>Label</Label>
                <Input
                  id={`stat-label-${index}`}
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="Years of Service"
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
