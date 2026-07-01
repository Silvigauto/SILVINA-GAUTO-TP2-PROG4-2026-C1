import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

obtenerStorage(carpeta: string) {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: carpeta,
      public_id: (req: any, file: any) => `IMG_${Date.now()}`,
    } as any,
  });
}
}