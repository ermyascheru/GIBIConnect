import { educationalImageGeneratorService } from './dist/modules/ai/image.generator.service.js';

async function test() {
  const prompt = 'What does the human brain look like and what are its parts called?';
  const res = await educationalImageGeneratorService.generateImage({ prompt });
  const svg = decodeURIComponent(res.imageUrl.replace('data:image/svg+xml;charset=utf-8,', ''));
  const lines = svg.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('&') && !line.includes('&amp;') && !line.includes('&apos;')) {
      console.log(`Line ${i + 1}: ${line}`);
    }
  });
}

test().catch(console.error);
