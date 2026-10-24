async function testSearch() {
  const base = 'http://localhost:5000/api';
  
  const q1 = await (await fetch(base + '/institutions?q=Adama')).json();
  console.log('Search "Adama":', q1.data.map(i => i.name));
  
  const q2 = await (await fetch(base + '/institutions?q=Hawassa')).json();
  console.log('Search "Hawassa":', q2.data.map(i => i.name));
  
  const q3 = await (await fetch(base + '/institutions?region=Oromia')).json();
  console.log('Filter region "Oromia":', q3.data.map(i => i.name));
  
  const q4 = await (await fetch(base + '/institutions?ownership=private')).json();
  console.log('Filter ownership "private":', q4.data.map(i => i.name));
}

testSearch().catch(console.error);
