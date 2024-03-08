import {
  Controller,
  Post,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  Get,
  Body,
} from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDto } from '../auth/dto/register-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('archives')
export class ArchivesController {
  constructor(
    private readonly archivesService: ArchivesService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() body: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    console.log(body);
    const res = this.cloudinary.uploadImage(file);
    console.log(res);
    //return this.cloudinary.uploadImage(file);
  }

  @Get('list')
  findAll() {
    return this.archivesService.findAll();
  }
}
