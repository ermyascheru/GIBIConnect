/**
 * Verification Test: Subject-Specific AI Image Generation & AAU Medicine Tuition Accuracy
 */

async function runTests() {
  console.log('🧪 Starting Image Generation & Medicine Tuition Verification Suite...\n');
  const baseUrl = 'http://localhost:5000/api/v1/ai';

  let passed = 0;
  let total = 0;

  // Test 1: AAU Medicine Tuition Accuracy
  total++;
  try {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Can you tell me the exact payment I will make in a month based on the credit-hour payment for Medicine at Addis Ababa University?',
        mode: 'ADVISOR',
      }),
    });
    const data = await res.json();
    const reply = (data.data?.reply || '').toLowerCase();

    const mentionsZeroOrCostSharing = reply.includes('0 etb') || reply.includes('cost-sharing') || reply.includes('proclamation no. 650/2009') || reply.includes('subsidized');
    const rejectsMonthlyBilling = reply.includes('do not bill') || reply.includes('not bill') || reply.includes('semester') || reply.includes('monthly payment schedule');
    const rejectsWrongRates = !reply.includes('engineering/computing: 750 etb') && !reply.includes('engineering: 750 etb per credit hour');

    if (data.success && mentionsZeroOrCostSharing && rejectsMonthlyBilling && rejectsWrongRates) {
      console.log('✅ Test 1: AAU Medicine Tuition RAG Retrieval & Prompting: PASSED');
      console.log('   Reply Excerpt:\n   ' + data.data.reply.slice(0, 220).replace(/\n/g, '\n   ') + '...\n');
      passed++;
    } else {
      console.error('❌ Test 1: AAU Medicine Tuition failed validation.');
      console.error('   Output:', data.data?.reply);
    }
  } catch (e) {
    console.error('❌ Test 1 Exception:', e.message);
  }

  // Test 2-8: Subject-Specific Image Generation
  const subjects = [
    { subject: 'MEDICINE', prompt: 'Human heart chambers and systemic blood circulation flow', keyExpected: 'Ventricle' },
    { subject: 'BIOLOGY', prompt: 'DNA double helix with nucleotide base pairing', keyExpected: 'Helix' },
    { subject: 'CHEMISTRY', prompt: 'Benzene ring aromatic resonance and pi electron cloud', keyExpected: 'Pi-Electron' },
    { subject: 'PHYSICS', prompt: 'Free body diagram on inclined plane with gravity and friction', keyExpected: 'Force' },
    { subject: 'MATHEMATICS', prompt: 'Calculus derivative tangent slope and definite integral area', keyExpected: 'Derivative' },
    { subject: 'ENGINEERING', prompt: 'RLC series circuit with AC voltage source and capacitor', keyExpected: 'Circuit' },
    { subject: 'COMPUTER_SCIENCE', prompt: 'Binary search tree with root and balanced child nodes', keyExpected: 'Tree' },
  ];

  for (const s of subjects) {
    total++;
    try {
      const res = await fetch(`${baseUrl}/image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: s.prompt,
          subject: s.subject,
          style: 'diagram',
        }),
      });
      const data = await res.json();

      const isValid =
        data.success &&
        data.data?.imageUrl &&
        data.data.imageUrl.startsWith('data:image/') &&
        data.data.subject === s.subject &&
        Array.isArray(data.data.keyConcepts) &&
        data.data.keyConcepts.length > 0;

      if (isValid) {
        console.log(`✅ Visual Generation [${s.subject}]: PASSED (Provider: ${data.data.provider}, Concepts: ${data.data.keyConcepts.length})`);
        passed++;
      } else {
        console.error(`❌ Visual Generation [${s.subject}] failed validation:`, data);
      }
    } catch (e) {
      console.error(`❌ Visual Generation [${s.subject}] Exception:`, e.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`Final Suite Result: ${passed}/${total} Tests Passed`);
  console.log(`========================================\n`);
}

runTests().catch(console.error);
