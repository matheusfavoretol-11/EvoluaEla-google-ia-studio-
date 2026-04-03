import fetch from 'node-fetch';

async function test() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('HEALTH RESPONSE:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('HEALTH TEST ERROR:', err);
  }
}

test();
