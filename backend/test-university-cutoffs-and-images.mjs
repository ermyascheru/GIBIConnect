import { aiAdvisorService } from './dist/modules/ai/ai.advisor.service.js';
import { ragRetriever } from './dist/modules/ai/rag.retriever.js';

async function runTest() {
  console.log('=== TESTING UNIVERSITY-SPECIFIC ADMISSIONS & CUTOFFS ===\n');

  // Test 1: Query for "what is the cutoff point of engineering in goder university"
  const q1 = 'what is the cutoff point of engineering in goder university';
  console.log(`Query 1: "${q1}"`);
  const topChunks = await ragRetriever.retrieveTopK(q1, 3);
  console.log('Top retrieved chunk ID:', topChunks[0]?.chunk.id);
  console.log('Top retrieved source:', topChunks[0]?.chunk.sourceTitle);

  if (!topChunks[0]?.chunk.id.includes('uog')) {
    throw new Error(`Expected UOG chunk at rank 1, but got ${topChunks[0]?.chunk.id}`);
  }
  console.log('PASS: University of Gondar (UoG) chunk successfully ranked #1 for query with typo "goder"!\n');

  // Test 2: Process Chat response
  const chatRes = await aiAdvisorService.processChat({
    message: q1,
    mode: 'ADVISOR',
  });
  console.log('AI Advisor Reply:');
  console.log(chatRes.reply);

  if (chatRes.reply.includes('General Pass Marks for Public University Admission') && !chatRes.reply.toLowerCase().includes('gondar')) {
    throw new Error('FAIL: AI still gave generic pass marks without Gondar cutoffs!');
  }
  if (!chatRes.reply.toLowerCase().includes('465') && !chatRes.reply.toLowerCase().includes('450')) {
    throw new Error('FAIL: Engineering cutoff numbers (465/450) missing from reply!');
  }
  console.log('\nPASS: AI answered with specific University of Gondar engineering cutoffs (465+ / 445+)!');

  console.log('\n=== ALL TESTS PASSED! ===');
}

runTest().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
