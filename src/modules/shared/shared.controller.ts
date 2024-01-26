import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SharedService } from './shared.service';
import { CreateSharedDto } from './dto/create-shared.dto';
import { UpdateSharedDto } from './dto/update-shared.dto';

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post()
  create(@Body() createSharedDto: CreateSharedDto) {
    return this.sharedService.create(createSharedDto);
  }

  @Get()
  findAll() {
    return this.sharedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sharedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSharedDto: UpdateSharedDto) {
    return this.sharedService.update(+id, updateSharedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sharedService.remove(+id);
  }
}
