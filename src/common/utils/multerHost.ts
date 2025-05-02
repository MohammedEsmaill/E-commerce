import { BadRequestException } from '@nestjs/common';
import { Request, Express } from 'express';
import { diskStorage } from 'multer';
interface MulterOptions {
    allowedExtensions: string[];
}
export const multerHost = ({allowedExtensions}: MulterOptions) => {
  const storage = diskStorage({});
  const fileFilter = (req: Request,file: Express.Multer.File,cb: Function) => {
    if (!allowedExtensions.includes(file.mimetype)) {
      return cb(new BadRequestException('invalid file type'), false);
    }
    cb(null, true);
  };
  return {storage,fileFilter}
};
