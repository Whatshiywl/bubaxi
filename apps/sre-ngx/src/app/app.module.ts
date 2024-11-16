import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogConfig, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app.component';
import { RoutesModule } from './routes.module';
import { InteractiveComponent } from './interactive/interactive.component';
import { GameComponent } from './game/game.component';
import { EngineService } from './shared/engine.service';
import { SliderService } from './shared/slider.service';
import { GraphComponent } from './graph/graph.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorialService } from './tutorial/tutorial.service';

import { UtilModule } from '@bubaxi/util';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveComponent,
    GameComponent,
    GraphComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RoutesModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    BaseChartDirective,
    UtilModule
  ],
  providers: [
    EngineService,
    SliderService,
    TutorialService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        maxWidth: '80%'
      } as MatDialogConfig
    },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
