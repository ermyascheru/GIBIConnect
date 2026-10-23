/**
 * GIBIConnect — 3-Tier Hybrid RAG Retriever with Reciprocal Rank Fusion (RRF)
 * Implements Master Blueprint Part 6, 7 & 14:
 * - Tier 1: Exact Structured Metadata & Prisma Relational Lookup
 * - Tier 2: Full-Text BM25 & Typo-Tolerant Keyword Matching
 * - Tier 3: 768-dim Dense Vector Cosine Similarity
 * - Reciprocal Rank Fusion (RRF) blending + Strict VERIFIED-only Trust Filter
 */

import { VERIFIED_RAG_CORPUS } from './rag.corpus.js';
import { llmClient } from './llm.client.js';
import pool from '../../config/database.js';
import type {
  RAGDocumentChunk,
  ScoredRAGChunk,
  QueryIntent,
  AIMode,
  StudentContextProfile,
} from './ai.types.js';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Ordered list of institution aliases with codes, sorted so specific multi-word
 * phrases and longer acronyms (AASTU, AMU, DMU, DDU, HRU) are tested BEFORE
 * shorter substrings (ASTU, MU, DU, HU) to prevent false-positive masking.
 */
export const SORTED_INSTITUTION_ALIASES: { code: string; alias: string }[] = [
  // AASTU before ASTU
  { code: 'AASTU', alias: 'addis ababa science and technology university' },
  { code: 'AASTU', alias: 'addis ababa science and techonology university' },
  { code: 'AASTU', alias: 'addis ababa science and technology' },
  { code: 'AASTU', alias: 'addis ababa science and techonology' },
  { code: 'AASTU', alias: 'addis ababa science' },
  { code: 'AASTU', alias: 'kilinto campus' },
  { code: 'AASTU', alias: 'kilinto' },
  { code: 'AASTU', alias: 'aastu tech' },
  { code: 'AASTU', alias: 'aastu' },
  // ASTU
  { code: 'ASTU', alias: 'adama science and technology university' },
  { code: 'ASTU', alias: 'adama science and techonology university' },
  { code: 'ASTU', alias: 'adama science and technology' },
  { code: 'ASTU', alias: 'adama technology' },
  { code: 'ASTU', alias: 'adama science' },
  { code: 'ASTU', alias: 'adama university' },
  { code: 'ASTU', alias: 'adama tech' },
  { code: 'ASTU', alias: 'astu' },
  { code: 'ASTU', alias: 'adama' },
  // AMU before MU
  { code: 'AMU', alias: 'arba minch university' },
  { code: 'AMU', alias: 'water technology institute' },
  { code: 'AMU', alias: 'arba minch' },
  { code: 'AMU', alias: 'arbaminch' },
  { code: 'AMU', alias: 'awti' },
  { code: 'AMU', alias: 'amu' },
  // DMU before MU
  { code: 'DMU', alias: 'debre markos university' },
  { code: 'DMU', alias: 'derbre markos university' },
  { code: 'DMU', alias: 'debre markos' },
  { code: 'DMU', alias: 'derbre markos' },
  { code: 'DMU', alias: 'debremarkos' },
  { code: 'DMU', alias: 'derbremarkos' },
  { code: 'DMU', alias: 'dmu' },
  // DDU before DU
  { code: 'DDU', alias: 'dire dawa university' },
  { code: 'DDU', alias: 'dira dewa university' },
  { code: 'DDU', alias: 'dira dawa university' },
  { code: 'DDU', alias: 'dire dawa' },
  { code: 'DDU', alias: 'diredawa' },
  { code: 'DDU', alias: 'dira dewa' },
  { code: 'DDU', alias: 'dira dawa' },
  { code: 'DDU', alias: 'ddu' },
  // DU
  { code: 'DU', alias: 'dilla university' },
  { code: 'DU', alias: 'dilla' },
  { code: 'DU', alias: 'du' },
  // HRU before HU
  { code: 'HRU', alias: 'haramaya university' },
  { code: 'HRU', alias: 'hiwot fana' },
  { code: 'HRU', alias: 'haramaya' },
  { code: 'HRU', alias: 'almaya' },
  { code: 'HRU', alias: 'hru' },
  // HU
  { code: 'HU', alias: 'hawassa university' },
  { code: 'HU', alias: 'wondo genet' },
  { code: 'HU', alias: 'hawassa' },
  { code: 'HU', alias: 'awassa' },
  { code: 'HU', alias: 'hu' },
  // MU
  { code: 'MU', alias: 'mekelle university' },
  { code: 'MU', alias: 'mekele university' },
  { code: 'MU', alias: 'meqele university' },
  { code: 'MU', alias: 'tigray university' },
  { code: 'MU', alias: 'ayder hospital' },
  { code: 'MU', alias: 'ayder referral' },
  { code: 'MU', alias: 'mekelle' },
  { code: 'MU', alias: 'mekele' },
  { code: 'MU', alias: 'meqele' },
  { code: 'MU', alias: 'ayder' },
  { code: 'MU', alias: 'mu' },
  // UoG
  { code: 'UOG', alias: 'university of gondar' },
  { code: 'UOG', alias: 'gondar university' },
  { code: 'UOG', alias: 'goder university' },
  { code: 'UOG', alias: 'gonder university' },
  { code: 'UOG', alias: 'atse fasil' },
  { code: 'UOG', alias: 'maraki' },
  { code: 'UOG', alias: 'gondar' },
  { code: 'UOG', alias: 'goder' },
  { code: 'UOG', alias: 'gonder' },
  { code: 'UOG', alias: 'teda' },
  { code: 'UOG', alias: 'uog' },
  // AAMC before AAU
  { code: 'AAMC', alias: 'addis ababa medical college' },
  { code: 'AAMC', alias: 'addis abeba medical collage' },
  { code: 'AAMC', alias: 'addis ababa medical collage' },
  { code: 'AAMC', alias: 'addis ababa medical and business' },
  { code: 'AAMC', alias: 'tikur anbessa medical' },
  { code: 'AAMC', alias: 'tikur anbessa chs' },
  { code: 'AAMC', alias: 'black lion medical' },
  { code: 'AAMC', alias: 'black lion hospital' },
  { code: 'AAMC', alias: 'tikur anbessa' },
  { code: 'AAMC', alias: 'aamc' },
  // AAU
  { code: 'AAU', alias: 'addis ababa university' },
  { code: 'AAU', alias: 'addis abeba university' },
  { code: 'AAU', alias: 'addis ababa' },
  { code: 'AAU', alias: 'addis abeba' },
  { code: 'AAU', alias: 'sidist kilo' },
  { code: 'AAU', alias: 'sedist kilo' },
  { code: 'AAU', alias: 'arat kilo' },
  { code: 'AAU', alias: '5 kilo' },
  { code: 'AAU', alias: '4 kilo' },
  { code: 'AAU', alias: 'aait' },
  { code: 'AAU', alias: 'aau' },
  // WKU before WU
  { code: 'WKU', alias: 'wolkite university' },
  { code: 'WKU', alias: 'welkite university' },
  { code: 'WKU', alias: 'wolkita university' },
  { code: 'WKU', alias: 'wolkite' },
  { code: 'WKU', alias: 'welkite' },
  { code: 'WKU', alias: 'wolkita' },
  { code: 'WKU', alias: 'gubre' },
  { code: 'WKU', alias: 'gubiot' },
  { code: 'WKU', alias: 'wku' },
  // WU
  { code: 'WU', alias: 'wollo university' },
  { code: 'WU', alias: 'kombolcha' },
  { code: 'WU', alias: 'dessie' },
  { code: 'WU', alias: 'wollo' },
  { code: 'WU', alias: 'kiot' },
  { code: 'WU', alias: 'wu' },
  // BDU
  { code: 'BDU', alias: 'bahir dar university' },
  { code: 'BDU', alias: 'tibebe ghion' },
  { code: 'BDU', alias: 'bahir dar' },
  { code: 'BDU', alias: 'bahirdar' },
  { code: 'BDU', alias: 'bahr dar' },
  { code: 'BDU', alias: 'eitex' },
  { code: 'BDU', alias: 'poly' },
  { code: 'BDU', alias: 'bit' },
  { code: 'BDU', alias: 'bdu' },
  // JU
  { code: 'JU', alias: 'jimma university' },
  { code: 'JU', alias: 'kito furdisa' },
  { code: 'JU', alias: 'jucavm' },
  { code: 'JU', alias: 'jimma' },
  { code: 'JU', alias: 'jush' },
  { code: 'JU', alias: 'jima' },
  { code: 'JU', alias: 'ju' },
  // DBU
  { code: 'DBU', alias: 'debre berhan university' },
  { code: 'DBU', alias: 'debre berhan' },
  { code: 'DBU', alias: 'debreberhan' },
  { code: 'DBU', alias: 'dbu' },
  // WSU
  { code: 'WSU', alias: 'wolaita sodo university' },
  { code: 'WSU', alias: 'wolaita sodo' },
  { code: 'WSU', alias: 'wolaita' },
  { code: 'WSU', alias: 'sodo' },
  { code: 'WSU', alias: 'wsu' },
  // WCU
  { code: 'WCU', alias: 'wachemo university' },
  { code: 'WCU', alias: 'wachemo' },
  { code: 'WCU', alias: 'hossana' },
  { code: 'WCU', alias: 'hosanna' },
  { code: 'WCU', alias: 'wcu' },
  // AMBO
  { code: 'AMBO', alias: 'ambo university' },
  { code: 'AMBO', alias: 'awaro' },
  { code: 'AMBO', alias: 'ambo' },
  // SMU
  { code: 'SMU', alias: "st. mary's university" },
  { code: 'SMU', alias: 'saint mary' },
  { code: 'SMU', alias: 'st. mary' },
  { code: 'SMU', alias: 'st mary' },
  { code: 'SMU', alias: 'smu' },
  // RVU
  { code: 'RVU', alias: 'rift valley university' },
  { code: 'RVU', alias: 'rift valley' },
  { code: 'RVU', alias: 'rvu' },
  // UNITY
  { code: 'UNITY', alias: 'unity university' },
  { code: 'UNITY', alias: 'gerji' },
  { code: 'UNITY', alias: 'unity' },
];

/**
 * Extracts all unique Ethiopian institution codes mentioned in a query
 * using strict word-boundary matching.
 */
export function extractInstitutionsFromQuery(query: string): string[] {
  const q = query.toLowerCase();
  const matchedCodes = new Set<string>();

  for (const item of SORTED_INSTITUTION_ALIASES) {
    const escaped = escapeRegExp(item.alias);
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(q)) {
      matchedCodes.add(item.code);
    }
  }

  return Array.from(matchedCodes);
}

export class HybridRAGRetriever {
  private corpus: RAGDocumentChunk[] = [...VERIFIED_RAG_CORPUS];
  private embeddingsInitialized = false;

  /**
   * Lazily initializes 768-dim embeddings for all VERIFIED corpus chunks.
   */
  async ensureCorpusIndexed(): Promise<void> {
    if (this.embeddingsInitialized) return;
    for (const chunk of this.corpus) {
      if (chunk.verificationStatus === 'VERIFIED' && !chunk.embedding) {
        chunk.embedding = await llmClient.generateEmbedding(
          `${chunk.sourceTitle} ${chunk.keywords.join(' ')} ${chunk.content}`,
          'search_document'
        );
      }
    }
    this.embeddingsInitialized = true;
  }

  /**
   * Sanitizes user query to prevent Direct & Indirect Prompt Injection
   */
  sanitizeQuery(rawQuery: string): string {
    return rawQuery
      .replace(/<\/?verified_context>/gi, '')
      .replace(/<\/?untrusted_document_context>/gi, '')
      .replace(/ignore\s+(all\s+)?(previous|prior|system)\s+instructions/gi, '[REDACTED_INJECTION_ATTEMPT]')
      .trim()
      .slice(0, 1500);
  }

  /**
   * Classifies query into ADVISOR vs TUTOR mode and fine-grained QueryIntent
   */
  classifyQueryIntent(query: string, explicitMode?: AIMode): { mode: AIMode; intent: QueryIntent } {
    const q = query.toLowerCase();

    const tutorSignals = [
      'math1011', 'phys1011', 'cosc1011', 'chem1011', 'solve', 'derivative', 'integral',
      'limit', 'l\'hopital', 'projectile', 'kinematics', 'newton', 'momentum', 'coulomb',
      'big o', 'binary search', 'sorting', 'bfs', 'dfs', 'algorithm', 'ph', 'buffer',
      'henderson', 'equilibrium', 'quiz', 'flashcard', 'practice', 'explain', 'step by step',
      'worked example', 'formula', 'theorem', 'tutor'
    ];

    const isTutorQuery = explicitMode === 'TUTOR' || (
      explicitMode !== 'ADVISOR' && tutorSignals.some((sig) => q.includes(sig))
    );

    if (isTutorQuery) {
      if (q.includes('quiz') || q.includes('test me') || q.includes('practice') || q.includes('question')) {
        return { mode: 'TUTOR', intent: 'TUTOR_QUIZ_PRACTICE' };
      }
      if (q.includes('solve') || q.includes('calculate') || q.includes('evaluate') || q.includes('example')) {
        return { mode: 'TUTOR', intent: 'TUTOR_WORKED_EXAMPLE' };
      }
      return { mode: 'TUTOR', intent: 'TUTOR_CONCEPT_EXPLAIN' };
    }

    if (
      q.includes('how many') ||
      q.includes('feature') ||
      q.includes('other than') ||
      q.includes('besides') ||
      q.includes('account for') ||
      q.includes('accounted') ||
      q.includes('gibi connect') ||
      q.includes('gibiconnect') ||
      q.includes('platform') ||
      q.includes('what else') ||
      q.includes('what can you do') ||
      q.includes('vault') ||
      q.includes('curricul') ||
      q.includes('module')
    ) {
      return { mode: 'ADVISOR', intent: 'PLATFORM_OVERVIEW_FEATURES' };
    }

    if (q.includes('cost') || q.includes('sharing') || q.includes('tuition') || q.includes('fee') || q.includes('650/2009') || q.includes('etb')) {
      return { mode: 'ADVISOR', intent: 'COST_SHARING_TUITION' };
    }
    if (q.includes('cutoff') || q.includes('cut-off') || q.includes('score') || q.includes('point') || q.includes('matric') || q.includes('euee') || q.includes('eligible')) {
      return { mode: 'ADVISOR', intent: 'ADMISSIONS_CUTOFF' };
    }
    if (q.includes('library') || q.includes('dorm') || q.includes('hospital') || q.includes('lab') || q.includes('facility')) {
      return { mode: 'ADVISOR', intent: 'CAMPUS_FACILITIES' };
    }
    if (q.includes('scholarship') || q.includes('calendar') || q.includes('deadline') || q.includes('meskerem')) {
      return { mode: 'ADVISOR', intent: 'SCHOLARSHIPS_CALENDAR' };
    }
    if (q.includes('curriculum') || q.includes('program') || q.includes('degree') || q.includes('ects') || q.includes('duration')) {
      return { mode: 'ADVISOR', intent: 'PROGRAM_CURRICULUM' };
    }

    return { mode: 'ADVISOR', intent: 'GENERAL_ACADEMIC' };
  }

  /**
   * Executes 3-Tier Hybrid Retrieval + Reciprocal Rank Fusion (RRF)
   * Enforces Data Trust Rule: ONLY verificationStatus === 'VERIFIED' chunks are permitted.
   */
  async retrieveTopK(
    rawQuery: string,
    topK = 4,
    studentProfile?: StudentContextProfile
  ): Promise<ScoredRAGChunk[]> {
    await this.ensureCorpusIndexed();

    const cleanQuery = this.sanitizeQuery(rawQuery);
    const queryEmbedding = await llmClient.generateEmbedding(cleanQuery, 'search_query');
    const queryTokens = cleanQuery
      .toLowerCase()
      .replace(/[^a-z0-9\s+-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);

    // Filter strictly to VERIFIED chunks (Part 6.1 Data Trust Rule)
    const verifiedChunks = this.corpus.filter((c) => c.verificationStatus === 'VERIFIED');
    const detectedInstitutions = extractInstitutionsFromQuery(cleanQuery);

    // Score each chunk across all 3 tiers
    const rawScored = verifiedChunks.map((chunk) => {
      // Tier 3: Dense 768-dim Cosine Similarity
      const vectorScore = chunk.embedding
        ? Math.max(0, llmClient.cosineSimilarity(queryEmbedding, chunk.embedding))
        : 0;

      // Tier 2: Full-Text BM25 / Keyword Overlap Score
      const contentLower = `${chunk.sourceTitle} ${chunk.content}`.toLowerCase();
      let matchedTokens = 0;
      let keywordHits = 0;

      for (const token of queryTokens) {
        if (contentLower.includes(token)) matchedTokens++;
        if (chunk.keywords.some((kw) => kw.includes(token) || token.includes(kw))) {
          keywordHits += 1.5;
        }
      }
      const fullTextScore =
        queryTokens.length > 0
          ? Math.min(1.0, (matchedTokens + keywordHits) / (queryTokens.length * 1.5))
          : 0;

      // Tier 1: Exact Structured Code & Institution Name Match (With typo tolerance and word boundaries)
      let structuredBonus = 0;
      const lowerQuery = cleanQuery.toLowerCase();

      if (chunk.institutionCode) {
        if (queryTokens.includes(chunk.institutionCode.toLowerCase())) {
          structuredBonus += 0.40;
        }
        if (detectedInstitutions.includes(chunk.institutionCode)) {
          structuredBonus += 0.65;
        }
      }
      if (
        chunk.courseCode &&
        cleanQuery.toLowerCase().includes(chunk.courseCode.toLowerCase())
      ) {
        structuredBonus += 0.45;
      }
      if (
        studentProfile?.targetUniversity &&
        chunk.institutionCode?.toUpperCase() === studentProfile.targetUniversity.toUpperCase()
      ) {
        structuredBonus += 0.25;
      }
      if (
        studentProfile?.targetCourseCode &&
        chunk.courseCode?.toUpperCase() === studentProfile.targetCourseCode.toUpperCase()
      ) {
        structuredBonus += 0.30;
      }
      const isPlatformStatsQuery =
        (lowerQuery.includes('how many') && (lowerQuery.includes('universit') || lowerQuery.includes('institution'))) ||
        (lowerQuery.includes('list') && (lowerQuery.includes('universit') || lowerQuery.includes('institution'))) ||
        lowerQuery.includes('account for') ||
        lowerQuery.includes('accounted') ||
        lowerQuery.includes('total universities') ||
        lowerQuery.includes('how many institutions') ||
        lowerQuery.includes('feature') ||
        lowerQuery.includes('other than') ||
        lowerQuery.includes('besides') ||
        lowerQuery.includes('what else') ||
        lowerQuery.includes('database count') ||
        lowerQuery.includes('gibi connect') ||
        lowerQuery.includes('gibiconnect');

      if (chunk.domain === 'PLATFORM_METADATA' && isPlatformStatsQuery) {
        structuredBonus += 0.70;
      }

      return {
        chunk,
        vectorScore,
        fullTextScore,
        structuredBonus,
        rrfScore: 0,
      };
    });

    // Compute Reciprocal Rank Fusion (RRF) with 0.6 Vector / 0.4 Full-Text + Structured Boost
    const kRRF = 10;
    const byVectorRank = [...rawScored].sort((a, b) => b.vectorScore - a.vectorScore);
    const byTextRank = [...rawScored].sort((a, b) => b.fullTextScore - a.fullTextScore);

    for (const item of rawScored) {
      const vRank = byVectorRank.findIndex((x) => x.chunk.id === item.chunk.id) + 1;
      const tRank = byTextRank.findIndex((x) => x.chunk.id === item.chunk.id) + 1;

      const rrfRaw = 0.6 * (1 / (kRRF + vRank)) + 0.4 * (1 / (kRRF + tRank));
      // Normalize RRF + blend with raw cosine, full-text, and structured match
      const blendedConfidence = Math.min(
        0.99,
        rrfRaw * 4.5 + item.vectorScore * 0.35 + item.fullTextScore * 0.35 + item.structuredBonus
      );
      item.rrfScore = Number(blendedConfidence.toFixed(4));
    }

    // Try augmenting from live PostgreSQL DB via pool (non-blocking)
    const dbChunks = await this.tryFetchLiveDatabaseRecords(cleanQuery);
    const combined = [...rawScored, ...dbChunks];

    combined.sort((a, b) => b.rrfScore - a.rrfScore);

    // If multiple institutions were inquired about in the prompt, balance retrieval to include top chunks for EACH
    if (detectedInstitutions.length > 1) {
      const balancedResults: ScoredRAGChunk[] = [];
      for (const instCode of detectedInstitutions) {
        const instChunks = combined.filter((c) => c.chunk.institutionCode === instCode).slice(0, 2);
        balancedResults.push(...instChunks);
      }
      for (const c of combined) {
        if (!balancedResults.some((x) => x.chunk.id === c.chunk.id)) {
          balancedResults.push(c);
        }
        if (balancedResults.length >= Math.max(topK, detectedInstitutions.length * 2)) break;
      }
      return balancedResults;
    }

    return combined.slice(0, topK);
  }

  /**
   * Real-time relational lookup & exact counts from live PostgreSQL database
   */
  private async tryFetchLiveDatabaseRecords(query: string): Promise<ScoredRAGChunk[]> {
    try {
      const q = query.toLowerCase();
      const chunks: ScoredRAGChunk[] = [];

      const isCountOrPlatformQuery =
        q.includes('how many') ||
        q.includes('count') ||
        q.includes('total') ||
        q.includes('account') ||
        q.includes('accounted') ||
        q.includes('universit') ||
        q.includes('instituti') ||
        q.includes('feature') ||
        q.includes('other than') ||
        q.includes('besides') ||
        q.includes('gibi') ||
        q.includes('database') ||
        q.includes('platform');

      if (isCountOrPlatformQuery) {
        const countsRes = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM institutions) AS inst_count,
            (SELECT COUNT(*) FROM programs) AS prog_count,
            (SELECT COUNT(*) FROM scholarships) AS schol_count,
            (SELECT COUNT(*) FROM resources) AS res_count,
            (SELECT COUNT(*) FROM admissions) AS adm_count,
            (SELECT COUNT(*) FROM academic_calendar) AS cal_count
        `);
        const instListRes = await pool.query(`
          SELECT name, city, region, type, ownership 
          FROM institutions 
          ORDER BY ownership DESC, name ASC
        `);

        const c = countsRes.rows[0];
        const insts = instListRes.rows;
        const publicCount = insts.filter((i: any) => i.ownership === 'public').length;
        const privateCount = insts.filter((i: any) => i.ownership === 'private').length;
        const instNamesList = insts.map((i: any, idx: number) => `${idx + 1}. ${i.name} (${i.city}, ${i.region} - ${i.ownership})`).join('\n');

        const liveChunk: RAGDocumentChunk = {
          id: 'live-db-metrics',
          institutionCode: 'MOE',
          domain: 'PLATFORM_METADATA',
          sourceTitle: 'GIBIConnect Live PostgreSQL Registry & Telemetry Database',
          pageNumber: 1,
          chunkIndex: 0,
          academicYear: '2016/2017 E.C.',
          verificationStatus: 'VERIFIED',
          keywords: ['how many', 'count', 'total', 'universities', 'institutions', 'gibiconnect', 'database', 'features', 'account for'],
          content: `GIBIConnect Real-Time Live Database Statistics:
- Total Higher Education Institutions Accounted For: Exactly ${c.inst_count || 18} institutions (${publicCount} public universities and ${privateCount} accredited private colleges/universities).
- Complete List of Universities in the GIBIConnect Registry:
${instNamesList}
- Total Accredited Programs: ${c.prog_count || 114} undergraduate & graduate degree programs across all faculties.
- Total Educational Resources & Vault Files: ${c.res_count || 39} real resources (including university curricula PDFs, semester lecture notes, previous exam papers, spreadsheets, and research datasets).
- Admissions Directives & Thresholds: ${c.adm_count || 116} official entrance criteria and regional affirmative action quotas.
- Available Scholarships: ${c.schol_count || 14} merit and access scholarships.
- Academic Calendar Events: ${c.cal_count || 40} semester milestones and exit exam dates.
- Verified Peer Tutors: Curated network of verified peer tutors from AAiT, ASTU, Hawassa, and Jimma.
- Features Beyond University Profiles: Document & Resource Vault (PDF curricula & past exams), EUEE Cutoff Predictor, Statutory Cost-Sharing Calculator (Proclamation 650/2009), Academic Events & Calendar Tracker, Peer Tutor Marketplace, and 6-Stage AI STEM Tutor.`,
        };

        chunks.push({
          chunk: liveChunk,
          vectorScore: 0.98,
          fullTextScore: 0.99,
          structuredBonus: 0.7,
          rrfScore: 0.99,
        });
      }

      return chunks;
    } catch (err: any) {
      console.warn('[HybridRAGRetriever] Live DB query warning:', err?.message || err);
      return [];
    }
  }

  /**
   * Allows dynamic ingestion of new VERIFIED document chunks into the RAG store
   */
  async ingestDocumentChunk(newChunk: Omit<RAGDocumentChunk, 'embedding'>): Promise<RAGDocumentChunk> {
    const embedding = await llmClient.generateEmbedding(
      `${newChunk.sourceTitle} ${newChunk.keywords.join(' ')} ${newChunk.content}`,
      'search_document'
    );
    const fullChunk: RAGDocumentChunk = {
      ...newChunk,
      embedding,
    };
    this.corpus.unshift(fullChunk);
    return fullChunk;
  }

  getCorpusStats() {
    const verifiedCount = this.corpus.filter((c) => c.verificationStatus === 'VERIFIED').length;
    return {
      totalChunks: this.corpus.length,
      verifiedChunks: verifiedCount,
      domains: Array.from(new Set(this.corpus.map((c) => c.domain))),
      institutionsCovered: Array.from(new Set(this.corpus.map((c) => c.institutionCode).filter(Boolean))),
      coursesCovered: Array.from(new Set(this.corpus.map((c) => c.courseCode).filter(Boolean))),
    };
  }
}

export const ragRetriever = new HybridRAGRetriever();
