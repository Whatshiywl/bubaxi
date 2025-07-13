import { Component, isDevMode, OnInit } from '@angular/core';
import { GatewayHttpClient, HomaxiHttpClient } from '@bubaxi/gateway-http';
import { Project } from './project/project.interface';
import { environment } from '../environments/environment';

@Component({
  standalone: false,
  selector: 'bubaxi-homaxi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    GatewayHttpClient,
    HomaxiHttpClient
  ]
})
export class AppComponent implements OnInit {
  gridCols = 1;

  readonly projects: Project[];

  constructor(
    private gatewayClient: GatewayHttpClient,
    private homaxiClient: HomaxiHttpClient
  ) {
    this.projects = environment.projects;
  }

  ngOnInit() {
    this.gatewayClient.getHello().subscribe(console.log);
    this.homaxiClient.getHello().subscribe(console.log);
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

  get homeLink() {
    return isDevMode() ? 'http://localhost:8010' : 'https://bubaxi.com';
  }
}
