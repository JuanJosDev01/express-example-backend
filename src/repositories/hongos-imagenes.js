import { query } from "../db/index.js";

/**
 * Obtener todas las imágenes de un hongo específico
 */
export const findByHongoId = async (id_hongo) => {
  const sql = "SELECT id, id_hongo, url_imagen, fecha_creacion FROM hongos_imagenes WHERE id_hongo = ?";
  const params = [id_hongo];
  const results = (await query(sql, params)).rows;
  return results;
};

/**
 * Obtener una imagen específica por su ID
 */
export const findById = async (id) => {
  const sql = "SELECT id, id_hongo, url_imagen, fecha_creacion FROM hongos_imagenes WHERE id = ?";
  const params = [id];
  const results = (await query(sql, params)).rows;
  return results[0];
};

/**
 * Crear una nueva imagen para un hongo con URL de R2
 */
export const create = async (id_hongo, urlImagen) => {
  const sql = `INSERT INTO hongos_imagenes (id_hongo, url_imagen) VALUES (?, ?)`;
  const params = [id_hongo, urlImagen];
  const result = (await query(sql, params)).lastInsertRowid;
  return result;
};

/**
 * Eliminar una imagen específica
 */
export const remove = async (id) => {
  const sql = "DELETE FROM hongos_imagenes WHERE id = ?";
  const params = [id];
  const result = (await query(sql, params)).rowsAffected > 0;
  return result;
};

/**
 * Eliminar todas las imágenes de un hongo
 */
export const removeByHongoId = async (id_hongo) => {
  const sql = "DELETE FROM hongos_imagenes WHERE id_hongo = ?";
  const params = [id_hongo];
  const result = (await query(sql, params)).rowsAffected;
  return result;
};

/**
 * Contar cuántas imágenes tiene un hongo
 */
export const countByHongoId = async (id_hongo) => {
  const sql = "SELECT COUNT(*) as total FROM hongos_imagenes WHERE id_hongo = ?";
  const params = [id_hongo];
  const results = (await query(sql, params)).rows;
  return results.rows[0].total;
};

