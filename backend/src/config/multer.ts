import multer from 'multer';
import { resolve, extname } from 'path';
import { randomBytes } from 'crypto';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const dest = resolve(__dirname, '..', '..', 'uploads');
    callback(null, dest);
  },

  filename(req, file, callback) {
    const hash = randomBytes(6).toString('hex');
    const fileName = `${hash}-${file.originalname}`;

    callback(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    const ext = extname(file.originalname);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    if (!allowedExtensions.includes(ext))
      callback(null, false);
    else
      callback(null, true);
  }
}).single('image');

export default upload;
