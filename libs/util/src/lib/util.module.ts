import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from './util.service';

@NgModule({
  providers: [UtilService],
  imports: [CommonModule]
})
export class UtilModule { }
