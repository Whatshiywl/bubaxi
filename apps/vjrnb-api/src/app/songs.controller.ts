import { Controller, Get, Inject, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor, CacheKey, CACHE_MANAGER } from '@nestjs/cache-manager';
import { SongsService } from "./songs.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { Express } from 'express';

// This is a hack to make Multer available in the Express namespace
import 'multer';

@Controller('songs')
export class SongsController {

  constructor(
    private songsService: SongsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('songs')
  async getAllSongs() {
    const songs = await this.songsService.getSongs();
    return songs;
  }

  @Put()
  @UseInterceptors(FileInterceptor('csvFile'))
  async updateSongs(@UploadedFile() file: Express.Multer.File) {
    await this.cacheManager.del('songs');
    const csvData = file.buffer.toString();
    const rowCount = await this.songsService.uploadSongs(csvData);
    return { rowCount };
  }

}
