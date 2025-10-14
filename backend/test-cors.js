#!/usr/bin/env node

/**
 * Script para verificar configuración CORS del backend en Vercel
 * Uso: node test-cors.js
 */

const https = require('https');

const BACKEND_URL = 'backend-fkvbr3end-rene-kuhms-projects.vercel.app';
const DASHBOARD_ORIGIN = 'https://acuamarina-ceramica-rbqj-72ndsct85-rene-kuhms-projects.vercel.app';

console.log('🔍 Testing CORS configuration...\n');

// Test 1: OPTIONS preflight request
function testPreflight() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BACKEND_URL,
      path: '/api/v1/auth/login',
      method: 'OPTIONS',
      headers: {
        'Origin': DASHBOARD_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization',
      }
    };

    console.log('1️⃣  Testing OPTIONS preflight request...');
    console.log(`   Origin: ${DASHBOARD_ORIGIN}`);
    console.log(`   Target: https://${BACKEND_URL}${options.path}\n`);

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`   Headers:`);
      console.log(`     Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
      console.log(`     Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
      console.log(`     Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
      console.log(`     Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);

      if (res.statusCode === 200 || res.statusCode === 204) {
        if (res.headers['access-control-allow-origin']) {
          console.log(`\n   ✅ OPTIONS preflight: PASSED\n`);
          resolve(true);
        } else {
          console.log(`\n   ❌ OPTIONS preflight: FAILED - No CORS headers\n`);
          resolve(false);
        }
      } else {
        console.log(`\n   ❌ OPTIONS preflight: FAILED - Status ${res.statusCode}\n`);
        resolve(false);
      }
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      reject(e);
    });

    req.end();
  });
}

// Test 2: GET request with Origin header
function testGetRequest() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BACKEND_URL,
      path: '/api/v1',
      method: 'GET',
      headers: {
        'Origin': DASHBOARD_ORIGIN,
      }
    };

    console.log('2️⃣  Testing GET request with CORS...');
    console.log(`   Origin: ${DASHBOARD_ORIGIN}`);
    console.log(`   Target: https://${BACKEND_URL}${options.path}\n`);

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   Response: ${data.substring(0, 100)}...`);
          if (res.headers['access-control-allow-origin']) {
            console.log(`\n   ✅ GET request: PASSED\n`);
            resolve(true);
          } else {
            console.log(`\n   ❌ GET request: FAILED - No CORS headers\n`);
            resolve(false);
          }
        } else {
          console.log(`\n   ❌ GET request: FAILED - Status ${res.statusCode}\n`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      reject(e);
    });

    req.end();
  });
}

// Test 3: Health check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BACKEND_URL,
      path: '/health',
      method: 'GET',
    };

    console.log('3️⃣  Testing health check...');
    console.log(`   Target: https://${BACKEND_URL}${options.path}\n`);

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   Response: ${data}`);
          console.log(`\n   ✅ Health check: PASSED\n`);
          resolve(true);
        } else {
          console.log(`\n   ❌ Health check: FAILED - Status ${res.statusCode}\n`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      reject(e);
    });

    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    const results = await Promise.all([
      testHealthCheck(),
      testPreflight(),
      testGetRequest(),
    ]);

    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RESULTS:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Health Check:      ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`OPTIONS Preflight: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`GET Request:       ${results[2] ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═══════════════════════════════════════════════════════\n');

    const allPassed = results.every(r => r === true);
    if (allPassed) {
      console.log('🎉 All tests passed! CORS is configured correctly.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Check the configuration.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

runTests();
