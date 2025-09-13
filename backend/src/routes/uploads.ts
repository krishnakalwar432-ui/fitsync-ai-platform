import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload images
router.post('/images', authenticateToken, upload.single('file'), asyncHandler(async (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
  const fileUrl = `uploads/images/${Date.now()}-${req.file.originalname}`;
  
  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    size: req.file.size
  });
}));

export default router;