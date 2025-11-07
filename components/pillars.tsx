"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Scale, Lightbulb, BookOpen, Handshake } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import type { Pillar } from "@/lib/content"
import { defaultContent } from "@/lib/content"

const icons = [Users, Scale, Lightbulb, BookOpen, Handshake]

export function Pillars() {
  const [pillars, setPillars] = useState<Pillar[]>(defaultContent.pillars)

  useEffect(() => {
    fetch("/api/content/pillars")
      .then((res) => res.json())
      .then((data) => setPillars(data))
      .catch(() => setPillars(defaultContent.pillars))
  }, [])

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Five Pillars</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We work across five interconnected areas to create lasting change in Rwanda
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = icons[index] || Users
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  {pillar.icon ? (
                    <div className="relative w-12 h-12 mb-4">
                      <Image
                        src={pillar.icon || "/placeholder.svg"}
                        alt={pillar.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
