"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { AboutContent } from "@/lib/content"
import { defaultContent } from "@/lib/content"

export function About() {
  const [content, setContent] = useState<AboutContent>(defaultContent.about)

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(() => setContent(defaultContent.about))
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-6xl mx-auto ${content.image ? "grid md:grid-cols-2 gap-12 items-center" : "text-center"}`}
        >
          {content.image && (
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image src={content.image || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
            </div>
          )}
          <div className={content.image ? "" : "max-w-4xl mx-auto text-center"}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">{content.title}</h2>
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
