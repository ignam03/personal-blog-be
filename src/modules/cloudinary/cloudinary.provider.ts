import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/constants/constants';

const configService = new ConfigService();

export const CloudinaryProvider = {
  provide: CLOUDINARY,

  useFactory: (): any => {
    return v2.config({
      cloud_name: configService.get<string>('CLOUD_NAME'),
      api_key: configService.get<string>('API_KEY'),
      api_secret: configService.get<string>('API_SECRET'),
    });
  },
};
