import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { EngineService } from "../shared/engine.service";
import { TutorialComponent } from "./tutorial.component";

@Injectable()
export class TutorialService {

  constructor (
    private dialog: MatDialog,
    private engine: EngineService
  ) { }

  open(text: string, options: string[] = [ 'Ok' ]) {
    return  new Promise<{ index: number, answer: string }>(resolve => {
      this.engine.pause();
      const ref = this.dialog.open(TutorialComponent, { data: { text, options } });
      ref.afterClosed().pipe(first()).subscribe(result => {
        this.engine.resume();
        resolve(result);
      });
    });
  }

}
