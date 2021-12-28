import { Injectable } from "@nestjs/common";
import { KnexService } from "./knex.service";
import * as csv from '@fast-csv/parse';
import { v5 as uuidv5 } from 'uuid';

export interface Song {
  artist: string,
  title: string,
  style: string,
  decade?: string
}

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
      const songs: Song[] = [ ];
      const stream = csv.parseString(csvData, { headers: false, skipRows: 1 });
      stream.on('error', err => {
        throw err;
      });
      stream.on('data', async (row: string[]) => {
        const [ artist, title, style, decade ] = row;
        const song = { artist, title, style, decade };
        if (!song.artist || !song.title || !song.style) {
          console.error('incomplete song', song);
          throw new Error('Incomplete song!');
        }
        songs.push(song);
      });
      stream.on('end', async (rowCount: number) => {
        await Promise.all(songs.map(song => this.uploadSong(song)));
        resolve(rowCount - 1);
      });
    });
  }

  async uploadSong(song: {
    artist: string,
    title: string,
    style: string,
    decade?: string
  }) {
    const baseName = [
      song.artist,
      song.title
    ].map(v => v.toLowerCase().trim().replace(/[^a-z]/g, '')).join(',');
    const id = uuidv5(baseName, this.uuidNamespace);
    const data = { id, ...song };
    return this.knex.songs.insert(data).onConflict('id').merge();
  }

}
