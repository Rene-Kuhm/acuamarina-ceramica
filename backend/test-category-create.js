const axios = require('axios');

const API_URL = 'https://diligent-upliftment-production-54de.up.railway.app/api/v1';

async function testCategoryCreation() {
  try {
    console.log('🔐 Paso 1: Iniciando sesión como admin...\n');

    // Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@aguamarina.com',
      password: 'Admin123!'
    });

    const { accessToken } = loginResponse.data;
    console.log('✅ Login exitoso');
    console.log('Token:', accessToken.substring(0, 20) + '...\n');

    console.log('📝 Paso 2: Creando una categoría de prueba...\n');

    // Create category
    const categoryData = {
      name: 'Cerámica de Prueba',
      description: 'Esta es una categoría de prueba creada via API',
      isActive: true,
      displayOrder: 1
    };

    const createResponse = await axios.post(
      `${API_URL}/categories`,
      categoryData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Categoría creada exitosamente:');
    console.log('ID:', createResponse.data.data.id);
    console.log('Nombre:', createResponse.data.data.name);
    console.log('Slug:', createResponse.data.data.slug);
    console.log('');

    console.log('📋 Paso 3: Verificando que la categoría aparece en la lista...\n');

    // Get all categories
    const categoriesResponse = await axios.get(`${API_URL}/categories`);

    console.log('✅ Categorías en la base de datos:', categoriesResponse.data.data.length);
    categoriesResponse.data.data.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

    console.log('\n✅ ¡Todo funciona correctamente!');
    console.log('\n📌 IMPORTANTE: Recuerda eliminar la categoría de prueba desde el dashboard.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log('\n⚠️  Error de autenticación. Verifica las credenciales del admin.');
    }

    if (error.response?.status === 400) {
      console.log('\n⚠️  Datos inválidos enviados a la API.');
      console.log('Detalles:', error.response.data);
    }
  }
}

testCategoryCreation();
