import path from "path";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, next) => {
      next(null, file.originalname);
    },
  }),
  fileFilter: (_req, file, next) => {
    let img = path.extname(file.originalname);

    if (
      img !== ".jpg" &&
      img !== ".jpeg" &&
      img !== ".webp" &&
      img !== ".png" &&
      img !== ".mp4"
    ) {
      next(new Error(`Unsupported file type! ${img}`), false);
      return;
    }

    next(null, true);
  },
});

export default upload;
