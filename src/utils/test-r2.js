/**
 * Script de prueba para verificar la configuración de Cloudflare R2
 * 
 * Uso:
 * node src/utils/test-r2.js
 */

import 'dotenv/config';
import { testConnection, uploadImage, deleteImage } from '../config/r2.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testR2Configuration() {
  console.log('🔧 Verificando configuración de R2...\n');

  // 1. Verificar variables de entorno
  console.log('1️⃣ Verificando variables de entorno:');
  const requiredEnvVars = [
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME'
  ];

  let allEnvVarsPresent = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}: configurado`);
    } else {
      console.log(`   ❌ ${envVar}: NO configurado`);
      allEnvVarsPresent = false;
    }
  }

  if (process.env.R2_PUBLIC_URL) {
    console.log(`   ℹ️  R2_PUBLIC_URL: ${process.env.R2_PUBLIC_URL}`);
  } else {
    console.log(`   ℹ️  R2_PUBLIC_URL: no configurado (se usará URL por defecto de R2)`);
  }

  if (!allEnvVarsPresent) {
    console.log('\n❌ Faltan variables de entorno requeridas. Por favor, configúralas en tu archivo .env');
    console.log('\nConsulta CONFIGURACION_R2.md para más información.');
    process.exit(1);
  }

  console.log('\n✅ Todas las variables de entorno requeridas están configuradas.\n');

  // 2. Probar conexión con R2
  console.log('2️⃣ Probando conexión con R2...');
  const connectionSuccess = await testConnection();
  
  if (!connectionSuccess) {
    console.log('\n❌ No se pudo conectar con R2. Verifica tus credenciales y endpoint.');
    process.exit(1);
  }

  // 3. Probar subida y eliminación de archivo de prueba
  console.log('\n3️⃣ Probando subida de archivo...');
  
  try {
    // Crear un buffer de prueba (una imagen simple de 1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const testUrl = await uploadImage(testImageBuffer, 'image/png', 'test');
    console.log(`   ✅ Archivo subido exitosamente: ${testUrl}`);

    // 4. Probar eliminación
    console.log('\n4️⃣ Probando eliminación de archivo...');
    await deleteImage(testUrl);
    console.log('   ✅ Archivo eliminado exitosamente');

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('✨ Tu configuración de R2 está lista para usar.\n');
    
  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.log('\nVerifica que:');
    console.log('1. Las credenciales sean correctas');
    console.log('2. El bucket exista y tengas permisos de lectura/escritura');
    console.log('3. El endpoint esté en el formato correcto');
    console.log('\nConsulta CONFIGURACION_R2.md para más información.');
    process.exit(1);
  }
}

// Ejecutar pruebas
testR2Configuration();
