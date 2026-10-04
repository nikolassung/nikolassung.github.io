/* ==========================================================
   Shared behavior for every page:
   - builds the header and footer (edit the nav in ONE place)
   - renders presentations and publications from data.js
   - falls back to initials if the portrait file is missing
   ========================================================== */

(function () {
  const NAV = [
    ["Home", "index.html", "home"],
    ["Publications &amp; Presentations", "publications.html", "publications"],
  ];

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const page = document.body.dataset.page;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Escapes text, then bolds the site owner's name.
  const authors = (s) => esc(s).replace(/Sung, N\./g, "<strong>Sung, N.</strong>");

  /* ---------- Header & footer ---------- */
  function buildHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;
    el.innerHTML = `
      <div class="wrap header-inner">
        <a class="brand" href="index.html">Nikolas Sung</a>
        <nav class="site-nav" aria-label="Main">
          ${NAV.map(([label, href, key]) =>
            `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`
          ).join("")}
        </nav>
      </div>`;
  }

  function buildFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.className = "site-footer";
    el.innerHTML = `
      <div class="wrap footer-inner">
        <span>© ${new Date().getFullYear()} Nikolas Sung. Department of Brain and Cognitive Sciences, MIT.</span>
        <span class="footer-links">
          <a href="mailto:${SITE.email}">Email</a>
          <a href="${SITE.linkedin}" rel="noopener">LinkedIn</a>
          <a href="${SITE.github}" rel="noopener">GitHub</a>
        </span>
      </div>`;
  }

  /* ---------- Portrait fallback ---------- */
  function portraitFallback() {
    document.querySelectorAll("img.portrait").forEach((img) => {
      const swap = () => {
        const div = document.createElement("div");
        div.className = "portrait portrait-fallback";
        div.setAttribute("role", "img");
        div.setAttribute("aria-label", "Portrait placeholder");
        div.textContent = "NS";
        img.replaceWith(div);
      };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener("error", swap, { once: true });
    });
  }

  /* ---------- Presentations ---------- */
  const nowKey = new Date().getFullYear() * 12 + new Date().getMonth();
  const isUpcoming = (p) => p.year * 12 + (p.month - 1) > nowKey;

  function presentationHTML(p) {
    return `
      <article class="entry">
        <h4 class="entry-title">${esc(p.title)}</h4>
        <p class="entry-authors">${authors(p.authors)}</p>
        <p class="entry-venue">${esc(p.event)}, ${esc(p.location)}, ${MONTHS[p.month - 1]} ${p.year}</p>
        <p class="tags">
          <span class="tag">${esc(p.type)}</span>
          ${isUpcoming(p) ? '<span class="tag tag-accent">Upcoming</span>' : ""}
        </p>
      </article>`;
  }

  function renderPresentations() {
    const root = document.getElementById("presentations-list");
    if (!root) return;
    let filter = "All";

    const draw = () => {
      const items = PRESENTATIONS.filter((p) => filter === "All" || p.type === filter);
      const years = [...new Set(items.map((p) => p.year))].sort((a, b) => b - a);
      root.innerHTML =
        years
          .map(
            (y) => `
        <section class="row">
          <h3 class="row-label">${y}</h3>
          <div class="row-body">${items.filter((p) => p.year === y).map(presentationHTML).join("")}</div>
        </section>`
          )
          .join("") || '<p class="muted">No presentations match this filter.</p>';
    };

    document.querySelectorAll(".filters button").forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.dataset.filter;
        document.querySelectorAll(".filters button").forEach((b) =>
          b.setAttribute("aria-pressed", String(b === btn))
        );
        draw();
      });
    });
    draw();
  }

  /* ---------- Publications ---------- */
  function renderPublications() {
    const root = document.getElementById("publications-list");
    if (!root) return;
    const groups = ["In review", "In preparation"];
    root.innerHTML = groups
      .map((status) => {
        const items = PUBLICATIONS.filter((p) => p.status === status);
        if (!items.length) return "";
        return `
        <section class="row">
          <h3 class="row-label">${status}</h3>
          <div class="row-body">
            ${items
              .map(
                (p) => `
              <article class="entry">
                <h4 class="entry-title">${esc(p.title)}</h4>
                <p class="entry-authors">${authors(p.authors)}</p>
                ${p.venue ? `<p class="entry-venue"><em>${esc(p.venue)}</em></p>` : ""}
                ${p.note ? `<p class="tags"><span class="tag">${esc(p.note)}</span></p>` : ""}
              </article>`
              )
              .join("")}
          </div>
        </section>`;
      })
      .join("");
  }

  buildHeader();
  buildFooter();
  portraitFallback();
  renderPresentations();
  renderPublications();
})();
