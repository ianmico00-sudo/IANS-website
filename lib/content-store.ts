import { type SiteContent, defaultContent } from "./content"
import fs from "fs/promises"
import path from "path"

const CONTENT_FILE = path.join(process.cwd(), "data", "content.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function getContent(): Promise<SiteContent> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CONTENT_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return default content
    return defaultContent
  }
}

export async function updateContent(content: SiteContent): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8")
}
