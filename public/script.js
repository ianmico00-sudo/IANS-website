let content = {}

// Load content on page load
document.addEventListener("DOMContentLoaded", () => {
  loadContent()
})

async function loadContent() {
  try {
    const response = await fetch("/api/content")
    content = await response.json()
    renderPage()
  } catch (error) {
    console.error("Error loading content:", error)
  }
}

function renderPage() {
  // Hero
  document.getElementById("hero-title").textContent = content.hero.title
  document.getElementById("hero-subtitle").textContent = content.hero.subtitle
  document.getElementById("hero-primary-btn").textContent = content.hero.primaryButtonText
  document.getElementById("hero-secondary-btn").textContent = content.hero.secondaryButtonText

  if (content.hero.backgroundImage) {
    document.getElementById("hero-bg").style.backgroundImage = `url('${content.hero.backgroundImage}')`
  }

  // About
  document.getElementById("about-title").textContent = content.about.title
  const aboutParasContainer = document.getElementById("about-paragraphs")
  aboutParasContainer.innerHTML = content.about.paragraphs.map((p) => `<p>${p}</p>`).join("")

  if (content.about.image) {
    document.getElementById("about-image").src = content.about.image
  }

  // Pillars
  const pillarsGrid = document.getElementById("pillars-grid")
  pillarsGrid.innerHTML = content.pillars
    .map(
      (pillar) => `
    <div class="pillar-card">
      <div class="pillar-card-icon">
        ${pillar.icon ? `<img src="${pillar.icon}" alt="${pillar.title}">` : "📍"}
      </div>
      <h3>${pillar.title}</h3>
      <p>${pillar.description}</p>
    </div>
  `,
    )
    .join("")

  // Stats
  const statsGrid = document.getElementById("stats-grid")
  statsGrid.innerHTML = content.stats
    .map(
      (stat) => `
    <div class="stat-card">
      <div class="number">${stat.number}</div>
      <div class="label">${stat.label}</div>
    </div>
  `,
    )
    .join("")

  // Ways to Help
  const waysGrid = document.getElementById("ways-grid")
  waysGrid.innerHTML = content.waysToHelp
    .map(
      (way) => `
    <div class="way-card">
      <h3>${way.title}</h3>
      <p>${way.description}</p>
      <button class="action-btn">${way.action}</button>
    </div>
  `,
    )
    .join("")
}
