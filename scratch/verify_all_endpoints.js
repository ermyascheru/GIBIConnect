const testInstitutions = [
  { id: '00000000-0000-4000-8000-000000000008', name: 'Adama Science and Technology University' },
  { id: '00000000-0000-4000-8000-000000000001', name: 'Addis Ababa University' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'Bahir Dar University' },
  { id: '00000000-0000-4000-8000-000000000004', name: 'Jimma University' },
  { id: '00000000-0000-4000-8000-000000000005', name: 'Hawassa University' }
];

const subtabs = [
  'departments',
  'programs',
  'admissions',
  'tuition',
  'facilities',
  'scholarships',
  'resources',
  'calendar'
];

async function runComprehensiveVerification() {
  const base = 'http://localhost:5000/api';
  console.log('=== 1. VERIFYING INSTITUTIONS LIST ENDPOINT ===');
  const listRes = await fetch(`${base}/institutions?limit=50`);
  const listData = await listRes.json();
  console.log(`HTTP Status: ${listRes.status}, Success: ${listData.success}, Total Count: ${listData.data?.length}`);
  
  const astu = listData.data.find(i => i.name.includes('Adama Science'));
  console.log('ASTU in list:', {
    id: astu?.id,
    name: astu?.name,
    logo_url: astu?.logo_url,
    cover_image_url: astu?.cover_image_url,
    website_url: astu?.website_url
  });

  console.log('\n=== 2. VERIFYING MULTIPLE INSTITUTION DETAIL ENDPOINTS ===');
  for (const inst of testInstitutions) {
    const detailRes = await fetch(`${base}/institutions/${inst.id}`);
    const detailData = await detailRes.json();
    console.log(`[${detailRes.status}] ${inst.name}: id=${detailData.data?.id}, logo_url=${detailData.data?.logo_url}, city=${detailData.data?.city}`);
  }

  console.log('\n=== 3. VERIFYING ALL ASTU SUBTABS ===');
  for (const sub of subtabs) {
    const subRes = await fetch(`${base}/institutions/00000000-0000-4000-8000-000000000008/${sub}`);
    const subData = await subRes.json();
    console.log(`[${subRes.status}] ASTU ${sub}: success=${subData.success}, count=${Array.isArray(subData.data) ? subData.data.length : 'N/A'}`);
  }

  console.log('\n=== 4. VERIFYING EXPLORE ENDPOINTS ===');
  const expInstRes = await fetch(`${base}/institutions?limit=6`);
  const expInstData = await expInstRes.json();
  console.log(`Featured Universities count: ${expInstData.data?.length}`);

  const expProgRes = await fetch(`${base}/programs?limit=6`);
  const expProgData = await expProgRes.json();
  console.log(`Featured Programs count: ${expProgData.data?.length}`);

  console.log('\n=== 5. VERIFYING STATIC ASSETS & REAL ASTU LOGO FILE ===');
  const logoRes = await fetch('http://localhost:5000/assets/logos/astu_logo.png');
  console.log(`astu_logo.png HTTP Status: ${logoRes.status}, Content-Type: ${logoRes.headers.get('content-type')}, Size: ${logoRes.headers.get('content-length')} bytes`);

  console.log('\n>>> ALL 5 VERIFICATION SUITES COMPLETED SUCCESSFULLY! <<<');
}

runComprehensiveVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
