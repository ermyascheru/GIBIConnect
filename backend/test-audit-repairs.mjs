// Comprehensive verification test script for GIBIConnect fixes
import http from 'http';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseBody });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseBody });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE GIBICONNECT AUDIT & VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
    }
  }

  // TEST 1: Subject-Independent Academic Visual Generation
  console.log('\n--- 1. Testing Academic Visual Generation for Diverse Subjects ---');

  function getSvg(res) {
    return decodeURIComponent(res?.data?.data?.imageUrl || '');
  }

  // 1a: Human Hand Anatomy
  const handRes = await post('/api/v1/ai/image/generate', {
    prompt: 'What does the human hand look like, and what are its parts called?',
  });
  const handSvg = getSvg(handRes);
  assert(
    handRes.status === 200 &&
    handRes.data.success &&
    handRes.data.data.subject === 'MEDICINE' &&
    handSvg.includes('Phalanges') &&
    handSvg.includes('Metacarpals') &&
    handSvg.includes('Carpals') &&
    !handSvg.includes('Axon'),
    '1a. Human Hand Anatomy generates accurate labeled hand diagram (no neuron/heart)'
  );

  // 1b: Human Brain Anatomy
  const brainRes = await post('/api/v1/ai/image/generate', {
    prompt: 'What does the human brain look like and what are its parts called?',
  });
  const brainSvg = getSvg(brainRes);
  assert(
    brainRes.status === 200 &&
    brainRes.data.success &&
    brainSvg.includes('Frontal Lobe') &&
    brainSvg.includes('Cerebellum') &&
    !brainSvg.includes('&amp;amp;'),
    '1b. Human Brain Anatomy generates accurate cerebral diagram with valid XML encoding'
  );

  // 1c: Plant Cell Structure
  const plantRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Show me a plant cell diagram with cell wall, vacuole and chloroplasts',
  });
  const plantSvg = getSvg(plantRes);
  assert(
    plantRes.status === 200 &&
    plantRes.data.success &&
    plantRes.data.data.subject === 'BIOLOGY' &&
    plantSvg.includes('Cell Wall') &&
    plantSvg.includes('Chloroplast'),
    '1c. Plant Cell Structure generates distinct botanical visual'
  );

  // 1d: Projectile Motion (Physics)
  const projRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Illustrate 2D projectile motion trajectory and launch angle theta',
  });
  const projSvg = getSvg(projRes);
  assert(
    projRes.status === 200 &&
    projRes.data.success &&
    projRes.data.data.subject === 'PHYSICS' &&
    projSvg.includes('Total Range R') &&
    projSvg.includes('vx = v0 cos'),
    '1d. Projectile Motion generates coordinate kinematics trajectory with launch vector'
  );

  // 1e: Quadratic Function (Mathematics)
  const quadRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Plot quadratic parabola y = ax^2 + bx + c showing vertex and roots',
  });
  const quadSvg = getSvg(quadRes);
  assert(
    quadRes.status === 200 &&
    quadRes.data.success &&
    quadRes.data.data.subject === 'MATHEMATICS' &&
    quadSvg.includes('Vertex') &&
    quadSvg.includes('x = -b'),
    '1e. Quadratic Function generates mathematical graph with vertex and axis of symmetry'
  );

  // 1f: Four-Stroke Engine (Engineering)
  const engineRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Diagram of a four-stroke internal combustion engine showing intake, compression, power, exhaust',
  });
  const engineSvg = getSvg(engineRes);
  assert(
    engineRes.status === 200 &&
    engineRes.data.success &&
    engineRes.data.data.subject === 'ENGINEERING' &&
    engineSvg.includes('1. INTAKE') &&
    engineSvg.includes('3. POWER'),
    '1f. Four-Stroke Engine generates 4-cylinder mechanical cycle diagram'
  );

  // 1g: Binary Tree (Computer Science)
  const bstRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Show binary search tree data structure diagram',
  });
  const bstSvg = getSvg(bstRes);
  assert(
    bstRes.status === 200 &&
    bstRes.data.success &&
    bstRes.data.data.subject === 'COMPUTER_SCIENCE' &&
    bstSvg.includes('Root') &&
    bstSvg.includes('50'),
    '1g. Binary Tree generates hierarchical tree node graph'
  );

  // 1h: Unseen / Arbitrary Academic Topic
  const plateRes = await post('/api/v1/ai/image/generate', {
    prompt: 'Draw a conceptual model of tectonic plate subduction in geology',
  });
  assert(
    plateRes.status === 200 &&
    plateRes.data.success &&
    plateRes.data.data.imageUrl.includes('svg') &&
    !plateRes.data.data.imageUrl.includes('xmlParseEntityRef'),
    '1h. Arbitrary unseen topic generates dynamic concept map without error'
  );

  // TEST 2: Tutoring Length, Depth & Chapter Coverage Audit
  console.log('\n--- 2. Testing Tutoring Depth & Chapter Coverage ---');

  const summaryChat = await post('/api/v1/ai/chat', {
    message: 'Give me a brief summary of Chapter 1 Vectors in physics',
    mode: 'TUTOR',
  });
  assert(
    summaryChat.status === 200 &&
    summaryChat.data.success &&
    summaryChat.data.data.timings &&
    summaryChat.data.data.timings.totalMs > 0,
    '2a. Summary request returns response with latency instrumentation timings'
  );

  const fivePageChat = await post('/api/v1/ai/chat', {
    message: 'I want a comprehensive 5 page in depth lesson on vectors covering every section and formula',
    mode: 'TUTOR',
  });
  assert(
    fivePageChat.status === 200 &&
    fivePageChat.data.success &&
    fivePageChat.data.data.reply.length > 500,
    '2b. Five-page in-depth lesson request produces expanded tutoring lesson'
  );

  // TEST 3: Mathematical Notation & Equation Fidelity
  console.log('\n--- 3. Testing Mathematical Notation & KaTeX Preservation ---');

  const physicsChat = await post('/api/v1/ai/chat', {
    message: 'What is the kinematic displacement equation with initial velocity and acceleration?',
    mode: 'ADVISOR',
  });
  assert(
    physicsChat.status === 200 &&
    physicsChat.data.success &&
    (physicsChat.data.data.reply.includes('\\Delta x') ||
     physicsChat.data.data.reply.includes('v_i') ||
     physicsChat.data.data.reply.includes('\\frac{1}{2}') ||
     physicsChat.data.data.reply.includes('1/2 at^2') ||
     physicsChat.data.data.reply.includes('at^2')) &&
    !physicsChat.data.data.reply.includes('at^D'),
    '3. Kinematics formula preserves clean mathematical notation without OCR corruption (no at^D)'
  );

  // TEST 4: Conversation Title Generation & Context Menu Endpoints
  console.log('\n--- 4. Testing Conversation Title Generation & Context Menu API ---');

  // 4a: Chat returns smart title
  const handChat = await post('/api/v1/ai/chat', {
    message: 'What does the human hand look like, and what are its parts called?',
    mode: 'ADVISOR',
  });
  assert(
    handChat.status === 200 &&
    handChat.data.success &&
    handChat.data.data.conversationTitle === 'Human Hand Anatomy',
    `4a. Smart title generation produces concise, relevant title: "${handChat.data?.data?.conversationTitle}"`
  );

  // 4b: PATCH /api/v1/ai/conversations/:id (Rename)
  const renameRes = await request('PATCH', '/api/v1/ai/conversations/session-test-12345', {
    title: 'Custom User Renamed Title',
  });
  assert(
    renameRes.status === 200 &&
    renameRes.data.success &&
    renameRes.data.data.title === 'Custom User Renamed Title',
    '4b. PATCH /api/v1/ai/conversations/:id renames conversation'
  );

  // 4c: DELETE /api/v1/ai/conversations/:id (Delete)
  const deleteRes = await request('DELETE', '/api/v1/ai/conversations/session-test-12345');
  assert(
    deleteRes.status === 200 &&
    deleteRes.data.success &&
    deleteRes.data.data.deleted === true,
    '4c. DELETE /api/v1/ai/conversations/:id deletes conversation'
  );

  console.log('\n================================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL REPAIR & AUDIT REQUIREMENTS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed. Review log output above.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
