const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000

// Middleware
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.static("public"))

// Data file path
const dataFilePath = path.join(__dirname, "data", "content.json")

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true })
}

// Default content
const defaultContent = {
  hero: {
    title: "Never Again Rwanda",
    subtitle: "Building sustainable peace and social justice through youth empowerment and community engagement",
    primaryButtonText: "Get Involved",
    secondaryButtonText: "Learn More",
    backgroundImage: "",
  },
  about: {
    title: "Our Mission",
    paragraphs: [
      "Never Again Rwanda (NAR) is a human rights and peacebuilding organization that aims to engage society in embracing peace and social justice. Since our founding in 2002, we have worked to improve the lives of all Rwandans through comprehensive programs focused on sustainable peace and development.",
      "We empower young people to become active citizens, enhancing their capacity to analyze conflict root causes and facilitate dialogue for sustainable peace and socio-economic development.",
    ],
    image: "",
  },
  pillars: [
    {
      title: "Peacebuilding",
      description:
        "Empowering citizens with non-violent means of resolving conflict, building trust, and promoting trauma healing and genocide prevention.",
      icon: "",
    },
    {
      title: "Governance & Human Rights",
      description:
        "Advocating for participatory and inclusive decision-making processes and rights-based approaches in all aspects of society.",
      icon: "",
    },
    {
      title: "Youth Engagement",
      description:
        "Promoting critical thinking, entrepreneurship, tolerance of diversity, and democratic values among young people.",
      icon: "",
    },
    {
      title: "Research",
      description:
        "Conducting evidence-based research to inform policy and practice in peacebuilding and social justice initiatives.",
      icon: "",
    },
    {
      title: "Strategic Partnerships",
      description:
        "Collaborating with local and international organizations to amplify our impact and reach more communities.",
      icon: "",
    },
  ],
  stats: [
    { number: "20+", label: "Years of Service" },
    { number: "50,000+", label: "Youth Empowered" },
    { number: "30", label: "Districts Reached" },
    { number: "100+", label: "Partner Organizations" },
  ],
  waysToHelp: [
    {
      title: "Volunteer",
      description: "Join our team of dedicated volunteers working to build peace and empower youth across Rwanda.",
      action: "Apply Now",
    },
    {
      title: "Donate",
      description: "Support our programs and help us reach more communities with your generous contribution.",
      action: "Donate Today",
    },
    {
      title: "Partner",
      description: "Collaborate with us to amplify impact and create sustainable change in communities.",
      action: "Become a Partner",
    },
  ],
}

// Helper function to read content
function getContent() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error reading content:", error)
  }
  return defaultContent
}

// Helper function to save content
function saveContent(content) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(content, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error saving content:", error)
    return false
  }
}

// API Routes

// Get all content
app.get("/api/content", (req, res) => {
  const content = getContent()
  res.json(content)
})

// Update hero
app.post("/api/content/hero", (req, res) => {
  const content = getContent()
  content.hero = { ...content.hero, ...req.body }
  if (saveContent(content)) {
    res.json({ success: true, data: content.hero })
  } else {
    res.status(500).json({ success: false, error: "Failed to save" })
  }
})

// Update about
app.post("/api/content/about", (req, res) => {
  const content = getContent()
  content.about = { ...content.about, ...req.body }
  if (saveContent(content)) {
    res.json({ success: true, data: content.about })
  } else {
    res.status(500).json({ success: false, error: "Failed to save" })
  }
})

// Update pillars
app.post("/api/content/pillars", (req, res) => {
  const content = getContent()
  content.pillars = req.body.pillars
  if (saveContent(content)) {
    res.json({ success: true, data: content.pillars })
  } else {
    res.status(500).json({ success: false, error: "Failed to save" })
  }
})

// Update stats
app.post("/api/content/stats", (req, res) => {
  const content = getContent()
  content.stats = req.body.stats
  if (saveContent(content)) {
    res.json({ success: true, data: content.stats })
  } else {
    res.status(500).json({ success: false, error: "Failed to save" })
  }
})

// Update ways to help
app.post("/api/content/ways-to-help", (req, res) => {
  const content = getContent()
  content.waysToHelp = req.body.waysToHelp
  if (saveContent(content)) {
    res.json({ success: true, data: content.waysToHelp })
  } else {
    res.status(500).json({ success: false, error: "Failed to save" })
  }
})

// Admin login
app.post("/api/admin/login", (req, res) => {
  const password = req.body.password
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (password === adminPassword) {
    res.json({ success: true, token: "admin-token-" + Date.now() })
  } else {
    res.status(401).json({ success: false, error: "Invalid password" })
  }
})

app.listen(PORT, () => {
  console.log(`Never Again Rwanda server running at http://localhost:${PORT}`)
})
