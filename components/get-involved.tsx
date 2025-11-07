"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type { WayToHelp } from "@/lib/content"
import { defaultContent } from "@/lib/content"

export function GetInvolved() {
  const [ways, setWays] = useState<WayToHelp[]>(defaultContent.waysToHelp)

  useEffect(() => {
    fetch("/api/content/ways-to-help")
      .then((res) => res.json())
      .then((data) => setWays(data))
      .catch(() => setWays(defaultContent.waysToHelp))
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get Involved</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in building a Rwanda where peace and social justice are a reality for all
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ways.map((way, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">{way.title}</CardTitle>
                <CardDescription className="text-base">{way.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-900 hover:bg-blue-800">{way.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
