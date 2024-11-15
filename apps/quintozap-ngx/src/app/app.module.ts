import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapModule } from './map/map.module';
import { ZapService } from './zap.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuintoService } from './quinto.service';
import { InfoComponent } from './info/info.component';
import { SwiperModule } from 'swiper/angular';
import { StorageService } from './storage.service';
import { AuthModule } from '@bubaxi/auth';
import { PreferencesService } from './preferences.service';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    SwiperModule,
    MatChipsModule,
    ClipboardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    AuthModule
  ],
  providers: [
    ZapService,
    QuintoService,
    StorageService,
    PreferencesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
