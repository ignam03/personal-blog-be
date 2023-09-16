import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('archives')
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  @Post()
  create(@Body() createArchiveDto: CreateArchiveDto) {
    return this.archivesService.create(createArchiveDto);
  }

  @Get()
  findAll() {
    return this.archivesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto) {
    return this.archivesService.update(+id, updateArchiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivesService.remove(+id);
  }
}
