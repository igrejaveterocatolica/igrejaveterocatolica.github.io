// -----------------------------
// Utility: Fetch JSON
// -----------------------------
async function getJSON(path) {
    const res = await fetch(path);
    return await res.json();
}

// -----------------------------
// Utility: Fetch Markdown + Frontmatter
// -----------------------------
async function getMarkdown(path) {
    const raw = await fetch(path).then(r => r.text());

    const fmMatch = raw.match(/---([\s\S]*?)---/);
    let frontmatter = {};
    let body = raw;

    if (fmMatch) {
        const fmText = fmMatch[1].trim();
        body = raw.replace(fmMatch[0], '');

        fmText.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            frontmatter[key.trim()] = value.join(':').trim().replace(/^"|"$/g, '');
        });
    }

    return { frontmatter, body };
}

// -----------------------------
// Load Site Settings (JSON)
// -----------------------------
async function loadSettings() {
    const data = await getJSON('/content/settings.json');

    document.getElementById('site-title').textContent = data.site_title;
    document.getElementById('header-title').textContent = data.header_title;
    document.getElementById('header-subtitle').textContent = data.header_subtitle;
    document.getElementById('site-logo').src = data.logo;

    document.getElementById('footer-title').textContent = data.footer_title;
    document.getElementById('footer-description').textContent = data.footer_description;
    document.getElementById('footer-contact-title').textContent = data.footer_contact_title;
    document.getElementById('footer-email').textContent = data.footer_email;
    document.getElementById('footer-location').textContent = data.footer_location;
    document.getElementById('footer-copyright').textContent = data.footer_copyright;
    document.getElementById('footer-civil-note').textContent = data.footer_civil_note;
}

// -----------------------------
// Load Home Page (Markdown)
// -----------------------------
async function loadHomePage() {
    const { frontmatter, body } = await getMarkdown('/content/home.md');
    const motto = frontmatter.hero_motto || '';

    document.getElementById('hero-title').innerHTML = frontmatter.hero_title || '';
    document.getElementById('hero-motto').textContent = `"${motto}"`;
    document.getElementById('hero-subtitle').textContent = frontmatter.hero_subtitle || '';
    document.getElementById('hero-button').textContent = frontmatter.hero_button_text || '';
    document.getElementById('hero-button').href = frontmatter.hero_button_link || '#';

    document.getElementById('clarification-title').textContent = frontmatter.clarification_title || '';
    document.getElementById('clarification-body').innerHTML = marked.parse(body);
}

// -----------------------------
// Load Menu (JSON)
// -----------------------------
async function loadMenu() {
  const data = await getJSON("/content/menu.json");

  // CMS stores the list under the empty key ""
  const items = data[""];

  const nav = document.getElementById("nav-menu");
  nav.innerHTML = items
    .map(item => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join("");
}

// -----------------------------
// Load Communities (JSON)
// -----------------------------
async function loadCommunities() {
    const communities = (await getJSON('/content/communities.json'))[""];
    const grid = document.getElementById('communities-grid');

    grid.innerHTML = communities.map(c => `
        <div class="community-card">
            <div class="card-image" style="background-image: url('${c.image}')"></div>
            <div class="card-content">
                <h4>${c.title}</h4>
                <p class="location">${c.location}</p>
                <p class="description">${c.description}</p>
                <a href="${c.link}" class="btn-secondary">${c.button}</a>
            </div>
        </div>
    `).join('');
}

// -----------------------------
// Load Highlights (JSON)
// -----------------------------
async function loadHighlights() {
    const highlights = await getJSON('/content/highlights.json');
    const container = document.getElementById('highlights-container');

    // Render highlight items
    container.innerHTML = (highlights.items || []).map(h => `
        <div class="highlight-item">
            <div class="date-badge">
                <span class="month">${h.month}</span>
            </div>
            <div class="highlight-text">
                <h4>${h.title}</h4>
                <p>${h.description}</p>
            </div>
        </div>
    `).join('');

    // Render metadata
    document.getElementById('highlights-title').textContent = highlights.title || '';
    document.getElementById('highlights-button').textContent = highlights.button_text || '';
    document.getElementById('highlights-button').href = highlights.button_link || '#';
}


// -----------------------------
// Load Footer Links (JSON)
// -----------------------------
async function loadFooterLinks() {
    const links = await getJSON('/content/footer.json');
    const list = document.getElementById('footer-links-list');

    list.innerHTML = links.map(l => `
        <li><a href="${l.href}">${l.label}</a></li>
    `).join('');
}

// -----------------------------
// Universal MD Page Loader
// -----------------------------
async function loadPage(slug) {
  const path = `/content/pages/${slug}.md`;

  try {
    const res = await fetch(path);
    const raw = await res.text();

    // Detect GitHub Pages 404 HTML
    const isHTML = raw.trim().startsWith("<!DOCTYPE") ||
                   raw.trim().startsWith("<html");

    if (isHTML) {
      if (slug !== "404") return loadPage("404");
      return showHardFallback();
    }

    const { frontmatter, body } = getMarkdownFromRaw(raw);

    document.getElementById("page-title").textContent =
      frontmatter.title || slug;

    document.getElementById("page-body").innerHTML = marked.parse(body);

  } catch (err) {
    if (slug !== "404") return loadPage("404");
    showHardFallback();
  }
}

function showHardFallback() {
  document.getElementById("page-title").textContent = "Página não encontrada";
  document.getElementById("page-body").innerHTML = `
    <center><p>Não foi possível carregar esta página.</p></center>
  `;
}




// -----------------------------
// Init
// -----------------------------
loadSettings();
const slug = window.location.pathname.replace('/', '') || 'home';
// If homepage
if (slug === '' || slug === 'index.html' || slug === 'home') {
    loadHomePage();
    loadCommunities();
    loadHighlights();
}
loadMenu();
loadFooterLinks();
