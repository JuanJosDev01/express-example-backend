import { 
  findByHongoId, 
  findById, 
  create, 
  remove, 
  removeByHongoId,
  countByHongoId 
} from "../repositories/hongos-imagenes.js";
import { findById as findHongoById } from "../repositories/hongos.js";
import { uploadImage, deleteImage } from "../config/r2.js";

/**
 * Obtener todas las imágenes de un hongo
 */
export const getImagenesByHongoId = async (id_hongo) => {
  // Verificar que el hongo existe
  const hongo = await findHongoById(id_hongo);
  if (!hongo) {
    throw new Error('Hongo no encontrado');
  }
  
  const imagenes = await findByHongoId(id_hongo);
  return imagenes;
};

/**
 * Obtener una imagen específica por su ID
 */
export const getImagenById = async (id) => {
  const imagen = await findById(id);
  if (!imagen) {
    throw new Error('Imagen no encontrada');
  }
  return imagen;
};

/**
 * Crear una nueva imagen para un hongo
 * @param {number} id_hongo - ID del hongo
 * @param {Buffer} imagenBuffer - Buffer de la imagen
 * @param {string} mimeType - Tipo MIME de la imagen (ej: 'image/jpeg')
 */
export const createImagen = async (id_hongo, imagenBuffer, mimeType = 'image/jpeg') => {
  // Verificar que el hongo existe
  const hongo = await findHongoById(id_hongo);
  if (!hongo) {
    throw new Error('Hongo no encontrado');
  }
  
  // Subir imagen a R2
  const urlImagen = await uploadImage(imagenBuffer, mimeType, `hongos/${id_hongo}`);
  
  // Guardar URL en la base de datos
  const id = await create(id_hongo, urlImagen);
  
  return { id, url: urlImagen };
};

/**
 * Crear múltiples imágenes para un hongo
 * @param {number} id_hongo - ID del hongo
 * @param {Array<{buffer: Buffer, mimeType: string}>} imagenesData - Array con buffers y tipos MIME
 */
export const createMultipleImagenes = async (id_hongo, imagenesData) => {
  // Verificar que el hongo existe
  const hongo = await findHongoById(id_hongo);
  if (!hongo) {
    throw new Error('Hongo no encontrado');
  }
  
  const results = [];
  for (const imagenData of imagenesData) {
    const { buffer, mimeType = 'image/jpeg' } = imagenData;
    
    // Subir imagen a R2
    const urlImagen = await uploadImage(buffer, mimeType, `hongos/${id_hongo}`);
    
    // Guardar URL en la base de datos
    const id = await create(id_hongo, urlImagen);
    
    results.push({ id, url: urlImagen });
  }
  
  return results;
};

/**
 * Eliminar una imagen específica
 */
export const deleteImagen = async (id) => {
  // Verificar que la imagen existe
  const imagen = await findById(id);
  if (!imagen) {
    throw new Error('Imagen no encontrada');
  }
  
  // Eliminar de R2
  try {
    await deleteImage(imagen.url_imagen);
  } catch (error) {
    console.error('Error al eliminar imagen de R2:', error);
    // Continuar con la eliminación de la DB incluso si falla R2
  }
  
  // Eliminar de la base de datos
  const success = await remove(id);
  return success;
};

/**
 * Eliminar todas las imágenes de un hongo
 */
export const deleteImagenesByHongoId = async (id_hongo) => {
  // Verificar que el hongo existe
  const hongo = await findHongoById(id_hongo);
  if (!hongo) {
    throw new Error('Hongo no encontrado');
  }
  
  // Obtener todas las imágenes antes de eliminarlas
  const imagenes = await findByHongoId(id_hongo);
  
  // Eliminar de R2
  for (const imagen of imagenes) {
    try {
      await deleteImage(imagen.url_imagen);
    } catch (error) {
      console.error(`Error al eliminar imagen ${imagen.id} de R2:`, error);
      // Continuar con las demás imágenes
    }
  }
  
  // Eliminar de la base de datos
  const deletedCount = await removeByHongoId(id_hongo);
  return deletedCount;
};

/**
 * Contar imágenes de un hongo
 */
export const countImagenesByHongoId = async (id_hongo) => {
  const count = await countByHongoId(id_hongo);
  return count;
};

