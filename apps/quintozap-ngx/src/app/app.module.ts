import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapModule } from './map/map.module';
import { ZapService } from './zap.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuintoService } from './quinto.service';
import { InfoComponent } from './info/info.component';
import { StorageService } from './storage.service';
import { AuthModule } from '@bubaxi/auth';
import { PreferencesService } from './preferences.service';
import { QuintozapHttpClient } from '@bubaxi/gateway-http';

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
    PreferencesService,
    QuintozapHttpClient
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
