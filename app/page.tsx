import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Pillars } from "@/components/pillars"
import { Impact } from "@/components/impact"
import { GetInvolved } from "@/components/get-involved"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Pillars />
      <Impact />
      <GetInvolved />
      <Footer />
    </main>
  )
}
