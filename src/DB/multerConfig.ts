import { BadRequestException } from '@nestjs/common';
import { Request, Express } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
interface MulterOptions {
    uploadPath: string;
    allowedExtensions: string[];
}
export const multerConfig = ({uploadPath = "Generals",allowedExtensions}: MulterOptions) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
        const destPath = path.resolve(`uploads/${uploadPath}`)
      if (!fs.existsSync(destPath)){
        fs.mkdirSync(destPath, { recursive: true });
      }
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: Function,
  ) => {
    if (!allowedExtensions.includes(file.mimetype)) {
      return cb(new BadRequestException('invalid file type'), false);
    }
    cb(null, true);
  };
  return {
    storage,
    fileFilter,
  }
};
