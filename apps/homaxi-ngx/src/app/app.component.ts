import { Component, OnInit } from '@angular/core';
import { Project } from './project/project.component';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

const comingSoon: Project = {
  name: 'Coming Soon',
  href: '/',
  img: '/assets/comingsoon.jpg'
};

@Component({
  standalone: false,
  selector: 'bubaxi-homaxi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gridCols = 1;

  projects: Project[] = [
    {
      name: 'Quinto Zap',
      href: '/quintozap',
      img: '/assets/quintozap.jpg'
    },
    {
      name: 'SRE',
      href: '/sre',
      img: '/assets/sre.jpg'
    },
    comingSoon,
    comingSoon,
    comingSoon,
    comingSoon
  ];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.setGridCols();
    this.httpClient.get(`${environment.apiLocation}/api`)
    .pipe(catchError(err => {
      console.error(err);
      return of();
    })).subscribe(res => console.log(res));
  }

  setGridCols() {
    this.gridCols = this.getGridCols();
  }

  getGridCols() {
    const width = window.innerWidth;
    if (width < 700) return 1;
    if (width < 1200) return 2;
    return 3;
  }
}
