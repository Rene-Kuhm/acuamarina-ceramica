const https = require('https');

async function testLinkImagesEndpoint() {
  console.log('🧪 PRUEBA: Endpoint /api/v1/upload/link-images en Railway\n');
  console.log('═══════════════════════════════════════════════════════\n');

  const productId = 15; // Tecnodespegue
  const testImages = [
    {
      url: 'https://res.cloudinary.com/demo/real-test1.jpg',
      cloudinaryId: 'aguamarina/products/real-test1',
      altText: 'Test real 1',
      isPrimary: true,
    }
  ];

  const data = JSON.stringify({
    productId,
    images: testImages,
  });

  const options = {
    hostname: 'diligent-upliftment-production-54de.up.railway.app',
    port: 443,
    path: '/api/v1/upload/link-images',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  console.log('📤 Enviando petición:');
  console.log(`   URL: https://${options.hostname}${options.path}`);
  console.log(`   Payload:`, JSON.stringify(JSON.parse(data), null, 2));
  console.log('');

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('📥 Respuesta recibida:');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Body:`, responseData);
      console.log('');

      if (res.statusCode === 401 || res.statusCode === 403) {
        console.log('⚠️  PROBLEMA ENCONTRADO:');
        console.log('   El endpoint requiere autenticación (token JWT)');
        console.log('   Esto explica por qué falla desde el dashboard si no hay token válido');
      } else if (res.statusCode === 404) {
        console.log('❌ PROBLEMA ENCONTRADO:');
        console.log('   El endpoint NO EXISTE en Railway');
        console.log('   Railway no ha desplegado la versión actualizada del código');
      } else if (res.statusCode === 200) {
        console.log('✅ El endpoint existe y responde correctamente');
      } else {
        console.log(`⚠️  Status code inesperado: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en la petición:', error.message);
  });

  req.write(data);
  req.end();
}

testLinkImagesEndpoint();
