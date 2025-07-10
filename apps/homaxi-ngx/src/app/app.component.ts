import { Component, OnInit } from '@angular/core';
import { Project } from './project/project.component';
import { GatewayHttpClient } from '@bubaxi/gateway-http';

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
  providers: [GatewayHttpClient]
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

  constructor(private client: GatewayHttpClient) {}

  ngOnInit() {
    this.client.getGatewayHello().subscribe(res => console.log(res));
    this.setGridCols();
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
