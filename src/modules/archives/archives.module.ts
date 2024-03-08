import { Module } from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { ArchivesController } from './archives.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ArchivesController],
  providers: [ArchivesService],
  imports: [CloudinaryModule],
})
export class ArchivesModule {}
