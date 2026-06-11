import cloudinary from '../utils/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const uploadImage = async (req, res, next) => {
  if (!req.file) return next(errorHandler(400, 'No file provided'));
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'estate-quest', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};
