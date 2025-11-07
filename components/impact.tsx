"use client"

import { useEffect, useState } from "react"
import type { Stat } from "@/lib/content"
import { defaultContent } from "@/lib/content"

export function Impact() {
  const [stats, setStats] = useState<Stat[]>(defaultContent.stats)

  useEffect(() => {
    fetch("/api/content/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(defaultContent.stats))
  }, [])

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Making a difference across Rwanda through dedicated action and community engagement
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
              <div className="text-lg text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
