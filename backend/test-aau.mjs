async function test() {
  const res = await fetch('http://localhost:5000/api/v1/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Do you know that Addis Ababa University recently turned into a private institution?',
      mode: 'ADVISOR',
    }),
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:\n', JSON.stringify(data, null, 2));
}

test().catch(console.error);
