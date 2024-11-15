import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';

import { ChartsModule } from 'ng2-charts';

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
    ChartsModule,
    UtilModule
  ],
  providers: [
    EngineService,
    SliderService,
    TutorialService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
      hasBackdrop: true,
      disableClose: true,
      maxWidth: '80%'
    } as MatDialogConfig}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
