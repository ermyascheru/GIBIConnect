import { documentRAGService } from './dist/modules/ai/document.rag.service.js';
import { aiAdvisorService } from './dist/modules/ai/ai.advisor.service.js';
import { llmClient } from './dist/modules/ai/llm.client.js';

async function runRegression() {
  console.log('=== STARTING DOCUMENT ISOLATION REGRESSION TEST ===\n');

  // Test 1: Ingest Document A (Remedial Physics)
  console.log('--- Test 1: Ingesting Document A (Physics Remedial) ---');
  const physicsText = `
  Ethiopian Higher Education Remedial Program Physics Module.
  Chapter 1: Vectors and Kinematics.
  A scalar quantity has magnitude only, while a vector quantity has both magnitude and direction.
  Cartesian component resolution: A_x = |A| cos(theta), A_y = |A| sin(theta).
  Dot product A . B = |A||B| cos(theta).
  Cross product A x B produces a perpendicular vector.
  A force F1 = 50 N at 37 degrees and F2 = 30 N at 180 degrees yields resultant R = 31.62 N.
  `;
  const docA = await documentRAGService.ingestDocumentBuffer(
    Buffer.from(physicsText, 'utf-8'),
    'Remedial_Physics_Chapter1.txt',
    'text/plain'
  );
  console.log('Document A indexed:', docA.documentId);

  // Test 2: Ingest Document B (Cell Biology)
  console.log('\n--- Test 2: Ingesting Document B (Cellular Biology) ---');
  const biologyText = `
  Undergraduate Biology 101: Cellular Organization and Plant Physiology.
  Eukaryotic plant cells possess rigid cellulosic cell walls and large central vacuoles.
  Chloroplasts contain chlorophyll pigments organized in thylakoid membranes for photosynthesis.
  The light-dependent reactions convert photons and water into oxygen, ATP, and NADPH.
  The Calvin cycle in the stroma fixes carbon dioxide into glyceraldehyde-3-phosphate (G3P).
  Stomatal guard cells regulate gas exchange and transpiration rates across leaf surfaces.
  `;
  const docB = await documentRAGService.ingestDocumentBuffer(
    Buffer.from(biologyText, 'utf-8'),
    'Undergraduate_Plant_Biology.txt',
    'text/plain'
  );
  console.log('Document B indexed:', docB.documentId);

  // Test 3: Document B retrieval strict isolation check
  console.log('\n--- Test 3: Document B Chunk Retrieval Isolation Check ---');
  const retrievedB = await documentRAGService.retrieveFromDocument(
    docB.documentId,
    'How do chloroplasts and thylakoid membranes function in photosynthesis?'
  );
  console.log(`Retrieved ${retrievedB.length} chunks for docB (${docB.documentId}).`);
  for (const c of retrievedB) {
    if (c.chunk.documentId !== docB.documentId) {
      throw new Error(`VIOLATION: Chunk from documentId "${c.chunk.documentId}" returned for docB "${docB.documentId}"!`);
    }
  }
  console.log('PASS: All retrieved chunks strictly belong to Document B.');

  // Test 4: End-to-End Chat on Document B (Checking for Physics Contamination)
  console.log('\n--- Test 4: End-to-End AI Chat on Document B (Strict Grounding & Zero Contamination) ---');
  const chatResponseB = await aiAdvisorService.processChat({
    message: 'Explain photosynthesis and chloroplast structure for an exam review',
    sessionId: 'session-test-bio',
    documentId: docB.documentId,
  });
  console.log('Synthesized Biology Answer excerpt:');
  console.log(chatResponseB.reply.substring(0, 350) + '...\n');

  // Strict Contamination Assertions:
  const forbiddenPhysicsTerms = [
    'vector', 'kinematics', 'projectile', '31.62', 'A_x', 'F_1 = 50', 'Cartesian component', 'cross product'
  ];
  for (const term of forbiddenPhysicsTerms) {
    if (chatResponseB.reply.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`CONTAMINATION DETECTED: Biology chat contains physics term "${term}"!`);
    }
  }
  console.log('PASS: ZERO physics formulas, vectors, or kinematics detected in Biology chat.');

  // Required Biology terms:
  const expectedBioTerms = ['chloroplast', 'photosynthesis', 'thylakoid'];
  for (const term of expectedBioTerms) {
    if (!chatResponseB.reply.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`MISSING GROUNDED CONTENT: Biology chat missing term "${term}"!`);
    }
  }
  console.log('PASS: All expected biology grounded terms present in synthesis.');

  // Test 5: End-to-End Chat on Document A (Physics Remedial)
  console.log('\n--- Test 5: End-to-End AI Chat on Document A (Physics Grounding) ---');
  const chatResponseA = await aiAdvisorService.processChat({
    message: 'Explain Chapter 1: Vectors and resolve the force example',
    sessionId: 'session-test-phys',
    documentId: docA.documentId,
  });
  console.log('Physics Answer excerpt:');
  console.log(chatResponseA.reply.substring(0, 350) + '...\n');

  if (!chatResponseA.reply.toLowerCase().includes('vector')) {
    throw new Error('Physics document failed to return vector concepts!');
  }
  console.log('PASS: Document A properly returns Physics vector concepts when queried.');

  // Test 6: Non-Existent Document ID Isolation Guard
  console.log('\n--- Test 6: Non-Existent Document ID Isolation Guard ---');
  const errorReply = await aiAdvisorService.processChat({
    message: 'Explain Chapter 1',
    sessionId: 'session-test-nonexistent',
    documentId: 'doc-nonexistent-999',
  });
  console.log('Non-existent document reply:\n', errorReply.reply);
  if (!errorReply.reply.includes('Document session error')) {
    throw new Error('VIOLATION: Non-existent document did not return an explicit document session error and might have fallen back to Physics!');
  }
  console.log('PASS: Non-existent document safely halted with explicit Document session error.');

  console.log('\n=== ALL REGRESSION TESTS PASSED SUCCESSFULLY! ===');
}

runRegression().catch(err => {
  console.error('\n❌ REGRESSION TEST FAILED:', err);
  process.exit(1);
});
