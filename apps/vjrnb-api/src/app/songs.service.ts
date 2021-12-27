import { Injectable } from "@nestjs/common";
import { KnexService } from "./knex.service";
import * as csv from '@fast-csv/parse';
import { v5 as uuidv5 } from 'uuid';

@Injectable()
export class SongsService {
  private readonly uuidNamespace = '6a7fa79e-4051-44c6-b01f-f47d7970a0a0';

  constructor(
    private readonly knex: KnexService
  ) { }

  getSongs() {
    return this.knex.songs.select('*');
  }

  uploadSongs(csvData: string) {
    return new Promise<number>(resolve => {
      const stream = csv.parseString(csvData, { headers: false, skipRows: 1 });
      stream.on('error', err => console.error(err));
      stream.on('end', (rowCount: number) => resolve(rowCount - 1));
      stream.on('data', async (row: string[]) => {
        const [ artist, title, style, decade ] = row;
        const data = { artist, title, style, decade };
        await this.uploadSong(data);
      });
    });
  }

  async uploadSong(song: {
    artist: string,
    title: string,
    style: string,
    decade?: string
  }) {
    // const baseName = `${song.artist.toLowerCase().trim()},${song.title.toLowerCase().trim()}`;
    const baseName = [
      song.artist,
      song.title
    ].map(v => v.toLowerCase().trim().replace(/[^a-z]/g, '')).join(',');
    const id = uuidv5(baseName, this.uuidNamespace);
    const data = { id, ...song };
    return this.knex.songs.insert(data).onConflict('id').merge();
  }

}
