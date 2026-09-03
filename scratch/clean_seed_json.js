const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, '../frontend/seed.json');
if (fs.existsSync(seedPath)) {
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  if (seed.institutions) {
    seed.institutions.forEach(inst => {
      if (inst.name.includes('Adama Science')) {
        inst.logo_url = 'assets/logos/astu_logo.png';
      } else {
        inst.logo_url = null;
      }
    });
  }
  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf8');
  console.log('Cleaned frontend/seed.json logo_url values');
}
