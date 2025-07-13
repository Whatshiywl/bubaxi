import { Component, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'bubaxi-sre-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly title = 'sre-ngx';

  constructor(
    public router: Router
  ) {

  }

  get homeLink() {
    return isDevMode() ? 'http://localhost:8010' : 'https://bubaxi.com';
  }

}
