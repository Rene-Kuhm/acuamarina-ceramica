const https = require('https');

console.log('\n🎨 Creando SUBCATEGORÍA: Mosaicos Venecianos (bajo Mosaicos)\n');

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

console.log('📡 Autenticando como admin...');

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

      // Paso 2: Crear subcategoría
      console.log('🎨 Creando subcategoría "Mosaicos Venecianos"...\n');

      const categoryData = JSON.stringify({
        name: "Mosaicos Venecianos",
        description: "Mosaicos venecianos de alta calidad",
        parentId: "1", // ID de la categoría "Mosaicos"
        isActive: true,
        displayOrder: 1,
        metaTitle: "Mosaicos Venecianos - Aguamarina Mosaicos",
        metaDescription: "Mosaicos venecianos de alta calidad para decoración"
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
          console.log('📊 Status Code:', createRes.statusCode);
          console.log('');

          try {
            const response = JSON.parse(createBody);

            if (createRes.statusCode === 201) {
              console.log('✅ ¡ÉXITO! Subcategoría creada correctamente\n');
              console.log('📝 Detalles:');
              console.log('   ID:', response.data.id);
              console.log('   Nombre:', response.data.name);
              console.log('   Parent ID:', response.data.parent_id);
              console.log('   Slug:', response.data.slug);
              console.log('');
              console.log('🎉 ¡EL ERROR 500 ESTÁ SOLUCIONADO!');
              console.log('✅ El sistema ahora funciona correctamente');
            } else if (createRes.statusCode === 500) {
              console.log('❌ ERROR 500 - Error del servidor\n');
              console.log('📋 Response:', response);
            } else {
              console.log('⚠️  Status Code:', createRes.statusCode);
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
