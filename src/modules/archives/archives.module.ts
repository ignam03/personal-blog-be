import { Module } from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { ArchivesController } from './archives.controller';

@Module({
  controllers: [ArchivesController],
  providers: [ArchivesService],
})
export class ArchivesModule {}
