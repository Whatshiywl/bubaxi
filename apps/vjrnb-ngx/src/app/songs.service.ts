import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { first } from "rxjs/operators";

export interface Song {
  artist: string,
  title: string,
  style: string,
  decade?: string
}

@Injectable()
export class SongsService {

  constructor(
    private http: HttpClient
  ) { }

  getSongs() {
    return this.http.get<Song[]>('api/songs').pipe(first());
  }

  uploadSongs(file: File) {
    const formData: FormData = new FormData();
    formData.append('csvFile', file, file.name);
    return this.http.put('api/songs', formData).pipe(first());
  }

}
