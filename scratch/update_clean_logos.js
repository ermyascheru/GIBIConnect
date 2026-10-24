const db = require('../backend/src/config/database');

async function main() {
  await db.query("UPDATE institutions SET logo_url = NULL;");
  await db.query("UPDATE institutions SET logo_url = 'assets/logos/astu_logo.png' WHERE name ILIKE '%Adama Science%';");
  
  const r = await db.query("SELECT name, logo_url, cover_image_url, website_url FROM institutions ORDER BY name;");
  console.log("Database updated successfully. Total records:", r.rows.length);
  r.rows.forEach(row => console.log(JSON.stringify(row)));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
