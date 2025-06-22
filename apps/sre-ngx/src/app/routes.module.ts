import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { InteractiveComponent } from "./interactive/interactive.component";

const routes: Routes = [
  { path: 'interactive', component: InteractiveComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: 'interactive' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [ RouterModule ]
})
export class RoutesModule {

}
