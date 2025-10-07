import { Router } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = Router();
// Ruta para subir una imagen
// Configura multer para guardar el archivo con su extensión original
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // Extrae la extensión original del archivo
    const ext = path.extname(file.originalname);
    // Usa el nombre original del archivo sin la extensión + la extensión original
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});
const uploadWithExt = multer({ storage });

router.post('/', uploadWithExt.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
  }
  // Aquí podrías guardar la información de la imagen en la base de datos si es necesario
  
  res.json({ message: 'Imagen subida con éxito', file: req.file });
});


router.get('/:path', (req, res) => {
  const { path: pathName } = req.params;
  // Aquí podrías implementar la lógica para manejar la imagen según el 'path'
  const filePath = path.join('uploads', pathName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(path.resolve(filePath));
  } else {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }
});



export default router;