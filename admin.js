/* Simple LocalStorage Admin Panel
   - Stores site content under key "site_content_v1"
   - Admins stored under "admin_users_v1" (password hashed with simple b64—not secure)
*/

const STORAGE_KEY = "site_content_v1";
const USERS_KEY = "admin_users_v1";

/* ---------- Demo default content ---------- */
const DEFAULT_CONTENT = {
  hero: {
    label: "Building a Better Future",
    title: "Empowering Youth for Sustainable Peace and Social Justice",
    description: "Since 2002, Never Again Rwanda has been engaging society in embracing peace, human rights, and social justice.",
    bgBase64: null
  },
  about: {
    title: "Our Mission",
    description: "Never Again Rwanda is a human rights and peacebuilding organization that aims to engage society in embracing peace and social justice.",
  },
  programs: [
    { id: generateId(), title: "Peacebuilding", description: "Facilitating dialogue, reconciliation, and conflict resolution.", icon: "" },
    { id: generateId(), title: "Governance & Human Rights", description: "Promoting democratic values, civic participation.", icon: "" }
  ],
  stats: {
    years: "20+",
    pillars: "5",
    youth: "1000s",
    commit: "100%"
  }
};

const DEFAULT_USERS = [
  { email: "admin1@site.test", pwd: btoa("admin123") }, // base64—NOT secure, demo only
  { email: "admin2@site.test", pwd: btoa("admin456") }
];

/* ---------- Helpers ---------- */
function generateId(){ return "id_"+Math.random().toString(36).slice(2,9); }
function saveStorage(key, data){ localStorage.setItem(key, JSON.stringify(data)); }
function loadStorage(key){ const raw = localStorage.getItem(key); return raw? JSON.parse(raw): null; }

/* ---------- Init data ---------- */
if(!loadStorage(STORAGE_KEY)) saveStorage(STORAGE_KEY, DEFAULT_CONTENT);
if(!loadStorage(USERS_KEY)) saveStorage(USERS_KEY, DEFAULT_USERS);

/* ---------- Simple auth ---------- */
let currentUser = null;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const currentUserEl = document.getElementById("currentUser");
const fileInput = document.getElementById("fileInput");

loginBtn.addEventListener("click", ()=>{
  const e = (emailInput.value || "").trim().toLowerCase();
  const p = (passwordInput.value || "");
  const users = loadStorage(USERS_KEY) || [];
  const found = users.find(u => u.email === e && u.pwd === btoa(p));
  if(found){
    currentUser = found;
    showDashboard();
  } else {
    alert("Invalid credentials. For demo, try admin1@site.test / admin123");
  }
});

logoutBtn.addEventListener("click", ()=>{
  currentUser = null;
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
});

function showDashboard(){
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  currentUserEl.textContent = "Signed in as: " + currentUser.email;
  // load all fields
  loadContentToForm();
  renderPrograms();
  renderAdminList();
}

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tabContent").forEach(tc=>tc.classList.add("hidden"));
    document.getElementById(tab+"Tab").classList.remove("hidden");
  });
});

/* ---------- Load / Save content ---------- */
function getContent(){ return loadStorage(STORAGE_KEY) || DEFAULT_CONTENT; }
function setContent(data){ saveStorage(STORAGE_KEY, data); }

const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroLabel = document.getElementById("heroLabel");
const heroImage = document.getElementById("heroImage");
const heroImagePreview = document.getElementById("heroImagePreview");

const aboutTitle = document.getElementById("aboutTitle");
const aboutDescription = document.getElementById("aboutDescription");

document.getElementById("saveContentBtn").addEventListener("click", ()=>{
  const content = getContent();
  content.hero.title = heroTitle.value;
  content.hero.description = heroDescription.value;
  content.hero.label = heroLabel.value;
  content.about.title = aboutTitle.value;
  content.about.description = aboutDescription.value;
  setContent(content);
  alert("Content saved to LocalStorage.");
});

document.getElementById("previewBtn").addEventListener("click", ()=>{
  // open a small preview window that loads integration snippet
  const previewHTML = createPreviewHTML(getContent());
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(previewHTML);
  w.document.close();
});

/* image upload */
heroImage.addEventListener("change", (ev)=>{
  const f = ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = function(e){
    const base64 = e.target.result;
    heroImagePreview.innerHTML = `<img src="${base64}" style="max-width:220px;border-radius:8px">`;
    const c = getContent(); c.hero.bgBase64 = base64; setContent(c);
  };
  reader.readAsDataURL(f);
});

/* load to form */
function loadContentToForm(){
  const c = getContent();
  heroTitle.value = c.hero.title || "";
  heroDescription.value = c.hero.description || "";
  heroLabel.value = c.hero.label || "";
  aboutTitle.value = c.about.title || "";
  aboutDescription.value = c.about.description || "";
  if(c.hero.bgBase64){
    heroImagePreview.innerHTML = `<img src="${c.hero.bgBase64}" style="max-width:220px;border-radius:8px">`;
  } else heroImagePreview.innerHTML = "";
}

/* ---------- Programs management ---------- */
const programForm = document.getElementById("programForm");
const programTitle = document.getElementById("programTitle");
const programDesc = document.getElementById("programDesc");
const programIcon = document.getElementById("programIcon");
const programList = document.getElementById("programList");
const clearProgramForm = document.getElementById("clearProgramForm");
let editingProgramId = null;

programForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const c = getContent();
  if(editingProgramId){
    const p = c.programs.find(x=>x.id===editingProgramId);
    p.title = programTitle.value;
    p.description = programDesc.value;
    p.icon = programIcon.value;
    editingProgramId = null;
  } else {
    c.programs.push({ id: generateId(), title: programTitle.value, description: programDesc.value, icon: programIcon.value });
  }
  setContent(c);
  programForm.reset();
  renderPrograms();
});

clearProgramForm.addEventListener("click", ()=>{
  editingProgramId = null;
  programForm.reset();
});

function renderPrograms(){
  const c = getContent();
  if(!c.programs) c.programs = [];
  programList.innerHTML = "";
  c.programs.forEach(p=>{
    const div = document.createElement("div");
    div.className = "program-item";
    div.innerHTML = `
      <div class="left">${p.icon? p.icon : "<svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'></circle></svg>"}</div>
      <div class="meta">
        <strong>${escapeHtml(p.title)}</strong>
        <div class="small-muted">${escapeHtml(p.description)}</div>
      </div>
      <div class="actions">
        <button data-id="${p.id}" class="btn small edit">Edit</button>
        <button data-id="${p.id}" class="btn ghost small delete">Delete</button>
      </div>
    `;
    programList.appendChild(div);
  });

  programList.querySelectorAll(".edit").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.dataset.id;
      const c = getContent();
      const p = c.programs.find(x=>x.id===id);
      editingProgramId = p.id;
      programTitle.value = p.title;
      programDesc.value = p.description;
      programIcon.value = p.icon;
      document.querySelector("[data-tab='programs']").click();
    });
  });

  programList.querySelectorAll(".delete").forEach(b=>{
    b.addEventListener("click", ()=>{
      if(!confirm("Delete this program?")) return;
      const id = b.dataset.id;
      const c = getContent();
      c.programs = c.programs.filter(x=>x.id!==id);
      setContent(c);
      renderPrograms();
    });
  });
}

/* ---------- Stats ---------- */
document.getElementById("saveStatsBtn").addEventListener("click", ()=>{
  const c = getContent();
  c.stats.years = document.getElementById("statYears").value;
  c.stats.pillars = document.getElementById("statPillars").value;
  c.stats.youth = document.getElementById("statYouth").value;
  c.stats.commit = document.getElementById("statCommit").value;
  setContent(c);
  alert("Stats saved.");
});

/* Load stats to form on dashboard show */
function loadStatsToForm(){
  const s = getContent().stats || {};
  document.getElementById("statYears").value = s.years || "";
  document.getElementById("statPillars").value = s.pillars || "";
  document.getElementById("statYouth").value = s.youth || "";
  document.getElementById("statCommit").value = s.commit || "";
}

/* ---------- Admin users management ---------- */
const adminList = document.getElementById("adminList");
const addAdminBtn = document.getElementById("addAdminBtn");
const newAdminEmail = document.getElementById("newAdminEmail");
const newAdminPassword = document.getElementById("newAdminPassword");

addAdminBtn.addEventListener("click", ()=>{
  const e = (newAdminEmail.value || "").toLowerCase();
  const p = newAdminPassword.value || "";
  if(!e || !p){ alert("Enter email and password."); return; }
  const users = loadStorage(USERS_KEY) || [];
  if(users.find(u=>u.email===e)){ alert("User already exists."); return; }
  users.push({ email: e, pwd: btoa(p) });
  saveStorage(USERS_KEY, users);
  newAdminEmail.value = ""; newAdminPassword.value = "";
  renderAdminList();
});

function renderAdminList(){
  const users = loadStorage(USERS_KEY) || [];
  adminList.innerHTML = "";
  users.forEach((u, idx)=>{
    const div = document.createElement("div");
    div.style.display="flex";
    div.style.justifyContent="space-between";
    div.style.alignItems="center";
    div.style.marginBottom="8px";
    div.innerHTML = `<div>${escapeHtml(u.email)}</div>
      <div>
        <button data-idx="${idx}" class="btn ghost small remove">Remove</button>
      </div>`;
    adminList.appendChild(div);
  });
  adminList.querySelectorAll(".remove").forEach(b=>{
    b.addEventListener("click", ()=>{
      const idx = Number(b.dataset.idx);
      if(!confirm("Remove this admin?")) return;
      const users = loadStorage(USERS_KEY) || [];
      users.splice(idx,1);
      saveStorage(USERS_KEY, users);
      renderAdminList();
    });
  });
}

/* ---------- Export / Import ---------- */
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importOpenBtn = document.getElementById("importOpenBtn");

exportBtn.addEventListener("click", ()=>{
  const content = getContent();
  const users = loadStorage(USERS_KEY);
  const data = { content, users, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "site_admin_backup.json"; a.click();
  URL.revokeObjectURL(url);
});

importOpenBtn.addEventListener("click", ()=> fileInput.click());
importBtn.addEventListener("click", ()=> fileInput.click());
fileInput.addEventListener("change", (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = function(ev){
    try{
      const data = JSON.parse(ev.target.result);
      if(data.content) saveStorage(STORAGE_KEY, data.content);
      if(data.users) saveStorage(USERS_KEY, data.users);
      alert("Import successful. Reloading UI.");
      loadContentToForm(); renderPrograms(); loadStatsToForm(); renderAdminList();
    }catch(err){ alert("Invalid JSON file."); }
  };
  r.readAsText(f);
});

/* small file import button (on login screen) */
document.getElementById("importBtn").addEventListener("click", ()=> fileInput.click());

/* ---------- Utilities ---------- */
function escapeHtml(s){ if(!s) return ""; return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

/* create preview HTML to open in new window */
function createPreviewHTML(content){
  // Minimal preview shell: this is for quick visual check; for production, integrate snippet in your real index.html
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;background:#fff;color:#111} .hero{padding:30px;border-radius:8px;background:#f3f4f6;margin-bottom:18px}</style>
  </head><body>
  <section class="hero">
    <p style="font-weight:600">${escapeHtml(content.hero.label || "")}</p>
    <h1>${escapeHtml(content.hero.title || "")}</h1>
    <p>${escapeHtml(content.hero.description || "")}</p>
    ${content.hero.bgBase64? `<img src="${content.hero.bgBase64}" style="max-width:320px;border-radius:8px">` : ""}
  </section>

  <section>
    <h2>${escapeHtml(content.about.title || "")}</h2>
    <p>${escapeHtml(content.about.description || "")}</p>
  </section>

  <section>
    <h3>Programs</h3>
    <ul>
      ${ (content.programs || []).map(p=>`<li><strong>${escapeHtml(p.title)}</strong> - ${escapeHtml(p.description)}</li>`).join("")}
    </ul>
  </section>

  <section>
    <h3>Stats</h3>
    <ul>
      <li>Years: ${escapeHtml(content.stats.years || "")}</li>
      <li>Pillars: ${escapeHtml(content.stats.pillars || "")}</li>
      <li>Youth: ${escapeHtml(content.stats.youth || "")}</li>
      <li>Committed: ${escapeHtml(content.stats.commit || "")}</li>
    </ul>
  </section>

  </body></html>`;
}

/* ---------- Integration helper for main site ---------- */
/* Place this snippet in your public index.html inside a <script> tag (see integration instructions below) */
/* ---------- Final UI init ---------- */
loadStatsToForm();
