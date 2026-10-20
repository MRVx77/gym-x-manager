import multer from "multer";
import { BadRequestError } from "../lib/errors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only JPG, PNG or WebP images are allowed"));
    }
  },
});

export default upload;
