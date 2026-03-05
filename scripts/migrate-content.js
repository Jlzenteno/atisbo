const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const LEGACY_DIR = path.join(__dirname, '../Info-web-atisbo/page');
const OUTPUT_FILE = path.join(__dirname, '../lib/seed-data.json');

const regionFiles = fs.readdirSync(LEGACY_DIR).filter(file => file.startsWith('region-'));

const migrationData = {
  regions: [],
  comunas: []
};

regionFiles.forEach(file => {
  const filePath = path.join(LEGACY_DIR, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  const regionName = $('h1').text().trim();
  const slug = file.replace('region-', '').replace('.html', '');
  const description = $('.zona-descripcion p').first().text().trim();

  const regionId = slug; // Temporary ID for mapping

  migrationData.regions.push({
    id: regionId,
    name: regionName,
    slug: slug,
    description: description,
    visited: true
  });

  $('.comuna-card').each((i, el) => {
    const name = $(el).find('span').text().trim();
    const imgSrc = $(el).find('img').attr('src');
    const comunaSlug = name.toLowerCase().replace(/ /g, '-').replace(/[áéíóú]/g, (m) => {
        return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }[m];
    });

    migrationData.comunas.push({
      region_id: regionId,
      name: name,
      slug: comunaSlug,
      visited: true,
      image_cover: imgSrc
    });
  });
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(migrationData, null, 2));
console.log(`Migration complete: ${migrationData.regions.length} regions and ${migrationData.comunas.length} comunas extracted.`);
