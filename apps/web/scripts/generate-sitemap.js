const fs = require('fs');
const path = require('path');

const pages = ['']; // homepage only for now

const domain = process.env.SITE_URL || 'http://localhost:3000';
const urls = pages
  .map((page) => {
    const loc = `${domain}/${page}`.replace(/\/$/, '');
    return `<url><loc>${loc}</loc></url>`;
  })
  .join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

const publicDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
