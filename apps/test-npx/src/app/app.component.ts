import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bubaxi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-npx';
  message$: Observable<string>;

  constructor(client: HttpClient) {
    this.message$ = client.get<{ message: string }>('api').pipe(map(res => res.message));
  }
}
