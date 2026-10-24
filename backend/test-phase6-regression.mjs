async function runRegressionSuite() {
  console.log('🧪 Starting GIBIConnect AI Advisor & Regression Test Suite...\n');
  const baseUrl = 'http://localhost:5000/api/v1/ai';

  const testCases = [
    {
      name: '1. Greeting Query ("Hi")',
      message: 'Hi',
      validate: (data) => {
        return (
          data.success &&
          typeof data.data?.reply === 'string' &&
          data.data.reply.length > 20
        );
      },
    },
    {
      name: '2. Factual Query ("What is Addis Ababa University?")',
      message: 'What is Addis Ababa University?',
      validate: (data) => {
        const text = data.data?.reply?.toLowerCase() || '';
        return (
          data.success &&
          (text.includes('addis ababa university') || text.includes('aau')) &&
          (text.includes('public') || text.includes('autonomous') || text.includes('research'))
        );
      },
    },
    {
      name: '3. AAU Private vs Autonomous Claim ("Did AAU recently become a private institution?")',
      message: 'Did AAU recently become a private institution?',
      validate: (data) => {
        const text = data.data?.reply?.toLowerCase() || '';
        return (
          data.success &&
          text.includes('public') &&
          !text.includes('welcome to gibiconnect') &&
          (text.includes('autonomous') || text.includes('not a private') || text.includes('private institution'))
        );
      },
    },
    {
      name: '4. Governance Change ("What changed in AAU\'s governance?")',
      message: "What changed in AAU's governance?",
      validate: (data) => {
        const text = data.data?.reply?.toLowerCase() || '';
        return (
          data.success &&
          !text.includes('welcome to gibiconnect') &&
          (text.includes('autonom') || text.includes('governance') || text.includes('public') || text.includes('council of ministers'))
        );
      },
    },
    {
      name: '5. Admissions Requirements ("What are AAU\'s latest admissions requirements?")',
      message: "What are AAU's latest admissions requirements?",
      validate: (data) => {
        const text = data.data?.reply?.toLowerCase() || '';
        return (
          data.success &&
          !text.includes('welcome to gibiconnect') &&
          (text.includes('cut-off') || text.includes('admission') || text.includes('euee') || text.includes('points') || text.includes('medicine'))
        );
      },
    },
    {
      name: '6. Unrelated question does not trigger welcome message',
      message: 'What is the quantum mechanical tunneling coefficient?',
      validate: (data) => {
        const text = data.data?.reply || '';
        return (
          data.success &&
          !text.startsWith('Welcome to GIBIConnect Academic Advisor')
        );
      },
    },
    {
      name: '7. Conversation History Persistence (UUID session creation & message retrieval)',
      message: 'Initial session message for testing persistence',
      validateAsync: async () => {
        const testSessionId = '11111111-2222-3333-4444-555555555555';
        // Send message with sessionId
        const sendRes = await fetch(`${baseUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Hello, this is a persistence verification test message',
            sessionId: testSessionId,
            mode: 'ADVISOR',
          }),
        });
        const sendJson = await sendRes.json();
        if (!sendJson.success) return false;

        // Retrieve conversation
        const getRes = await fetch(`${baseUrl}/conversations/${testSessionId}`);
        const getJson = await getRes.json();

        // Clean up test conversation
        await fetch(`${baseUrl}/conversations/${testSessionId}`, { method: 'DELETE' });

        return getJson.success && Array.isArray(getJson.data?.messages) && getJson.data.messages.length >= 2;
      },
    },
  ];

  let passed = 0;
  for (const tc of testCases) {
    try {
      if (tc.validateAsync) {
        const ok = await tc.validateAsync();
        if (ok) {
          console.log(`✅ ${tc.name}: PASSED`);
          passed++;
        } else {
          console.error(`❌ ${tc.name}: FAILED`);
        }
        continue;
      }

      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: tc.message, mode: 'ADVISOR' }),
      });

      const data = await res.json();
      const ok = tc.validate(data);
      if (ok) {
        console.log(`✅ ${tc.name}: PASSED`);
        console.log(`   Sample Reply Excerpt: "${(data.data?.reply || '').slice(0, 120)}..."`);
        passed++;
      } else {
        console.error(`❌ ${tc.name}: FAILED`);
        console.error(`   Output:`, JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(`❌ ${tc.name}: EXCEPTION`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`Result: ${passed}/${testCases.length} Tests Passed`);
  console.log(`========================================`);
}

runRegressionSuite().catch(console.error);
