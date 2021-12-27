import { CacheInterceptor, Controller, Get, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// This is a hack to make Multer available in the Express namespace
import 'multer';

@Controller('songs')
export class SongsController {

  constructor(
    private songsService: SongsService
  ) { }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllSongs() {
    const songs = await this.songsService.getSongs();
    return songs;
  }

  @Put()
  @UseInterceptors(FileInterceptor('csvFile'))
  async updateSongs(@UploadedFile() file: Express.Multer.File) {
    const csvData = file.buffer.toString();
    const rowCount = await this.songsService.uploadSongs(csvData);
    return { rowCount };
  }

}
