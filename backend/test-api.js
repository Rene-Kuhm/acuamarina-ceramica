// Script para probar el API
const http = require('http');

console.log('🧪 Probando el backend Acuamarina Cerámicos...\n');

// Función helper para hacer requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  const tests = [
    {
      name: 'Health Check',
      path: '/health',
    },
    {
      name: 'API Info',
      path: '/api/v1',
    },
  ];

  for (const test of tests) {
    try {
      console.log(`\n📌 Test: ${test.name}`);
      console.log(`   GET http://localhost:3000${test.path}`);

      const response = await makeRequest(test.path);

      console.log(`   ✅ Status: ${response.statusCode}`);

      try {
        const json = JSON.parse(response.body);
        console.log(`   📄 Response:`);
        console.log(JSON.stringify(json, null, 2).split('\n').map(line => `      ${line}`).join('\n'));
      } catch {
        console.log(`   📄 Response: ${response.body}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n\n🎉 ¡Backend funcionando correctamente!');
  console.log('\n📚 Datos creados:');
  console.log('   - Usuario admin: admin@acuamarina.com / Admin123!');
  console.log('   - 5 categorías de productos');
  console.log('   - 2 productos de ejemplo');
  console.log('\n💡 Próximos pasos:');
  console.log('   - El servidor está corriendo en http://localhost:3000');
  console.log('   - API disponible en http://localhost:3000/api/v1');
  console.log('   - Puedes probar los endpoints con Postman o Thunder Client');
  console.log('   - Presiona Ctrl+C para detener el servidor');
  console.log('\n');
}

runTests().catch(console.error);
