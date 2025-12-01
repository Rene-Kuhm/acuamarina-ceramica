const https = require('https');

console.log('\n🧪 TEST: Crear categoría padre en producción\n');

// Paso 1: Login para obtener token
const loginData = JSON.stringify({
  email: 'admin@aguamarina.com',
  password: 'Admin@123'
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

console.log('📡 Paso 1: Haciendo login...');

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
      
      // Paso 2: Crear categoría
      console.log('📡 Paso 2: Creando categoría padre...');
      
      const categoryData = JSON.stringify({
        name: "Categoría de Prueba",
        description: "Esta es una categoría de prueba",
        isActive: true,
        displayOrder: 0
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
          console.log('\n📦 Response:');
          try {
            const response = JSON.parse(createBody);
            console.log(JSON.stringify(response, null, 2));
            
            if (createRes.statusCode === 201) {
              console.log('\n✅ ¡ÉXITO! Categoría creada correctamente');
              console.log('🎉 El error 500 está SOLUCIONADO\n');
            } else {
              console.log('\n❌ ERROR:', createRes.statusCode);
              console.log('📋 Detalles del error:', response);
            }
          } catch (e) {
            console.log(createBody);
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
