import dotenv from 'dotenv';
dotenv.config();

// Provide test defaults if missing
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gibiconnect_db';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-jwt-access-secret-minimum-32-chars-long';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret-minimum-32-chars-long';

import { ragRetriever } from './dist/modules/ai/rag.retriever.js';
import { aiAdvisorService } from './dist/modules/ai/ai.advisor.service.js';

console.log('=== GIBICONNECT COMPREHENSIVE AI ADVISOR TEST SUITE ===\n');

// 1. Define Test Cases with Diverse Wordings, Typos, and Compound Inquiries
const TEST_CASES = [
  // --- Category 1: Platform Capabilities & Metrics ---
  {
    category: 'Platform Capabilities',
    query: 'what is gibiconnect and what can it do',
    expectedKeywords: ['higher education', '18', 'universities', 'admissions', 'cost-sharing'],
  },
  {
    category: 'Platform Capabilities',
    query: 'what features does gibi connect have other than university directory',
    expectedKeywords: ['Resource Vault', '39', 'Cost-Sharing Calculator', 'Tutor Marketplace', 'Admissions'],
  },
  {
    category: 'Platform Capabilities',
    query: 'how many institutions does gibiconnect database account for',
    expectedKeywords: ['18', '16', 'public', '2', 'private'],
  },

  // --- Category 2: Admissions & Cut-Offs with Typos & Varied Wording ---
  {
    category: 'Admissions Cutoffs',
    query: 'what is the marticlulation of of cs in addis ababa',
    expectedKeywords: ['Addis Ababa', 'Computer Science', '495', '475'],
  },
  {
    category: 'Admissions Cutoffs',
    query: 'cutoff point of engineering in goder university',
    expectedKeywords: ['Gondar', '465', '445', 'Freshman'],
  },
  {
    category: 'Admissions Cutoffs',
    query: 'aastu software marks and entry threshold',
    expectedKeywords: ['AASTU', 'Software', '490', '470'],
  },
  {
    category: 'Admissions Cutoffs',
    query: 'derbre markos entry criteria for regular students',
    expectedKeywords: ['Debre Markos', 'DMU', '435'],
  },
  {
    category: 'Admissions Cutoffs',
    query: 'tell me about ddu admissions and passmark',
    expectedKeywords: ['Dire Dawa', 'DDU', '435', '415'],
  },
  {
    category: 'Admissions Cutoffs',
    query: 'what are the general pass marks by moe for emerging regions',
    expectedKeywords: ['330', '310', 'Emerging', 'Afar', 'Somali'],
  },

  // --- Category 3: Institutional Governance & Status ---
  {
    category: 'Governance & Status',
    query: 'is addis ababa university turned private or public recently',
    expectedKeywords: ['autonomous public', 'NOT private', 'Regulation No. 534/2023'],
  },
  {
    category: 'Governance & Status',
    query: 'tell me about addis abeba medical collage status and programs',
    expectedKeywords: ['Medical', 'Medicine', 'Health'],
  },

  // --- Category 4: Statutory Cost-Sharing & Tuition ---
  {
    category: 'Cost-Sharing & Tuition',
    query: 'how much is medicine tuition at addis ababa university for regular students',
    expectedKeywords: ['0 ETB', 'Proclamation No. 650/2009', 'Cost-Sharing'],
  },
  {
    category: 'Cost-Sharing & Tuition',
    query: 'explain proclamation 650/2009 repayment rules and percentage',
    expectedKeywords: ['10%', '1 year', 'formal employment', 'salary'],
  },

  // --- Category 5: Freshman STEM Tutoring ---
  {
    category: 'Freshman STEM Tutoring',
    query: 'solve 2d projectile motion problem for freshman physics',
    expectedKeywords: ['PHYS1011', 'kinematics', 'projectile'],
  },
  {
    category: 'Freshman STEM Tutoring',
    query: 'what courses does the freshman stem tutor cover in gibi connect',
    expectedKeywords: ['MATH1011', 'PHYS1011', 'COSC1011', 'CHEM1011'],
  },

  // --- Category 6: Compound & Multi-Question Prompts ---
  {
    category: 'Compound Multi-Questions',
    query: 'what is the cutoff for engineering in gondar and what is the passmark for cs in addis ababa?',
    expectedKeywords: ['Gondar', '465', 'Addis Ababa', 'Computer Science', '495'],
  },
  {
    category: 'Compound Multi-Questions',
    query: 'tell me about arba minch university and how much is medicine tuition at aau?',
    expectedKeywords: ['Arba Minch', 'Addis Ababa', '0 ETB', 'Cost-Sharing'],
  },
  {
    category: 'Compound Multi-Questions',
    query: 'how many universities are in the database and what are the general passmarks for developing regions?',
    expectedKeywords: ['18', 'universities', 'pass mark'],
  },
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    console.log(`[TEST ${i + 1}/${TEST_CASES.length}] [${tc.category}]`);
    console.log(`Query: "${tc.query}"`);

    // 1. Test Backend RAG Intent Classification and Retrieval
    const isCompound = tc.query.includes(' and ') || tc.query.includes(' also ');
    const topK = isCompound ? 6 : 4;
    const classification = ragRetriever.classifyQueryIntent(tc.query);
    const retrievedChunks = await ragRetriever.retrieveTopK(tc.query, topK);

    // 2. Test AI Advisor Response Generation
    const advisorResponse = await aiAdvisorService.processChat({
      message: tc.query,
      mode: 'ADVISOR',
    });

    const combinedText = `${advisorResponse.reply} ${retrievedChunks.map((c) => c.chunk?.content || c.content || '').join(' ')}`.toLowerCase();

    // Verify expected keywords
    const missingKeywords = tc.expectedKeywords.filter((kw) => !combinedText.includes(kw.toLowerCase()));

    if (missingKeywords.length === 0) {
      console.log(`   Result: PASS`);
      console.log(`   Intent: ${classification.intent} | Mode: ${classification.mode} | Verified Chunks: ${retrievedChunks.length}`);
      console.log(`   Preview: ${advisorResponse.reply.slice(0, 160).replace(/\n/g, ' ')}...`);
      passed++;
    } else {
      console.log(`   Result: FAIL — Missing keywords: [${missingKeywords.join(', ')}]`);
      console.log(`   Snippet: ${advisorResponse.reply.slice(0, 200)}...`);
      failed++;
    }
    console.log('----------------------------------------------------------------------');
  }

  console.log(`\n========================================`);
  console.log(`FINAL RESULTS: ${passed} PASSED, ${failed} FAILED out of ${TEST_CASES.length} TESTS`);
  console.log(`ACCURACY RATE: ${Math.round((passed / TEST_CASES.length) * 100)}%`);
  console.log(`========================================\n`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
