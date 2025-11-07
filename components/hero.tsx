"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { HeroContent } from "@/lib/content"
import { defaultContent } from "@/lib/content"

export function Hero() {
  const [content, setContent] = useState<HeroContent>(defaultContent.hero)

  useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(() => setContent(defaultContent.hero))
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
      {content.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">{content.title}</h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto text-balance">{content.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
            {content.primaryButtonText}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
            {content.secondaryButtonText}
          </Button>
        </div>
      </div>
    </section>
  )
}
