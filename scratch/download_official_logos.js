const fs = require('fs');
const path = require('path');

const officialLogos = [
  {
    name: 'Adama Science and Technology University',
    file: 'astu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/6/6f/Adama_Science_and_Technology_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Adama_Science_and_Technology_University_logo.png/300px-Adama_Science_and_Technology_University_logo.png',
      'https://www.astu.edu.et/images/astu_logo.png'
    ]
  },
  {
    name: 'Addis Ababa University',
    file: 'aau_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/8/87/Addis_Ababa_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Addis_Ababa_University_logo.png/300px-Addis_Ababa_University_logo.png'
    ]
  },
  {
    name: 'Bahir Dar University',
    file: 'bdu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/5/52/Bahir_Dar_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Bahir_Dar_University_logo.png/300px-Bahir_Dar_University_logo.png'
    ]
  },
  {
    name: 'University of Gondar',
    file: 'uog_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/c/cf/University_of_Gondar_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/University_of_Gondar_logo.png/300px-University_of_Gondar_logo.png'
    ]
  },
  {
    name: 'Jimma University',
    file: 'ju_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/6/6e/Jimma_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Jimma_University_logo.png/300px-Jimma_University_logo.png'
    ]
  },
  {
    name: 'Hawassa University',
    file: 'hu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/41/Hawassa_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Hawassa_University_logo.png/300px-Hawassa_University_logo.png'
    ]
  },
  {
    name: 'Mekelle University',
    file: 'mu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/07/Mekelle_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Mekelle_University_logo.png/300px-Mekelle_University_logo.png'
    ]
  },
  {
    name: 'Arba Minch University',
    file: 'amu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/b/b5/Arba_Minch_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Arba_Minch_University_logo.png/300px-Arba_Minch_University_logo.png'
    ]
  },
  {
    name: 'Haramaya University',
    file: 'haramaya_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/42/Haramaya_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Haramaya_University_logo.png/300px-Haramaya_University_logo.png'
    ]
  },
  {
    name: 'Dire Dawa University',
    file: 'ddu_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/d/d3/Dire_Dawa_University_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Dire_Dawa_University_logo.png/300px-Dire_Dawa_University_logo.png'
    ]
  }
];

async function downloadLogos() {
  const destDir = path.resolve(__dirname, '../frontend/assets/logos');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GIBIConnect/1.0 (academic; edu)'
  };

  for (const item of officialLogos) {
    let success = false;
    for (const url of item.urls) {
      try {
        console.log(`Trying to download ${item.name} from: ${url}`);
        const res = await fetch(url, { headers });
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          if (buffer.length > 500) {
            const targetPath = path.join(destDir, item.file);
            fs.writeFileSync(targetPath, buffer);
            console.log(`Saved ${item.file} (${buffer.length} bytes) for ${item.name}`);
            success = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`Failed downloading from ${url}:`, err.message);
      }
    }
    if (!success) {
      console.warn(`Could not download verified logo for ${item.name}`);
    }
  }
}

downloadLogos().then(() => console.log('Logo download task complete')).catch(console.error);
