const db = require('../backend/src/config/database');

async function main() {
  const cols = await db.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'institutions' ORDER BY ordinal_position;");
  console.log("Institutions columns:", cols.rows.map(c => c.column_name));
  
  const sample = await db.query("SELECT id, name, slug, logo_url, cover_image_url, website_url, city, region, status FROM institutions ORDER BY name;");
  console.log("Total rows in DB:", sample.rows.length);
  sample.rows.forEach(r => console.log(JSON.stringify(r)));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
