import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getContent, updateContent } from "@/lib/content-store"

export async function GET() {
  try {
    const content = await getContent()
    return NextResponse.json(content.waysToHelp)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth()
    const waysData = await request.json()
    const content = await getContent()
    content.waysToHelp = waysData
    await updateContent(content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
