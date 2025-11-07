let adminToken = null
let currentContent = {}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAdmin()
})

function checkAdmin() {
  adminToken = localStorage.getItem("adminToken")
  if (adminToken) {
    showAdminPanel()
  }
}

async function adminLogin() {
  const password = document.getElementById("admin-password").value
  const errorEl = document.getElementById("login-error")

  if (!password) {
    errorEl.textContent = "Please enter a password"
    return
  }

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    if (data.success) {
      adminToken = data.token
      localStorage.setItem("adminToken", adminToken)
      showAdminPanel()
      loadAdminContent()
    } else {
      errorEl.textContent = "Invalid password"
    }
  } catch (error) {
    errorEl.textContent = "Login failed"
    console.error("Login error:", error)
  }
}

function adminLogout() {
  localStorage.removeItem("adminToken")
  adminToken = null
  document.getElementById("login-page").style.display = "flex"
  document.getElementById("admin-page").style.display = "none"
  document.getElementById("admin-password").value = ""
  document.getElementById("login-error").textContent = ""
}

function showAdminPanel() {
  document.getElementById("login-page").style.display = "none"
  document.getElementById("admin-page").style.display = "block"
}

async function loadAdminContent() {
  try {
    const response = await fetch("/api/content")
    currentContent = await response.json()
    populateAdminForm()
  } catch (error) {
    console.error("Error loading content:", error)
  }
}

function populateAdminForm() {
  // Hero
  document.getElementById("hero-title-input").value = currentContent.hero.title
  document.getElementById("hero-subtitle-input").value = currentContent.hero.subtitle
  document.getElementById("hero-btn-primary-input").value = currentContent.hero.primaryButtonText
  document.getElementById("hero-btn-secondary-input").value = currentContent.hero.secondaryButtonText
  document.getElementById("hero-image-url").value = currentContent.hero.backgroundImage || ""

  // About
  document.getElementById("about-title-input").value = currentContent.about.title
  document.getElementById("about-para1-input").value = currentContent.about.paragraphs[0] || ""
  document.getElementById("about-para2-input").value = currentContent.about.paragraphs[1] || ""
  document.getElementById("about-image-url").value = currentContent.about.image || ""

  // Pillars
  const pillarsEditor = document.getElementById("pillars-editor")
  pillarsEditor.innerHTML = currentContent.pillars
    .map(
      (pillar, index) => `
    <div class="editor-item">
      <h4>Pillar ${index + 1}</h4>
      <label>Title</label>
      <input type="text" id="pillar-title-${index}" value="${pillar.title}" />
      <label>Description</label>
      <textarea id="pillar-desc-${index}">${pillar.description}</textarea>
      <label>Icon/Image URL</label>
      <input type="text" id="pillar-icon-${index}" value="${pillar.icon || ""}" />
    </div>
  `,
    )
    .join("")

  // Stats
  const statsEditor = document.getElementById("stats-editor")
  statsEditor.innerHTML = currentContent.stats
    .map(
      (stat, index) => `
    <div class="editor-item">
      <h4>Stat ${index + 1}</h4>
      <label>Number</label>
      <input type="text" id="stat-number-${index}" value="${stat.number}" />
      <label>Label</label>
      <input type="text" id="stat-label-${index}" value="${stat.label}" />
    </div>
  `,
    )
    .join("")

  // Ways to Help
  const waysEditor = document.getElementById("ways-editor")
  waysEditor.innerHTML = currentContent.waysToHelp
    .map(
      (way, index) => `
    <div class="editor-item">
      <h4>Way ${index + 1}</h4>
      <label>Title</label>
      <input type="text" id="way-title-${index}" value="${way.title}" />
      <label>Description</label>
      <textarea id="way-desc-${index}">${way.description}</textarea>
      <label>Action Button Text</label>
      <input type="text" id="way-action-${index}" value="${way.action}" />
    </div>
  `,
    )
    .join("")
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"))
  document.querySelectorAll(".tab-btn").forEach((el) => el.classList.remove("active"))

  document.getElementById(`${tabName}-tab`).classList.add("active")
  event.target.classList.add("active")
}

// Image preview
function previewImage(event, previewId) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById(previewId).src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Save functions
async function saveHero() {
  const data = {
    title: document.getElementById("hero-title-input").value,
    subtitle: document.getElementById("hero-subtitle-input").value,
    primaryButtonText: document.getElementById("hero-btn-primary-input").value,
    secondaryButtonText: document.getElementById("hero-btn-secondary-input").value,
    backgroundImage: document.getElementById("hero-image-url").value,
  }

  const imageInput = document.getElementById("hero-image-input")
  if (imageInput.files.length > 0) {
    data.backgroundImage = await fileToBase64(imageInput.files[0])
  }

  await saveContent("/api/content/hero", data, "hero-message")
}

async function saveAbout() {
  const data = {
    title: document.getElementById("about-title-input").value,
    paragraphs: [
      document.getElementById("about-para1-input").value,
      document.getElementById("about-para2-input").value,
    ],
    image: document.getElementById("about-image-url").value,
  }

  const imageInput = document.getElementById("about-image-input")
  if (imageInput.files.length > 0) {
    data.image = await fileToBase64(imageInput.files[0])
  }

  await saveContent("/api/content/about", data, "about-message")
}

async function savePillars() {
  const pillars = []
  const pillarsEditor = document.getElementById("pillars-editor")
  const itemCount = pillarsEditor.querySelectorAll(".editor-item").length

  for (let i = 0; i < itemCount; i++) {
    pillars.push({
      title: document.getElementById(`pillar-title-${i}`).value,
      description: document.getElementById(`pillar-desc-${i}`).value,
      icon: document.getElementById(`pillar-icon-${i}`).value,
    })
  }

  await saveContent("/api/content/pillars", { pillars }, "pillars-message")
}

async function saveStats() {
  const stats = []
  const statsEditor = document.getElementById("stats-editor")
  const itemCount = statsEditor.querySelectorAll(".editor-item").length

  for (let i = 0; i < itemCount; i++) {
    stats.push({
      number: document.getElementById(`stat-number-${i}`).value,
      label: document.getElementById(`stat-label-${i}`).value,
    })
  }

  await saveContent("/api/content/stats", { stats }, "stats-message")
}

async function saveWays() {
  const waysToHelp = []
  const waysEditor = document.getElementById("ways-editor")
  const itemCount = waysEditor.querySelectorAll(".editor-item").length

  for (let i = 0; i < itemCount; i++) {
    waysToHelp.push({
      title: document.getElementById(`way-title-${i}`).value,
      description: document.getElementById(`way-desc-${i}`).value,
      action: document.getElementById(`way-action-${i}`).value,
    })
  }

  await saveContent("/api/content/ways-to-help", { waysToHelp }, "ways-message")
}

async function saveContent(endpoint, data, messageId) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    const messageEl = document.getElementById(messageId)

    if (result.success) {
      messageEl.textContent = "✓ Saved successfully!"
      messageEl.classList.remove("error")
      messageEl.classList.add("success")
      setTimeout(() => messageEl.classList.remove("success"), 3000)
    } else {
      messageEl.textContent = "Error: " + result.error
      messageEl.classList.remove("success")
      messageEl.classList.add("error")
    }
  } catch (error) {
    console.error("Save error:", error)
    document.getElementById(messageId).textContent = "Error saving content"
    document.getElementById(messageId).classList.add("error")
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}
