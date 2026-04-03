import fetch from 'node-fetch';

async function test() {
  try {
    const response = await fetch('http://localhost:3000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user' })
    });
    const data = await response.json();
    console.log('RESPONSE:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('TEST ERROR:', err);
  }
}

test();
