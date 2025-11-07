import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin/admin-header"
import { HeroEditor } from "@/components/admin/hero-editor"
import { AboutEditor } from "@/components/admin/about-editor"
import { PillarsEditor } from "@/components/admin/pillars-editor"
import { StatsEditor } from "@/components/admin/stats-editor"
import { WaysToHelpEditor } from "@/components/admin/ways-to-help-editor"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Content Management</h1>
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="pillars">Pillars</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="ways">Get Involved</TabsTrigger>
          </TabsList>
          <TabsContent value="hero">
            <HeroEditor />
          </TabsContent>
          <TabsContent value="about">
            <AboutEditor />
          </TabsContent>
          <TabsContent value="pillars">
            <PillarsEditor />
          </TabsContent>
          <TabsContent value="stats">
            <StatsEditor />
          </TabsContent>
          <TabsContent value="ways">
            <WaysToHelpEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
