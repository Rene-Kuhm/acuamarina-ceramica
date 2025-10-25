const https = require('https');

const RAILWAY_URL = 'https://diligent-upliftment-production-54de.up.railway.app';

async function testRoute(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, RAILWAY_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Probando rutas en Railway...\n');
  console.log(`Base URL: ${RAILWAY_URL}\n`);

  // Test 1: Health check
  console.log('1. Testing /health');
  try {
    const health = await testRoute('/health');
    console.log(`   ✅ Status: ${health.status}`);
    console.log(`   Response: ${health.body}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 2: API info
  console.log('2. Testing /api/v1/');
  try {
    const apiInfo = await testRoute('/api/v1/');
    console.log(`   ✅ Status: ${apiInfo.status}`);
    const data = JSON.parse(apiInfo.body);
    console.log(`   Endpoints:`, Object.keys(data.endpoints || {}));
    console.log(`   Full response:`, JSON.stringify(data, null, 2), '\n');
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 3: MercadoPago public key (should work without credentials)
  console.log('3. Testing /api/v1/mercadopago/public-key');
  try {
    const publicKey = await testRoute('/api/v1/mercadopago/public-key');
    console.log(`   Status: ${publicKey.status}`);
    console.log(`   Response: ${publicKey.body}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 4: MercadoPago create preference (will fail without order, but should return 400 not 404)
  console.log('4. Testing POST /api/v1/mercadopago/create-preference');
  try {
    const preference = await testRoute('/api/v1/mercadopago/create-preference', 'POST', { orderId: 1 });
    console.log(`   Status: ${preference.status}`);
    console.log(`   Response: ${preference.body}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 5: Check if route exists by trying OPTIONS
  console.log('5. Testing OPTIONS /api/v1/mercadopago/create-preference');
  try {
    const options = await testRoute('/api/v1/mercadopago/create-preference', 'OPTIONS');
    console.log(`   Status: ${options.status}`);
    console.log(`   Headers:`, options.headers);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
}

runTests().catch(console.error);
