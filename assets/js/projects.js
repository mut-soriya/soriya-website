let allProjects = [];

export function renderProjects(projects) {
  allProjects = Array.isArray(projects) ? projects : [];
  const filters = document.querySelector("#projectFilters");
  const grid = document.querySelector("#projectsGrid");
  const categories = ["All", ...new Set(allProjects.flatMap(p => p.category || []))];
  filters.innerHTML = categories.map((c,i) =>
    `<button class="filter-btn ${i===0?"active":""}" type="button" data-filter="${c}">${c}</button>`
  ).join("");
  filters.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjectCards(btn.dataset.filter === "All" ? allProjects : allProjects.filter(p => (p.category||[]).includes(btn.dataset.filter)));
  }));
  renderProjectCards(allProjects);
}

function renderProjectCards(projects) {
  const grid = document.querySelector("#projectsGrid");
  if (!projects.length) {
    grid.innerHTML = `<div class="empty-state">No projects in this category yet.</div>`;
    return;
  }
  grid.innerHTML = projects.map(p => `
    <article class="project-card reveal">
      <div class="project-image"><img src="${escapeHtml(p.image || "assets/images/projects/study-system.svg")}" alt="${escapeHtml(p.title)} screenshot" loading="lazy"></div>
      <div class="project-content">
        <div class="project-top"><h3>${escapeHtml(p.title)}</h3><span class="badge">${escapeHtml(p.status || "Learning")}</span></div>
        <p>${escapeHtml(p.description || "")}</p>
        <div class="tech-list">${(p.technologies||[]).map(t=>`<span class="tech">${escapeHtml(t)}</span>`).join("")}</div>
        <div class="project-links">
          ${p.github ? `<a class="btn btn-ghost" href="${safeUrl(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
          ${p.demo ? `<a class="btn btn-primary" href="${safeUrl(p.demo)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");
  requestAnimationFrame(() => document.querySelectorAll("#projectsGrid .reveal").forEach(el => el.classList.add("visible")));
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function safeUrl(value){try{const u=new URL(value,location.href);return ["http:","https:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
