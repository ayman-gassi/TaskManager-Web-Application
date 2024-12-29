import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for storing files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get user email from the token (already decoded in auth middleware)
        const userEmail = req.user.email;
        // Create safe directory name from email
        const safeUserDir = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Create base upload directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Create user directory if it doesn't exist
        const userDir = path.join(uploadDir, safeUserDir);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }

        // Create type-specific directories if they don't exist
        const profilesDir = path.join(userDir, 'profiles');
        const bannersDir = path.join(userDir, 'banners');
        if (!fs.existsSync(profilesDir)) {
            fs.mkdirSync(profilesDir);
        }
        if (!fs.existsSync(bannersDir)) {
            fs.mkdirSync(bannersDir);
        }

        // Set destination based on file type
        const finalDir = file.fieldname === 'profileImage' ? profilesDir : bannersDir;
        cb(null, finalDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Export the multer middleware
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
