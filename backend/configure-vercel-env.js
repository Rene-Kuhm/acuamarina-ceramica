#!/usr/bin/env node

/**
 * Script para configurar variables de entorno en Vercel
 * Uso: node configure-vercel-env.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando variables de entorno en Vercel...\n');

// Leer archivo .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: Archivo .env no encontrado');
  console.log('   Crea el archivo .env basado en .env.example');
  process.exit(1);
}

// Parsear .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Variables a configurar en Vercel
const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'CORS_ORIGINS',
  'API_VERSION'
];

const optionalVars = [
  'REDIS_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

// Agregar NODE_ENV=production manualmente
console.log('➕ Configurando NODE_ENV=production...');
try {
  execSync('echo "production" | vercel env add NODE_ENV production', {
    stdio: 'inherit',
    shell: true
  });
  console.log('✅ NODE_ENV configurado\n');
} catch (error) {
  console.log('⚠️  NODE_ENV ya existe o error al configurar\n');
}

// Configurar variables requeridas
console.log('📝 Configurando variables requeridas:\n');
requiredVars.forEach(varName => {
  const value = envVars[varName];

  if (!value) {
    console.log(`⏭️  Saltando ${varName} (no encontrado en .env)`);
    return;
  }

  console.log(`➕ Configurando ${varName}...`);
  try {
    const cmd = `echo "${value}" | vercel env add ${varName} production`;
    execSync(cmd, { stdio: 'inherit', shell: true });
    console.log(`✅ ${varName} configurado\n`);
  } catch (error) {
    console.log(`⚠️  ${varName} ya existe o error al configurar\n`);
  }
});

// Configurar variables opcionales
console.log('\n📝 Configurando variables opcionales:\n');
optionalVars.forEach(varName => {
  const value = envVars[varName];

  if (!value) {
    console.log(`⏭️  Saltando ${varName} (no encontrado en .env)`);
    return;
  }

  console.log(`➕ Configurando ${varName}...`);
  try {
    const cmd = `echo "${value}" | vercel env add ${varName} production`;
    execSync(cmd, { stdio: 'inherit', shell: true });
    console.log(`✅ ${varName} configurado\n`);
  } catch (error) {
    console.log(`⚠️  ${varName} ya existe o error al configurar\n`);
  }
});

console.log('\n✅ Configuración completada!\n');
console.log('📌 Próximos pasos:');
console.log('   1. Verifica las variables en: https://vercel.com/dashboard');
console.log('   2. Redeploy el proyecto:');
console.log('      cd D:\\acuamarina-ceramicos');
console.log('      mv .git .git_temp');
console.log('      cd backend');
console.log('      vercel --prod --yes');
console.log('      cd ..');
console.log('      mv .git_temp .git');
console.log('');
