#!/usr/bin/env node

/**
 * Script de Testing End-to-End
 * Prueba la integración Frontend-Backend de Aguamarina Mosaicos
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(` ${title}`, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      log(`✓ ${name}`, 'green');
      return { success: true, data, status: response.status };
    } else {
      log(`✗ ${name} - Status: ${response.status}`, 'red');
      log(`  Error: ${data.message || JSON.stringify(data)}`, 'red');
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    log(`✗ ${name} - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  logSection('🚀 INICIANDO TESTS END-TO-END');
  log(`API Base URL: ${API_BASE_URL}`, 'blue');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // =====================================================
  // TEST 1: Health Check
  // =====================================================
  logSection('1️⃣  Health Check');
  results.total++;
  const healthResult = await testEndpoint(
    'GET /health',
    `${API_BASE_URL.replace('/api/v1', '')}/health`
  );
  if (healthResult.success) results.passed++;
  else results.failed++;

  // =====================================================
  // TEST 2: Productos
  // =====================================================
  logSection('2️⃣  Productos API');

  results.total++;
  const productsResult = await testEndpoint(
    'GET /products (Listar productos)',
    `${API_BASE_URL}/products`
  );
  if (productsResult.success) {
    results.passed++;
    log(`  → ${productsResult.data.meta?.total || 0} productos encontrados`, 'yellow');
  } else {
    results.failed++;
  }

  results.total++;
  const productsPaginatedResult = await testEndpoint(
    'GET /products?page=1&limit=12',
    `${API_BASE_URL}/products?page=1&limit=12`
  );
  if (productsPaginatedResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const productsSearchResult = await testEndpoint(
    'GET /products?search=ceramico',
    `${API_BASE_URL}/products?search=ceramico`
  );
  if (productsSearchResult.success) results.passed++;
  else results.failed++;

  // =====================================================
  // TEST 3: Categorías
  // =====================================================
  logSection('3️⃣  Categorías API');

  results.total++;
  const categoriesResult = await testEndpoint(
    'GET /categories (Listar categorías)',
    `${API_BASE_URL}/categories`
  );
  if (categoriesResult.success) {
    results.passed++;
    log(`  → ${categoriesResult.data?.length || 0} categorías encontradas`, 'yellow');
  } else {
    results.failed++;
  }

  // =====================================================
  // TEST 4: Autenticación
  // =====================================================
  logSection('4️⃣  Autenticación API');

  const testUser = {
    name: 'Usuario Test',
    email: `test_${Date.now()}@test.com`,
    password: 'Test123456',
  };

  results.total++;
  const registerResult = await testEndpoint(
    'POST /auth/register',
    `${API_BASE_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    }
  );

  let authToken = null;
  if (registerResult.success) {
    results.passed++;
    authToken = registerResult.data.token;
    log(`  → Usuario registrado: ${testUser.email}`, 'yellow');
    log(`  → Token recibido`, 'yellow');
  } else {
    results.failed++;
  }

  results.total++;
  const loginResult = await testEndpoint(
    'POST /auth/login',
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    }
  );
  if (loginResult.success) {
    results.passed++;
    if (!authToken) authToken = loginResult.data.token;
  } else {
    results.failed++;
  }

  if (authToken) {
    results.total++;
    const profileResult = await testEndpoint(
      'GET /auth/profile (con token)',
      `${API_BASE_URL}/auth/profile`,
      {
        headers: { 'Authorization': `Bearer ${authToken}` },
      }
    );
    if (profileResult.success) {
      results.passed++;
      log(`  → Perfil obtenido: ${profileResult.data.name}`, 'yellow');
    } else {
      results.failed++;
    }
  }

  // =====================================================
  // TEST 5: Contacto
  // =====================================================
  logSection('5️⃣  Contacto API');

  results.total++;
  const contactResult = await testEndpoint(
    'POST /contact',
    `${API_BASE_URL}/contact`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'Test Message',
        message: 'This is an automated test message',
      }),
    }
  );
  if (contactResult.success) results.passed++;
  else results.failed++;

  // =====================================================
  // RESUMEN FINAL
  // =====================================================
  logSection('📊 RESUMEN DE TESTS');

  const successRate = ((results.passed / results.total) * 100).toFixed(1);

  log(`Total de tests: ${results.total}`, 'blue');
  log(`✓ Exitosos: ${results.passed}`, 'green');
  log(`✗ Fallidos: ${results.failed}`, 'red');
  log(`Tasa de éxito: ${successRate}%`, successRate == 100 ? 'green' : 'yellow');

  console.log('\n' + '='.repeat(60) + '\n');

  if (results.failed === 0) {
    log('🎉 ¡TODOS LOS TESTS PASARON!', 'green');
    log('✅ Backend y Frontend están correctamente integrados', 'green');
    return 0;
  } else {
    log('⚠️  Algunos tests fallaron', 'yellow');
    log('Verifica que el backend esté corriendo en http://localhost:3001', 'yellow');
    return 1;
  }
}

// Ejecutar tests
runTests()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    log(`\n❌ Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
