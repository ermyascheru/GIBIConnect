import { ETHIOPIAN_INSTITUTIONS } from '../data/mockInstitutions';
import type { Institution } from '../types/institution';

/**
 * Exhaustive UUID-to-ID mapping matching backend PostgreSQL seed records
 */
const DATABASE_UUID_MAP: Record<string, string> = {
  '00000000-0000-4000-8000-000000000001': 'aau-001',   // Addis Ababa University
  '00000000-0000-4000-8000-000000000002': 'bdu-004',   // Bahir Dar University
  '00000000-0000-4000-8000-000000000003': 'uog-008',   // University of Gondar
  '00000000-0000-4000-8000-000000000004': 'ju-005',    // Jimma University
  '00000000-0000-4000-8000-000000000005': 'hu-006',    // Hawassa University
  '00000000-0000-4000-8000-000000000006': 'mu-007',    // Mekelle University
  '00000000-0000-4000-8000-000000000007': 'amu-009',   // Arba Minch University
  '00000000-0000-4000-8000-000000000008': 'astu-002',  // Adama Science & Technology University
  '00000000-0000-4000-8000-000000000009': 'smu-017',   // St. Mary's University
  '00000000-0000-4000-8000-000000000010': 'aamc-022',  // Addis Ababa Medical and Business College / Tikur Anbessa
  '00000000-0000-4000-8000-000000000011': 'hru-010',   // Haramaya University
  '00000000-0000-4000-8000-000000000012': 'wsu-015',   // Wolaita Sodo University
  '00000000-0000-4000-8000-000000000013': 'dbu-014',   // Debre Berhan University
  '00000000-0000-4000-8000-000000000014': 'dmu-013',   // Debre Markos University
  '00000000-0000-4000-8000-000000000015': 'ddu-021',   // Dire Dawa University
  '00000000-0000-4000-8000-000000000016': 'du-011',    // Dilla University
  '00000000-0000-4000-8000-000000000017': 'ambo-020',  // Ambo University
  '00000000-0000-4000-8000-000000000018': 'wku-023',   // Wolkite University
};

/**
 * Aliases, slugs, and common spelling typos for all 23 indexed institutions
 */
export const INSTITUTION_ALIASES: Record<string, string[]> = {
  // Addis Ababa Science and Technology University (AASTU) - Listed first among tech unis
  'aastu-003': [
    'aastu', 'aastu-003', 'addis ababa science and technology university',
    'addis ababa science and techonology university', 'addis ababa science and technology',
    'addis ababa science and techonology', 'addis ababa science', 'addis-ababa-science-and-technology-university',
    'kilinto', 'kilinto campus', 'aastu tech'
  ],
  // Adama Science and Technology University (ASTU)
  'astu-002': [
    'astu', 'astu-002', 'adama science and technology university',
    'adama science and techonology university', 'adama science and technology',
    'adama science and tech', 'adama science', 'adama tech', 'adama university',
    'adama-science-and-technology-university', 'adama'
  ],
  // Arba Minch University (AMU)
  'amu-009': [
    'amu', 'amu-009', 'arba minch', 'arbaminch', 'arba-minch', 'arba minch university',
    'arba-minch-university', 'awti', 'water technology institute'
  ],
  // Debre Markos University (DMU)
  'dmu-013': [
    'dmu', 'dmu-013', 'debre markos', 'debremarkos', 'derbre markos', 'derbremarkos',
    'debre markos university', 'derbre markos university', 'debre-markos-university'
  ],
  // Dire Dawa University (DDU)
  'ddu-021': [
    'ddu', 'ddu-021', 'dire dawa', 'diredawa', 'dira dewa', 'dira dawa',
    'dire dawa university', 'dira dewa university', 'dira dawa university', 'dire-dawa-university'
  ],
  // Dilla University (DU)
  'du-011': [
    'du', 'du-011', 'dilla', 'dilla university', 'dilla-university'
  ],
  // Haramaya University (HRU / hru-010 / hu-010)
  'hru-010': [
    'hru', 'hru-010', 'hu-010', 'haramaya', 'almaya', 'haramaya university', 'haramaya-university', 'hiwot fana'
  ],
  // Hawassa University (HU)
  'hu-006': [
    'hu', 'hu-006', 'hawassa', 'awassa', 'hawassa university', 'hawassa-university', 'wondo genet'
  ],
  // Mekelle University (MU)
  'mu-007': [
    'mu', 'mu-007', 'mekelle', 'mekele', 'meqele', 'mekelle university', 'mekele university',
    'mekelle-university', 'mekele-university', 'tigray university', 'ayder', 'ayder hospital', 'mit'
  ],
  // University of Gondar (UoG)
  'uog-008': [
    'uog', 'uog-008', 'gondar', 'goder', 'gonder', 'university of gondar', 'gondar university',
    'goder university', 'gonder university', 'university-of-gondar', 'gondar-university', 'maraki', 'teda', 'atse fasil'
  ],
  // Addis Ababa Medical College (Tikur Anbessa)
  'aamc-022': [
    'aamc', 'aamc-022', 'addis ababa medical', 'addis ababa medical college', 'addis abeba medical collage',
    'addis ababa medical collage', 'addis ababa medical and business college',
    'addis-ababa-medical-and-business-college', 'addis-ababa-medical-college', 'tikur anbessa medical',
    'black lion medical', 'black lion hospital', 'tikur anbessa chs', 'tikur anbessa'
  ],
  // Wolkite University (WKU)
  'wku-023': [
    'wku', 'wku-023', 'wolkite', 'welkite', 'wolkita', 'wolkite university', 'welkite university',
    'wolkita university', 'wolkite-university', 'welkite-university', 'gubre', 'gubiot'
  ],
  // Addis Ababa University (AAU)
  'aau-001': [
    'aau', 'aau-001', 'addis ababa university', 'addis-ababa-university', 'addis abeba university',
    'aait', '5 kilo', '4 kilo', 'sidist kilo', 'sedist kilo', 'arat kilo'
  ],
  // Bahir Dar University (BDU)
  'bdu-004': [
    'bdu', 'bdu-004', 'bahir dar', 'bahirdar', 'bahr dar', 'bahir-dar', 'bahir dar university',
    'bahir-dar-university', 'bit', 'eitex', 'tibebe ghion', 'poly'
  ],
  // Jimma University (JU)
  'ju-005': [
    'ju', 'ju-005', 'jimma', 'jima', 'jimma university', 'jimma-university', 'kito furdisa', 'jush', 'jucavm'
  ],
  // Wollo University (WU)
  'wu-012': [
    'wu', 'wu-012', 'wollo', 'wollo university', 'wollo-university', 'kombolcha', 'dessie', 'kiot'
  ],
  // Debre Berhan University (DBU)
  'dbu-014': [
    'dbu', 'dbu-014', 'debre berhan', 'debreberhan', 'debre berhan university', 'debre-berhan-university'
  ],
  // Wolaita Sodo University (WSU)
  'wsu-015': [
    'wsu', 'wsu-015', 'wolaita sodo', 'wolaita', 'sodo', 'wolaita sodo university', 'wolaita-sodo-university'
  ],
  // Wachemo University (WCU)
  'wcu-016': [
    'wcu', 'wcu-016', 'wachemo', 'hossana', 'hosanna', 'wachemo university', 'wachemo-university'
  ],
  // St. Mary's University (SMU)
  'smu-017': [
    'smu', 'smu-017', 'st mary', 'st. mary', 'saint mary', "st. mary's university", 'st-marys-university'
  ],
  // Rift Valley University (RVU)
  'rvu-018': [
    'rvu', 'rvu-018', 'rift valley', 'rift valley university', 'rift-valley-university'
  ],
  // Unity University (UNITY)
  'unity-019': [
    'unity', 'unity-019', 'unity university', 'unity-university', 'gerji'
  ],
  // Ambo University (AMBO)
  'ambo-020': [
    'ambo', 'ambo-020', 'ambo university', 'ambo-university', 'awaro'
  ],
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Universal resolver for Ethiopian institutions.
 * Resolves canonical IDs, codes, database UUIDs, URL slugs, and common spelling variations.
 */
export function resolveInstitution(rawIdentifier: string | undefined | null): Institution {
  if (!rawIdentifier || typeof rawIdentifier !== 'string') {
    return ETHIOPIAN_INSTITUTIONS[0]; // AAU safe default
  }

  const clean = rawIdentifier
    .replace(/^#\/?/, '')
    .replace(/^campuses?\//i, '')
    .trim()
    .toLowerCase();

  if (!clean) {
    return ETHIOPIAN_INSTITUTIONS[0];
  }

  // 1. Database UUID lookup
  if (DATABASE_UUID_MAP[clean]) {
    const targetId = DATABASE_UUID_MAP[clean];
    const found = ETHIOPIAN_INSTITUTIONS.find(
      (inst) => inst.id === targetId || (targetId === 'hru-010' && inst.code === 'HRU')
    );
    if (found) return found;
  }

  // 2. Direct ID or Code exact match (case-insensitive)
  const direct = ETHIOPIAN_INSTITUTIONS.find(
    (inst) =>
      inst.id.toLowerCase() === clean ||
      inst.code.toLowerCase() === clean ||
      (clean === 'hu-010' && inst.code === 'HRU') ||
      (clean === 'hru-010' && inst.code === 'HRU')
  );
  if (direct) return direct;

  // 3. Short prefix match (e.g. "mu-007" -> "mu", "uog-008" -> "uog")
  const prefixMatch = ETHIOPIAN_INSTITUTIONS.find(
    (inst) => inst.id.replace(/-\d+$/, '').toLowerCase() === clean
  );
  if (prefixMatch) return prefixMatch;

  // 4. Flatten all aliases with their targetId, sorted by alias string length DESCENDING.
  // This guarantees longer phrases (e.g. "addis ababa science and technology university")
  // and multi-letter acronyms (e.g. "aastu", "amu", "dmu", "ddu", "hru")
  // are ALWAYS evaluated before shorter substrings (e.g. "astu", "mu", "du", "hu").
  const allEntries: { alias: string; targetId: string }[] = [];
  for (const [targetId, aliases] of Object.entries(INSTITUTION_ALIASES)) {
    for (const alias of aliases) {
      allEntries.push({ alias: alias.toLowerCase(), targetId });
    }
  }
  allEntries.sort((a, b) => b.alias.length - a.alias.length);

  const normalizedClean = clean.replace(/-/g, ' ');

  // Phase 4a: Exact alias match
  for (const item of allEntries) {
    if (clean === item.alias || normalizedClean === item.alias) {
      const found = ETHIOPIAN_INSTITUTIONS.find(
        (inst) => inst.id === item.targetId || (item.targetId === 'hru-010' && inst.code === 'HRU')
      );
      if (found) return found;
    }
  }

  // Phase 4b: Word-boundary match (prevents 'amu' from matching 'mu', 'ddu' from matching 'du', etc.)
  for (const item of allEntries) {
    const escaped = escapeRegExp(item.alias);
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(clean) || regex.test(normalizedClean)) {
      const found = ETHIOPIAN_INSTITUTIONS.find(
        (inst) => inst.id === item.targetId || (item.targetId === 'hru-010' && inst.code === 'HRU')
      );
      if (found) return found;
    }
  }

  // 5. Slug match by converting English name
  const slugMatch = ETHIOPIAN_INSTITUTIONS.find((inst) => {
    const generatedSlug = inst.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return generatedSlug === clean || clean === generatedSlug.replace(/-/g, ' ');
  });
  if (slugMatch) return slugMatch;

  // 6. Name or City word-boundary match
  for (const inst of ETHIOPIAN_INSTITUTIONS) {
    const instName = inst.nameEn.toLowerCase();
    const instCity = inst.city.toLowerCase();
    if (clean.includes(instName) || instName.includes(clean)) {
      return inst;
    }
    const cityRegex = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(instCity)}(?:$|[^a-z0-9])`, 'i');
    if (cityRegex.test(clean)) {
      return inst;
    }
  }

  // Fallback to first institution (AAU)
  return ETHIOPIAN_INSTITUTIONS[0];
}

/**
 * Check if a query matches an institution for search filtering
 */
export function matchesInstitution(inst: Institution, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();

  // Direct attribute match
  if (
    inst.nameEn.toLowerCase().includes(q) ||
    inst.code.toLowerCase() === q ||
    inst.city.toLowerCase().includes(q) ||
    inst.region.toLowerCase().includes(q) ||
    (inst.overview && inst.overview.toLowerCase().includes(q))
  ) {
    return true;
  }

  // Check alias / typo matches with length & word boundaries
  const targetKey = inst.id === 'hru-010' ? 'hru-010' : inst.id;
  const aliases = INSTITUTION_ALIASES[targetKey] || INSTITUTION_ALIASES['hru-010'] || [];
  for (const alias of aliases) {
    if (alias === q) return true;
    if (alias.length >= 4 && (alias.includes(q) || q.includes(alias))) return true;
    const regex = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(alias)}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(q)) return true;
  }

  return false;
}
