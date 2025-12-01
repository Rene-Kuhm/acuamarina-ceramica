const https = require('https');

// Datos para crear una categoría de prueba
const data = JSON.stringify({
  name: "Categoría Test",
  description: "Categoría de prueba",
  isActive: true,
  displayOrder: 0
});

const options = {
  hostname: 'diligent-upliftment-production-54de.up.railway.app',
  path: '/api/v1/categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    // Necesitarás el token de autenticación
    'Authorization': 'Bearer TU_TOKEN_AQUI'
  }
};

const req = https.request(options, (res) => {
  console.log('\n📊 Status Code:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📦 Response Body:');
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

req.write(data);
req.end();
