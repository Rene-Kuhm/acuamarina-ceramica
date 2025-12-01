const https = require('https');

console.log('\n🧪 TEST: Crear categoría padre con credenciales reales\n');

// Paso 1: Login
const loginData = JSON.stringify({
  email: 'admin@aguamarina.com',
  password: 'tr%@KqQtprL3pDRx'
});

const loginOptions = {
  hostname: 'diligent-upliftment-production-54de.up.railway.app',
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('📡 Paso 1: Haciendo login con admin@aguamarina.com...');

const loginReq = https.request(loginOptions, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const loginResponse = JSON.parse(body);

      if (!loginResponse.success) {
        console.error('❌ Error en login:', loginResponse);
        return;
      }

      console.log('✅ Login exitoso\n');
      const token = loginResponse.data.accessToken;

      // Paso 2: Crear categoría padre
      console.log('📡 Paso 2: Creando categoría padre...');

      const categoryData = JSON.stringify({
        name: "Pisos Cerámicos",
        description: "Categoría principal para pisos cerámicos",
        isActive: true,
        displayOrder: 1
      });

      const createOptions = {
        hostname: 'diligent-upliftment-production-54de.up.railway.app',
        path: '/api/v1/categories',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': categoryData.length,
          'Authorization': `Bearer ${token}`
        }
      };

      const createReq = https.request(createOptions, (createRes) => {
        let createBody = '';

        createRes.on('data', (chunk) => {
          createBody += chunk;
        });

        createRes.on('end', () => {
          console.log('\n📊 Status Code:', createRes.statusCode);
          console.log('📋 Headers:', JSON.stringify(createRes.headers, null, 2));
          console.log('\n📦 Response Body:');

          try {
            const response = JSON.parse(createBody);
            console.log(JSON.stringify(response, null, 2));

            if (createRes.statusCode === 201) {
              console.log('\n✅ ¡ÉXITO! Categoría creada correctamente');
              console.log('🎉 El error 500 está SOLUCIONADO\n');
              console.log('📝 Categoría creada:');
              console.log('   ID:', response.data.id);
              console.log('   Nombre:', response.data.name);
              console.log('   Slug:', response.data.slug);
            } else if (createRes.statusCode === 500) {
              console.log('\n❌ ERROR 500 - Error del servidor');
              console.log('📋 Detalles:', response);
              console.log('\n💡 El backend está devolviendo error 500.');
              console.log('   Esto indica un problema en el código del servidor.');
            } else {
              console.log('\n⚠️  Status Code:', createRes.statusCode);
              console.log('📋 Response:', response);
            }
          } catch (e) {
            console.log('❌ Error parseando respuesta:', e.message);
            console.log('Raw body:', createBody);
          }
        });
      });

      createReq.on('error', (error) => {
        console.error('❌ Error en creación:', error);
      });

      createReq.write(categoryData);
      createReq.end();

    } catch (e) {
      console.error('❌ Error parseando login response:', e.message);
      console.log('Body:', body);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('❌ Error en login:', error);
});

loginReq.write(loginData);
loginReq.end();
