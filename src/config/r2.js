import { S3Client, PutObjectCommand, DeleteObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Configurar S3 Client compatible con R2 (AWS SDK v3)
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT, // Por ejemplo: https://ACCOUNT_ID.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto', // R2 usa 'auto' como región
  forcePathStyle: true, // Requerido para compatibilidad con R2
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // URL pública de tu bucket (opcional, si tienes dominio personalizado)

/**
 * Subir una imagen a R2
 * @param {Buffer} buffer - Buffer de la imagen
 * @param {string} mimeType - Tipo MIME de la imagen (ej: 'image/jpeg')
 * @param {string} folderPath - Ruta de carpeta opcional (ej: 'hongos')
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadImage = async (buffer, mimeType = 'image/jpeg', folderPath = 'hongos') => {
  try {
    // Generar nombre único para el archivo
    const fileExtension = mimeType.split('/')[1];
    const fileName = `${folderPath}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Retornar URL pública
    // Si tienes un dominio personalizado, úsalo
    if (PUBLIC_URL) {
      return `${PUBLIC_URL}/${fileName}`;
    }
    
    // De lo contrario, construir URL de R2
    return `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error('Error al subir imagen a R2:', error);
    throw new Error(`Error al subir imagen: ${error.message}`);
  }
};

/**
 * Eliminar una imagen de R2
 * @param {string} imageUrl - URL completa de la imagen o key del objeto
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extraer la key del URL
    let key;
    if (imageUrl.startsWith('http')) {
      // Si es una URL completa, extraer la key
      const url = new URL(imageUrl);
      key = url.pathname.substring(1); // Remover el '/' inicial
      // Si la URL incluye el bucket name, removerlo
      if (key.startsWith(`${BUCKET_NAME}/`)) {
        key = key.substring(BUCKET_NAME.length + 1);
      }
    } else {
      // Si ya es una key
      key = imageUrl;
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error al eliminar imagen de R2:', error);
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
};

/**
 * Eliminar múltiples imágenes de R2
 * @param {string[]} imageUrls - Array de URLs de imágenes
 * @returns {Promise<{success: number, failed: number}>}
 */
export const deleteMultipleImages = async (imageUrls) => {
  const results = {
    success: 0,
    failed: 0
  };

  for (const url of imageUrls) {
    try {
      await deleteImage(url);
      results.success++;
    } catch (error) {
      console.error(`Error al eliminar ${url}:`, error);
      results.failed++;
    }
  }

  return results;
};

/**
 * Verificar si la configuración de R2 está correcta
 * @returns {Promise<boolean>}
 */
export const testConnection = async () => {
  try {
    const command = new ListBucketsCommand({});
    await s3Client.send(command);
    console.log('✅ Conexión con R2 exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con R2:', error.message);
    return false;
  }
};

export default {
  uploadImage,
  deleteImage,
  deleteMultipleImages,
  testConnection,
};

