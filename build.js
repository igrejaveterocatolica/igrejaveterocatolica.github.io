import fs from "fs";
import path from "path";
import { marked } from "marked";

// -----------------------------
// Ensure build-output folder exists
// -----------------------------
if (!fs.existsSync("./build-output")) {
  fs.mkdirSync("./build-output");
}

// -----------------------------
// Utility: Parse Markdown + Frontmatter
// -----------------------------
function parseMarkdown(raw) {
  const fmMatch = raw.match(/---([\s\S]*?)---/);
  let frontmatter = {};
  let body = raw;

  if (fmMatch) {
    const fmText = fmMatch[1].trim();
    body = raw.replace(fmMatch[0], "").trim();

    fmText.split("\n").forEach(line => {
      const [key, ...value] = line.split(":");
      frontmatter[key.trim()] = value.join(":").trim().replace(/^"|"$/g, "");
    });
  }

  return { frontmatter, body };
}

// -----------------------------
// Load JSON helpers
// -----------------------------
function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// -----------------------------
// Render template with placeholders
// -----------------------------
function renderTemplate(template, data) {
  let html = template;
  for (const key in data) {
    const value = data[key] || "";
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return html;
}

// -----------------------------
// Build Menu HTML
// -----------------------------
function loadMenuHTML() {
  const data = loadJSON("./content/menu.json")[""];
  return data
    .map(item => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join("");
}

// -----------------------------
// Build Footer Links HTML
// -----------------------------
function loadFooterLinksHTML() {
  const links = loadJSON("./content/footer.json").links;
  return links
    .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join("");
}

// -----------------------------
// Load Site Settings
// -----------------------------
function loadSettingsData() {
  return loadJSON("./content/settings.json");
}

// -----------------------------
// Build homepage (index.html)
// -----------------------------
function buildHomepage() {
  const template = fs.readFileSync("./index-template.html", "utf8");
  const homeRaw = fs.readFileSync("./content/home.md", "utf8");
  const { frontmatter, body } = parseMarkdown(homeRaw);

  const communitiesData = loadJSON("./content/communities.json");
  const highlights = loadJSON("./content/highlights.json");

  const settings = loadSettingsData();
  const menuHTML = loadMenuHTML();
  const footerLinksHTML = loadFooterLinksHTML();

  // Render communities
  const communities = communitiesData.communities;
  const communitiesHTML = communities
    .map(c => {
      const btn = c.link
        ? `<a href="${c.link}" class="btn-secondary">${c.button || "Saber Mais"}</a>`
        : "";
      return `
        <div class="community-card">
          <div class="card-image" style="background-image: url('${c.image}')"></div>
          <div class="card-content">
            <h4>${c.title}</h4>
            <p class="location">${c.location}</p>
            <p class="description">${c.description}</p>
            ${btn}
          </div>
        </div>
      `;
    })
    .join("");

  // Render highlights
  const highlightsHTML = (highlights.items || [])
    .map(h => {
      return `
        <div class="highlight-item">
          <div class="date-badge">
            <span class="month">${h.month}</span>
          </div>
          <div class="highlight-text">
            <h4>${h.title}</h4>
            <p>${h.description}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const html = renderTemplate(template, {
    // Homepage content
    title: settings.site_title || "Home",
    description: frontmatter.description || "",
    image: frontmatter.image || "/assets/default.jpg",

    hero_title: frontmatter.hero_title || "",
    hero_motto: frontmatter.hero_motto || "",
    hero_subtitle: frontmatter.hero_subtitle || "",
    hero_button_text: frontmatter.hero_button_text || "",
    hero_button_link: frontmatter.hero_button_link || "#",

    clarification_title: frontmatter.clarification_title || "",
    clarification_body: marked.parse(body),

    communities_title: frontmatter.communities_title || "",
    communities_subtitle: frontmatter.communities_subtitle || "",
    communities_html: communitiesHTML,

    highlights_title: highlights.title || "",
    highlights_html: highlightsHTML,
    highlights_button_text: highlights.button_text || "",
    highlights_button_link: highlights.button_link || "#",

    // Menu
    nav_menu: menuHTML,

    // Settings
    site_title: settings.site_title,
    header_title: settings.header_title,
    header_subtitle: settings.header_subtitle,
    site_logo: settings.logo,

    // Footer
    footer_title: settings.footer_title,
    footer_description: settings.footer_description,
    footer_contact_title: settings.footer_contact_title,
    footer_email: settings.footer_email,
    footer_location: settings.footer_location,
    footer_copyright: settings.footer_copyright,
    footer_civil_note: settings.footer_civil_note,

    footer_links: footerLinksHTML
  });

  fs.writeFileSync("./build-output/index.html", html);
  console.log("✔ Homepage generated");
}

// -----------------------------
// Build all markdown pages
// -----------------------------
function buildPages() {
  const template = fs.readFileSync("./page.html", "utf8");
  const pagesDir = "./content/pages";

  const settings = loadSettingsData();
  const menuHTML = loadMenuHTML();
  const footerLinksHTML = loadFooterLinksHTML();

  fs.readdirSync(pagesDir).forEach(file => {
    if (!file.endsWith(".md")) return;

    const slug = file.replace(".md", "");
    const raw = fs.readFileSync(path.join(pagesDir, file), "utf8");
    const { frontmatter, body } = parseMarkdown(raw);

    const html = renderTemplate(template, {
      browser_title: `${frontmatter.title || slug} | ${settings.site_title}`,
      title: `${frontmatter.title || slug,
      description: frontmatter.description || "",
      image: frontmatter.image || "/assets/default.jpg",
      body: marked.parse(body),

      // Menu
      nav_menu: menuHTML,

      // Settings
      site_title: settings.site_title,
      header_title: settings.header_title,
      header_subtitle: settings.header_subtitle,
      site_logo: settings.logo,

      // Footer
      footer_title: settings.footer_title,
      footer_description: settings.footer_description,
      footer_contact_title: settings.footer_contact_title,
      footer_email: settings.footer_email,
      footer_location: settings.footer_location,
      footer_copyright: settings.footer_copyright,
      footer_civil_note: settings.footer_civil_note,

      footer_links: footerLinksHTML
    });

    fs.writeFileSync(`./build-output/${slug}.html`, html);
    console.log(`✔ Page generated: ${slug}.html`);
  });
}

// -----------------------------
// Build sitemap.xml
// -----------------------------
function buildSitemap() {
  const baseUrl = "https://igrejacatolicajerusalem.pt";

  const files = fs.readdirSync("./build-output")
    .filter(f =>
      f.endsWith(".html") &&
      f !== "404.html"
    );

  const urls = files.map(file => {
    const loc = `${baseUrl}/${file === "index.html" ? "" : file}`;
    return `
      <url>
        <loc>${loc}</loc>
        <changefreq>weekly</changefreq>
        <priority>${file === "index.html" ? "1.0" : "0.7"}</priority>
      </url>
    `;
  }).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync("./build-output/sitemap.xml", sitemap);
  console.log("✔ Sitemap generated");
}

// -----------------------------
// Deploy build-output to repo root
// -----------------------------
function deployToRoot() {
  const files = fs.readdirSync("./build-output");

  files.forEach(file => {
    fs.copyFileSync(`./build-output/${file}`, `./${file}`);
  });

  console.log("✔ Build-output copied to repo root");
}

// -----------------------------
// Run build
// -----------------------------
buildHomepage();
buildPages();
buildSitemap();
deployToRoot();

console.log("🎉 Build complete");
