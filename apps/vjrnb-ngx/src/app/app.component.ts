import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Song, SongsService } from './songs.service';

@Component({
  selector: 'bubaxi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'vjrnb-ngx';
  file!: File;
  searchForm: FormGroup;
  results: string[] = [];
  resultSubject: Subject<Song[]> = new Subject<Song[]>();
  err = '';

  constructor(
    private songsService: SongsService,
    fb: FormBuilder
  ) {
    this.searchForm = fb.group({
      text: fb.control('')
    });
    this.searchForm.get('text')?.valueChanges
    .subscribe(value => {
      this.filter(value);
    });
    this.resultSubject.subscribe(results => this.results = results.map(r => `${r.artist} | ${r.title} | ${r.style} | ${r.decade}`));
  }

  ngOnInit() {
    this.filter();
  }

  filter(query?: string) {
    this.songsService.getSongs().subscribe(songs => {
      if (!query) return this.resultSubject.next(songs);
      const filtered = songs.map(song => {
        const score = query.split(' ').filter(Boolean).reduce((acc, r) => acc + (song.artist.includes(r) ? 1 : 0) + (song.title.includes(r) ? 1 : 0), 0);
        return { song, score };
      })
      .filter(r => r.score)
      .sort((a, b) => b.score - a.score)
      .map(r => r.song);
      this.resultSubject.next(filtered);
    });
  }

  onFileInput(event: any) {
    const target = event.target as HTMLInputElement;
    const item = target.files?.item(0);
    if (!item) return;
    this.file = item;
  }

  uploadSongs() {
    if (!this.file) return;
    this.songsService.uploadSongs(this.file).subscribe(res => {
      if (typeof res.rowCount !== 'undefined') {
        location.reload();
      } else {
        this.err = 'Error updating songs!';
      }
    }, err => {
      this.err = err.error?.message || err.message;
    });
  }
}
