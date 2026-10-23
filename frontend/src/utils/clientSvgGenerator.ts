/**
 * GIBIConnect — In-Browser Client-Side Academic & Campus Media Visual Synthesizer
 * Guarantees 100% standalone image and diagram generation in the frontend
 * even when the backend server is offline or running without external AI keys.
 */

import { ETHIOPIAN_CAMPUS_MEDIA } from '../data/campusMedia';
import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';

export interface ClientSvgResult {
  imageUrl: string;
  title: string;
  description: string;
  subject: string;
  style: string;
  keyConcepts: string[];
}

export function escapeSvgText(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateClientSvg(prompt: string, subjectOverride?: string): ClientSvgResult {
  const p = prompt.toLowerCase().trim();

  // 1. Detect if the user is asking for a university campus photo or landmark
  const uniAliases: Record<string, string> = {
    gondar: 'UOG',
    goder: 'UOG',
    uog: 'UOG',
    maraki: 'UOG',
    'addis ababa university': 'AAU',
    aau: 'AAU',
    aait: 'AAU',
    'sidist kilo': 'AAU',
    'tikur anbessa': 'AAU',
    adama: 'ASTU',
    astu: 'ASTU',
    aastu: 'AASTU',
    kilinto: 'AASTU',
    jimma: 'JU',
    ju: 'JU',
    'bahir dar': 'BDU',
    bdu: 'BDU',
    hawassa: 'HU',
    hu: 'HU',
    mekelle: 'MU',
    mu: 'MU',
    'arba minch': 'AMU',
    amu: 'AMU',
    wolkite: 'WKU',
    wku: 'WKU',
  };

  for (const [alias, code] of Object.entries(uniAliases)) {
    if (p.includes(alias)) {
      const media = ETHIOPIAN_CAMPUS_MEDIA[code];
      const inst = ETHIOPIAN_INSTITUTIONS.find((i) => i.code.toUpperCase() === code);
      if (media && inst) {
        return {
          imageUrl: media.landmark || media.hero,
          title: `${inst.nameEn} (${inst.code}) Campus & Main Entrance`,
          description: media.landmarkTitle || `Verified campus landmark and entrance facility in ${inst.city}, Ethiopia.`,
          subject: 'CAMPUS_MEDIA',
          style: 'photography',
          keyConcepts: [
            `${inst.city}, ${inst.region}`,
            media.landmarkTitle || 'Main Entrance & Administrative Quads',
            `${inst.totalFaculties} Academic Faculties`,
            'Public Research University Infrastructure',
          ],
        };
      }
    }
  }

  // 2. Detect Academic Subject for Scientific Diagrams
  let subject = subjectOverride || 'GENERAL';
  if (p.includes('brain') || p.includes('heart') || p.includes('cardio') || p.includes('nephron') || p.includes('kidney') || p.includes('bone') || p.includes('hand') || p.includes('wrist') || p.includes('skeleton') || p.includes('anatomy')) {
    subject = 'MEDICINE';
  } else if (p.includes('dna') || p.includes('cell') || p.includes('plant') || p.includes('mitosis') || p.includes('organelle') || p.includes('photosynthesis')) {
    subject = 'BIOLOGY';
  } else if (p.includes('benzene') || p.includes('atom') || p.includes('bohr') || p.includes('electron') || p.includes('molecule') || p.includes('reaction') || p.includes('chemical')) {
    subject = 'CHEMISTRY';
  } else if (p.includes('projectile') || p.includes('trajectory') || p.includes('force') || p.includes('motion') || p.includes('vector') || p.includes('gravity') || p.includes('circuit')) {
    subject = 'PHYSICS';
  } else if (p.includes('tree') || p.includes('binary') || p.includes('bst') || p.includes('graph') || p.includes('algorithm') || p.includes('stack') || p.includes('queue')) {
    subject = 'COMPUTER_SCIENCE';
  } else if (p.includes('engine') || p.includes('four-stroke') || p.includes('stroke') || p.includes('piston')) {
    subject = 'ENGINEERING';
  }

  let title = `${subject} Visual Diagram`;
  let description = `Pedagogical vector diagram synthesized for higher education curriculum.`;
  let keyConcepts: string[] = [];
  let svgBody = '';

  // 3. Topic-Specific Vector Synthesizer
  if (p.includes('heart') || p.includes('cardio') || p.includes('circulation')) {
    // Human Heart & Cardiopulmonary Anatomy
    title = 'Human Heart Anatomy & Cardiopulmonary Blood Flow';
    description = 'Anatomical diagram displaying 4 cardiac chambers, major great vessels, and systemic vs pulmonary blood flow.';
    keyConcepts = ['Right Atrium & Ventricle', 'Left Atrium & Ventricle', 'Ascending Aorta', 'Superior & Inferior Vena Cava', 'Pulmonary Artery & Veins'];
    svgBody = `
      <!-- Heart Muscular Wall Contour -->
      <path d="M 500 620 C 340 500 280 380 340 280 C 390 200 480 230 500 290 C 520 230 610 200 660 280 C 720 380 660 500 500 620 Z" fill="#FFE4E6" stroke="#BE123C" stroke-width="8" />
      <!-- Septum dividing ventricles -->
      <path d="M 500 340 C 490 440 510 520 500 600" fill="none" stroke="#E11D48" stroke-width="6" stroke-dasharray="8 6" />
      <!-- Superior Vena Cava -->
      <rect x="360" y="140" width="55" height="130" rx="14" fill="#DBEAFE" stroke="#2563EB" stroke-width="5" />
      <text x="340" y="130" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1D4ED8" text-anchor="middle">Superior Vena Cava</text>
      <!-- Aorta Arch -->
      <path d="M 470 240 C 470 120 570 120 570 240" fill="none" stroke="#DC2626" stroke-width="32" stroke-linecap="round" />
      <text x="520" y="100" font-family="sans-serif" font-size="14" font-weight="bold" fill="#B91C1C" text-anchor="middle">Aorta Arch (Systemic Output)</text>
      <!-- Pulmonary Artery -->
      <path d="M 430 250 L 320 200 M 430 250 L 580 260" stroke="#3B82F6" stroke-width="18" stroke-linecap="round" />
      <!-- Chambers Labels -->
      <text x="400" y="340" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1E40AF" text-anchor="middle">Right Atrium</text>
      <text x="600" y="340" font-family="sans-serif" font-size="15" font-weight="bold" fill="#991B1B" text-anchor="middle">Left Atrium</text>
      <text x="410" y="470" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1E40AF" text-anchor="middle">Right Ventricle</text>
      <text x="590" y="470" font-family="sans-serif" font-size="15" font-weight="bold" fill="#991B1B" text-anchor="middle">Left Ventricle</text>
      <!-- Oxygenation Indicator Callout -->
      <rect x="180" y="550" width="180" height="40" rx="8" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2" />
      <text x="270" y="575" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1E40AF" text-anchor="middle">Deoxygenated Blood (Blue)</text>
      <rect x="640" y="550" width="180" height="40" rx="8" fill="#FEE2E2" stroke="#EF4444" stroke-width="2" />
      <text x="730" y="575" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991B1B" text-anchor="middle">Oxygenated Blood (Red)</text>
    `;
  } else if (p.includes('brain') || p.includes('cerebr') || (subject === 'MEDICINE' && (p.includes('head') || p.includes('lobe')))) {
    // Human Brain Structural Anatomy
    title = 'Human Brain Structural Anatomy & Lobes';
    description = 'Sagittal anatomical cross-section showing cerebral lobes, cerebellum, brainstem, and functional centers.';
    keyConcepts = ['Frontal Lobe (Cognition)', 'Parietal Lobe (Sensory)', 'Occipital Lobe (Vision)', 'Temporal Lobe (Language)', 'Cerebellum (Coordination)', 'Brainstem (Vital Reflexes)'];
    svgBody = `
      <path d="M 280 430 C 240 370 240 260 320 200 C 400 140 580 140 680 210 C 760 260 760 380 730 430 C 700 480 620 510 520 510 C 420 510 320 480 280 430 Z" fill="#FCE7F3" stroke="#DB2777" stroke-width="6" />
      <path d="M 360 220 C 420 280 480 210 540 270 C 600 330 660 250 710 300" fill="none" stroke="#F472B6" stroke-width="4" stroke-linecap="round" />
      <path d="M 310 330 C 380 340 420 380 500 350 C 580 320 620 370 690 360" fill="none" stroke="#F472B6" stroke-width="4" stroke-linecap="round" />
      <path d="M 370 420 C 430 400 490 430 570 390 C 630 370 660 410 700 410" fill="none" stroke="#F472B6" stroke-width="4" stroke-linecap="round" />
      <path d="M 640 450 C 720 460 760 520 720 570 C 680 610 600 600 580 550 C 570 510 600 460 640 450 Z" fill="#FBCFE8" stroke="#BE185D" stroke-width="5" />
      <path d="M 520 500 L 530 630 L 470 630 L 480 500 Z" fill="#E2E8F0" stroke="#475569" stroke-width="5" />
      <!-- Leaders -->
      <line x1="330" y1="210" x2="220" y2="160" stroke="#DB2777" stroke-width="2.5" />
      <text x="210" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#831843" text-anchor="end">Frontal Lobe (Executive &amp; Motor)</text>
      <line x1="530" y1="170" x2="530" y2="100" stroke="#DB2777" stroke-width="2.5" />
      <text x="530" y="90" font-family="sans-serif" font-size="14" font-weight="bold" fill="#831843" text-anchor="middle">Parietal Lobe (Somatosensory)</text>
      <line x1="720" y1="290" x2="800" y2="240" stroke="#DB2777" stroke-width="2.5" />
      <text x="810" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#831843">Occipital Lobe (Vision)</text>
      <line x1="680" y1="530" x2="800" y2="540" stroke="#BE185D" stroke-width="2.5" />
      <text x="810" y="545" font-family="sans-serif" font-size="14" font-weight="bold" fill="#831843">Cerebellum (Equilibrium)</text>
      <line x1="500" y1="580" x2="380" y2="600" stroke="#475569" stroke-width="2.5" />
      <text x="370" y="605" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1E293B" text-anchor="end">Brainstem (Pons &amp; Medulla)</text>
    `;
  } else if (p.includes('dna') || p.includes('double helix') || p.includes('nucleotide')) {
    // DNA Double Helix & Base Pairing
    title = 'DNA Molecular Double Helix & Nucleotide Pairing';
    description = 'Antiparallel antipodal sugar-phosphate backbones connected via complementary hydrogen-bonded purine-pyrimidine base pairs.';
    keyConcepts = ['Adenine = Thymine (2 H-Bonds)', 'Guanine ≡ Cytosine (3 H-Bonds)', 'Deoxyribose-Phosphate Backbone', 'Major & Minor Grooves (3.4 nm pitch)'];
    svgBody = `
      <path d="M 380 140 Q 300 240 380 340 T 380 540 T 380 640" fill="none" stroke="#2563EB" stroke-width="8" stroke-linecap="round" />
      <path d="M 620 140 Q 700 240 620 340 T 620 540 T 620 640" fill="none" stroke="#7C3AED" stroke-width="8" stroke-linecap="round" />
      <line x1="340" y1="200" x2="660" y2="200" stroke="#10B981" stroke-width="6" stroke-dasharray="12 4" />
      <text x="500" y="190" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">A = T (2 Hydrogen Bonds)</text>
      <line x1="380" y1="290" x2="620" y2="290" stroke="#F59E0B" stroke-width="7" stroke-dasharray="8 4" />
      <text x="500" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="#B45309" text-anchor="middle">G ≡ C (3 Hydrogen Bonds)</text>
      <line x1="330" y1="390" x2="670" y2="390" stroke="#10B981" stroke-width="6" stroke-dasharray="12 4" />
      <line x1="380" y1="490" x2="620" y2="490" stroke="#F59E0B" stroke-width="7" stroke-dasharray="8 4" />
      <line x1="330" y1="590" x2="670" y2="590" stroke="#10B981" stroke-width="6" stroke-dasharray="12 4" />
      <text x="250" y="220" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1D4ED8" text-anchor="end">5' Phosphate End</text>
      <text x="750" y="220" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6D28D9">3' Hydroxyl End</text>
    `;
  } else if (p.includes('nephron') || p.includes('kidney') || p.includes('renal')) {
    // Nephron Functional Filtration Architecture
    title = 'Nephron Structural & Renal Filtration Unit';
    description = 'Glomerular ultrafiltration through Bowman capsule, proximal and distal convoluted tubules, and Loop of Henle.';
    keyConcepts = ['Bowman Capsule & Glomerulus', 'Proximal Convoluted Tubule (PCT)', 'Loop of Henle (Countercurrent Multiplier)', 'Distal Tubule & Collecting Duct'];
    svgBody = `
      <path d="M 300 220 C 260 220 240 280 240 320 C 240 370 280 400 320 400 C 370 400 400 360 400 320 C 400 270 360 220 300 220 Z" fill="#FFE4E6" stroke="#BE123C" stroke-width="6" />
      <circle cx="310" cy="310" r="40" fill="#FCA5A5" stroke="#DC2626" stroke-width="4" stroke-dasharray="6 3" />
      <text x="310" y="315" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991B1B" text-anchor="middle">Glomerulus</text>
      <path d="M 380 360 C 450 360 460 260 520 260 C 580 260 580 480 600 580 C 620 640 660 640 680 580 C 700 480 720 260 760 260 L 820 260" fill="none" stroke="#F59E0B" stroke-width="12" stroke-linecap="round" />
      <line x1="820" y1="180" x2="820" y2="620" stroke="#D97706" stroke-width="22" stroke-linecap="round" />
      <text x="210" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="#9F1239">Bowman's Capsule</text>
      <text x="470" y="230" font-family="sans-serif" font-size="13" font-weight="bold" fill="#B45309">Proximal Tubule (PCT)</text>
      <text x="640" y="650" font-family="sans-serif" font-size="13" font-weight="bold" fill="#B45309" text-anchor="middle">Loop of Henle</text>
      <text x="840" y="380" font-family="sans-serif" font-size="13" font-weight="bold" fill="#78350F">Collecting Duct</text>
    `;
  } else if (p.includes('benzene') || p.includes('aromatic') || p.includes('chemical') || p.includes('molecule')) {
    // Benzene Ring & Resonance Delocalization
    title = 'Benzene Ring (C₆H₆) Resonance & π-Orbital Hybrid';
    description = 'Planar hexagonal geometry featuring sp² hybridized carbon centers and delocalized aromatic π-electron ring.';
    keyConcepts = ['Hexagonal Carbon Skeleton', 'Planar 120° Bond Angles', 'Delocalized 6π Aromatic Cloud', 'Kekulé Resonance Structures'];
    svgBody = `
      <polygon points="500,180 660,270 660,450 500,540 340,450 340,270" fill="#EDE9FE" stroke="#7C3AED" stroke-width="8" stroke-linejoin="round" />
      <circle cx="500" cy="360" r="110" fill="none" stroke="#8B5CF6" stroke-width="6" stroke-dasharray="14 8" />
      <circle cx="500" cy="180" r="12" fill="#4C1D95" />
      <circle cx="660" cy="270" r="12" fill="#4C1D95" />
      <circle cx="660" cy="450" r="12" fill="#4C1D95" />
      <circle cx="500" cy="540" r="12" fill="#4C1D95" />
      <circle cx="340" cy="450" r="12" fill="#4C1D95" />
      <circle cx="340" cy="270" r="12" fill="#4C1D95" />
      <line x1="500" y1="180" x2="500" y2="120" stroke="#6D28D9" stroke-width="4" />
      <text x="500" y="110" font-family="sans-serif" font-size="16" font-weight="bold" fill="#4C1D95" text-anchor="middle">H</text>
      <text x="500" y="365" font-family="sans-serif" font-size="18" font-weight="bold" fill="#5B21B6" text-anchor="middle">6π Delocalized Ring</text>
      <text x="500" y="395" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6D28D9" text-anchor="middle">Bond Angle: 120°</text>
    `;
  } else if (p.includes('atom') || p.includes('bohr') || p.includes('electron') || p.includes('orbital')) {
    // Bohr Atomic Model & Orbitals
    title = 'Bohr Atomic Model & Quantized Electron Shells';
    description = 'Central proton-neutron nucleus surrounded by discrete, quantized energy level orbits (n = 1, 2, 3).';
    keyConcepts = ['Dense Nuclear Core (p⁺ + n⁰)', 'Quantized Principal Orbitals (n)', 'Photon Absorption & Emission (ΔE = hν)', 'Valence Electron Shell'];
    svgBody = `
      <circle cx="500" cy="360" r="45" fill="#EF4444" stroke="#B91C1C" stroke-width="4" />
      <text x="500" y="365" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Nucleus (6p⁺, 6n⁰)</text>
      <circle cx="500" cy="360" r="110" fill="none" stroke="#3B82F6" stroke-width="3" stroke-dasharray="6 4" />
      <circle cx="500" cy="250" r="9" fill="#1D4ED8" />
      <circle cx="500" cy="470" r="9" fill="#1D4ED8" />
      <text x="580" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1D4ED8">n = 1 (K Shell)</text>
      <circle cx="500" cy="360" r="200" fill="none" stroke="#10B981" stroke-width="3" stroke-dasharray="8 5" />
      <circle cx="300" cy="360" r="9" fill="#047857" />
      <circle cx="700" cy="360" r="9" fill="#047857" />
      <circle cx="500" cy="160" r="9" fill="#047857" />
      <circle cx="500" cy="560" r="9" fill="#047857" />
      <text x="670" y="220" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857">n = 2 (Valence Shell)</text>
    `;
  } else if (p.includes('tree') || p.includes('binary') || p.includes('bst')) {
    // Binary Search Tree (BST)
    title = 'Binary Search Tree (BST) Data Structure';
    description = 'Hierarchical sorted tree node topology where left child < root < right child with O(log n) average search complexity.';
    keyConcepts = ['Root Node', 'Left Subtree (< Key)', 'Right Subtree (> Key)', 'In-Order Traversal (Sorted Order)'];
    svgBody = `
      <circle cx="500" cy="180" r="35" fill="#EEF2FF" stroke="#4F46E5" stroke-width="5" />
      <text x="500" y="186" font-family="sans-serif" font-size="18" font-weight="bold" fill="#312E81" text-anchor="middle">50</text>
      <line x1="475" y1="205" x2="365" y2="285" stroke="#6366F1" stroke-width="4" marker-end="url(#blue-arrow)" />
      <circle cx="340" cy="310" r="32" fill="#F0FDF4" stroke="#16A34A" stroke-width="4" />
      <text x="340" y="316" font-family="sans-serif" font-size="16" font-weight="bold" fill="#14532D" text-anchor="middle">30</text>
      <line x1="525" y1="205" x2="635" y2="285" stroke="#6366F1" stroke-width="4" marker-end="url(#blue-arrow)" />
      <circle cx="660" cy="310" r="32" fill="#FEF3C7" stroke="#D97706" stroke-width="4" />
      <text x="660" y="316" font-family="sans-serif" font-size="16" font-weight="bold" fill="#78350F" text-anchor="middle">70</text>
      <line x1="320" y1="335" x2="250" y2="425" stroke="#6366F1" stroke-width="3" />
      <circle cx="230" cy="450" r="28" fill="#F0FDF4" stroke="#16A34A" stroke-width="3" />
      <text x="230" y="455" font-family="sans-serif" font-size="15" font-weight="bold" fill="#14532D" text-anchor="middle">20</text>
      <line x1="360" y1="335" x2="430" y2="425" stroke="#6366F1" stroke-width="3" />
      <circle cx="450" cy="450" r="28" fill="#F0FDF4" stroke="#16A34A" stroke-width="3" />
      <text x="450" y="455" font-family="sans-serif" font-size="15" font-weight="bold" fill="#14532D" text-anchor="middle">40</text>
      <line x1="680" y1="335" x2="750" y2="425" stroke="#6366F1" stroke-width="3" />
      <circle cx="770" cy="450" r="28" fill="#FEF3C7" stroke="#D97706" stroke-width="3" />
      <text x="770" y="455" font-family="sans-serif" font-size="15" font-weight="bold" fill="#78350F" text-anchor="middle">85</text>
      <text x="500" y="550" font-family="sans-serif" font-size="15" font-weight="bold" fill="#4338CA" text-anchor="middle">BST Property: Left &lt; Root &lt; Right</text>
    `;
  } else if (p.includes('engine') || p.includes('four-stroke') || p.includes('stroke') || p.includes('piston')) {
    // Four-Stroke Internal Combustion Engine
    title = 'Four-Stroke Internal Combustion Cycle';
    description = 'Thermodynamic Otto cycle illustrating Intake, Compression, Power (Combustion), and Exhaust strokes.';
    keyConcepts = ['1. Intake Stroke (Fuel-Air Mix)', '2. Compression Stroke (Adiabatic)', '3. Power Stroke (Spark Ignition)', '4. Exhaust Stroke (Scavenging)'];
    svgBody = `
      <rect x="120" y="240" width="140" height="220" rx="6" fill="#F8FAFC" stroke="#334155" stroke-width="4" />
      <rect x="135" y="340" width="110" height="60" fill="#94A3B8" stroke="#475569" stroke-width="3" />
      <text x="190" y="490" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A" text-anchor="middle">1. Intake</text>
      <rect x="320" y="240" width="140" height="220" rx="6" fill="#F8FAFC" stroke="#334155" stroke-width="4" />
      <rect x="335" y="260" width="110" height="60" fill="#94A3B8" stroke="#475569" stroke-width="3" />
      <text x="390" y="490" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A" text-anchor="middle">2. Compression</text>
      <rect x="520" y="240" width="140" height="220" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="5" />
      <circle cx="590" cy="245" r="16" fill="#FBBF24" />
      <rect x="535" y="320" width="110" height="60" fill="#F87171" stroke="#DC2626" stroke-width="3" />
      <text x="590" y="490" font-family="sans-serif" font-size="14" font-weight="bold" fill="#B91C1C" text-anchor="middle">3. Power (Spark)</text>
      <rect x="720" y="240" width="140" height="220" rx="6" fill="#F8FAFC" stroke="#334155" stroke-width="4" />
      <rect x="735" y="260" width="110" height="60" fill="#94A3B8" stroke="#475569" stroke-width="3" />
      <text x="790" y="490" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A" text-anchor="middle">4. Exhaust</text>
    `;
  } else if (p.includes('plant cell') || p.includes('cell')) {
    // Plant / Eukaryotic Cell Structure
    title = p.includes('plant') ? 'Plant Cell Structural Cytology & Organelles' : 'Eukaryotic Cell Internal Architecture';
    description = 'Detailed micro-structural illustration showing cell membrane, nucleus, organelles, and cytosol.';
    keyConcepts = ['Cell Wall & Cellulose Membrane', 'Central Turgor Vacuole', 'Chloroplasts (Photosynthesis)', 'Mitochondria (ATP Cellular Respiration)', 'Nucleus & Genetic Chromatin'];
    svgBody = `
      <rect x="250" y="180" width="500" height="420" rx="40" fill="#DCFCE7" stroke="#16A34A" stroke-width="8" />
      <rect x="265" y="195" width="470" height="390" rx="30" fill="#F0FDF4" stroke="#22C55E" stroke-width="4" />
      <ellipse cx="440" cy="380" rx="140" ry="110" fill="#CFFAFE" stroke="#06B6D4" stroke-width="4" opacity="0.8" />
      <text x="440" y="385" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0891B2" text-anchor="middle">Central Vacuole (Turgor Pressure)</text>
      <circle cx="620" cy="290" r="55" fill="#EDE9FE" stroke="#7C3AED" stroke-width="5" />
      <circle cx="620" cy="290" r="24" fill="#8B5CF6" />
      <text x="620" y="370" font-family="sans-serif" font-size="13" font-weight="bold" fill="#5B21B6" text-anchor="middle">Nucleus &amp; DNA</text>
      <ellipse cx="320" cy="270" rx="40" ry="22" fill="#BBF7D0" stroke="#15803D" stroke-width="3" />
      <ellipse cx="640" cy="480" rx="42" ry="24" fill="#FED7AA" stroke="#EA580C" stroke-width="3" />
      <text x="640" y="525" font-family="sans-serif" font-size="12" font-weight="bold" fill="#C2410C" text-anchor="middle">Mitochondrion (ATP)</text>
      <line x1="250" y1="210" x2="160" y2="180" stroke="#16A34A" stroke-width="2.5" />
      <text x="150" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#14532D" text-anchor="end">Cell Wall (Cellulose)</text>
      <line x1="320" y1="250" x2="220" y2="240" stroke="#15803D" stroke-width="2.5" />
      <text x="210" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#14532D" text-anchor="end">Chloroplast</text>
    `;
  } else if (p.includes('projectile') || p.includes('motion') || p.includes('trajectory')) {
    // 2D Projectile Motion & Kinematics
    title = '2D Projectile Motion & Kinematic Vector Trajectory';
    description = 'Parabolic coordinate motion showing velocity vectors, apex height, and landing range.';
    keyConcepts = ['Initial Launch Angle θ', 'Apex (vy = 0)', 'Maximum Height (H_max)', 'Horizontal Range (R)', 'Velocity Decomposition (v₀x, v₀y)'];
    svgBody = `
      <line x1="240" y1="540" x2="780" y2="540" stroke="#0F172A" stroke-width="4" />
      <line x1="240" y1="540" x2="240" y2="160" stroke="#0F172A" stroke-width="4" />
      <text x="785" y="545" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A">x (Range R)</text>
      <text x="235" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0F172A" text-anchor="middle">y (Height H)</text>
      <path d="M 240 540 Q 500 180 740 540" fill="none" stroke="#D97706" stroke-width="6" stroke-dasharray="10 5" />
      <line x1="240" y1="540" x2="350" y2="400" stroke="#2563EB" stroke-width="5" marker-end="url(#blue-arrow)" />
      <text x="360" y="395" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1D4ED8">v₀ (Launch)</text>
      <line x1="240" y1="540" x2="350" y2="540" stroke="#0284C7" stroke-width="3" stroke-dasharray="4 3" />
      <text x="300" y="565" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0369A1">v₀ₓ = v₀ cos θ</text>
      <circle cx="490" cy="360" r="8" fill="#DC2626" />
      <line x1="490" y1="360" x2="570" y2="360" stroke="#2563EB" stroke-width="4" marker-end="url(#blue-arrow)" />
      <text x="580" y="365" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1D4ED8">vₓ (vy = 0)</text>
      <line x1="490" y1="360" x2="490" y2="540" stroke="#DC2626" stroke-width="2" stroke-dasharray="4 4" />
      <text x="480" y="460" font-family="sans-serif" font-size="13" font-weight="bold" fill="#B91C1C" text-anchor="end">H_max</text>
      <circle cx="740" cy="540" r="8" fill="#16A34A" />
      <text x="740" y="575" font-family="sans-serif" font-size="13" font-weight="bold" fill="#15803D" text-anchor="middle">Landing (t = T_flight)</text>
    `;
  } else {
    // Topic-Grounded Concept Model (Never an empty or broken diagram)
    title = `${escapeSvgText(prompt)} — System Architecture`;
    description = `Scientific and analytical breakdown for "${prompt}".`;
    keyConcepts = ['Theoretical Principles', 'System Core Dynamics', 'Governing Laws & Equations', 'Applied Outcomes'];
    svgBody = `
      <rect x="340" y="280" width="320" height="120" rx="20" fill="#EEF2FF" stroke="#4F46E5" stroke-width="5" />
      <text x="500" y="335" font-family="sans-serif" font-size="18" font-weight="bold" fill="#312E81" text-anchor="middle">${escapeSvgText(prompt.slice(0, 26))}</text>
      <text x="500" y="370" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6366F1" text-anchor="middle">Central Academic Mechanism</text>
      <rect x="160" y="160" width="220" height="75" rx="14" fill="#F0FDF4" stroke="#16A34A" stroke-width="3" />
      <text x="270" y="202" font-family="sans-serif" font-size="13" font-weight="bold" fill="#14532D" text-anchor="middle">Governing Principles</text>
      <line x1="330" y1="235" x2="400" y2="280" stroke="#4F46E5" stroke-width="3" />
      <rect x="620" y="160" width="220" height="75" rx="14" fill="#FEF3C7" stroke="#D97706" stroke-width="3" />
      <text x="730" y="202" font-family="sans-serif" font-size="13" font-weight="bold" fill="#78350F" text-anchor="middle">Analytical Framework</text>
      <line x1="670" y1="235" x2="600" y2="280" stroke="#4F46E5" stroke-width="3" />
      <rect x="160" y="470" width="220" height="75" rx="14" fill="#FCE7F3" stroke="#DB2777" stroke-width="3" />
      <text x="270" y="512" font-family="sans-serif" font-size="13" font-weight="bold" fill="#831843" text-anchor="middle">Empirical Observations</text>
      <line x1="330" y1="470" x2="400" y2="400" stroke="#4F46E5" stroke-width="3" />
      <rect x="620" y="470" width="220" height="75" rx="14" fill="#CFFAFE" stroke="#0891B2" stroke-width="3" />
      <text x="730" y="512" font-family="sans-serif" font-size="13" font-weight="bold" fill="#164E63" text-anchor="middle">Field Applications</text>
      <line x1="670" y1="470" x2="600" y2="400" stroke="#4F46E5" stroke-width="3" />
    `;
  }

  const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="100%" height="100%">
  <defs>
    <marker id="blue-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
    </marker>
  </defs>
  <rect width="1000" height="700" fill="#F8FAFC" />
  <rect x="40" y="25" width="920" height="60" rx="14" fill="#0C373D" />
  <text x="65" y="60" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">${escapeSvgText(title)}</text>
  <rect x="830" y="40" width="110" height="28" rx="14" fill="#5AA7A7" />
  <text x="885" y="58" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0C373D" text-anchor="middle">${escapeSvgText(subject)}</text>
  ${svgBody}
</svg>`;

  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;

  return {
    imageUrl: svgDataUrl,
    title,
    description,
    subject,
    style: 'diagram',
    keyConcepts,
  };
}
