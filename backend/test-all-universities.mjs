import { ragRetriever } from './dist/modules/ai/rag.retriever.js';
import { aiAdvisorService } from './dist/modules/ai/ai.advisor.service.js';

async function testAllUniversities() {
  console.log('=== MULTI-UNIVERSITY ADMISSION & CUT-OFF TEST ===\n');

  const testCases = [
    { query: 'what is the cutoff point of engineering in goder university', expectedCode: 'UOG', expectedTerm: '465' },
    { query: 'jimma university medicine cutoff score', expectedCode: 'JU', expectedTerm: '525' },
    { query: 'bahir dar university software engineering cut off', expectedCode: 'BDU', expectedTerm: '470' },
    { query: 'hawassa university medicine cutoff points', expectedCode: 'HU', expectedTerm: '505' },
    { query: 'astu software engineering entrance cutoff', expectedCode: 'ASTU', expectedTerm: '485' },
    { query: 'aau medicine cutoff point', expectedCode: 'AAU', expectedTerm: '540' },
  ];

  for (const tc of testCases) {
    console.log(`Testing query: "${tc.query}"`);
    const topChunks = await ragRetriever.retrieveTopK(tc.query, 2);
    const topChunk = topChunks[0]?.chunk;
    console.log(` -> Top Chunk ID: ${topChunk?.id} (${topChunk?.sourceTitle})`);

    const chatRes = await aiAdvisorService.processChat({ message: tc.query, mode: 'ADVISOR' });
    const reply = chatRes.reply;
    
    if (reply.includes('General Pass Marks for Public University Admission') && !reply.toLowerCase().includes(tc.expectedCode.toLowerCase())) {
      throw new Error(`FAIL for "${tc.query}": returned generic MoE pass marks instead of specific institution!`);
    }
    console.log(` -> PASS: Replied with institution-specific data.\n`);
  }

  console.log('=== ALL MULTI-UNIVERSITY TESTS PASSED! ===');
}

testAllUniversities().catch((err) => {
  console.error('\n❌ MULTI-UNIVERSITY TEST FAILED:', err);
  process.exit(1);
});
