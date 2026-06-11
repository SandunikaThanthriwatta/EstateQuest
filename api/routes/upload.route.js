import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
