import fetch from 'node-fetch';

async function test() {
  try {
    console.log('Testing create-checkout-session...');
    const response = await fetch('http://localhost:3000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user-id-123' })
    });
    
    const status = response.status;
    const text = await response.text();
    console.log('STATUS:', status);
    try {
      const data = JSON.parse(text);
      console.log('RESPONSE DATA:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('RESPONSE TEXT:', text);
    }
  } catch (err) {
    console.error('TEST ERROR:', err);
  }
}

test();
