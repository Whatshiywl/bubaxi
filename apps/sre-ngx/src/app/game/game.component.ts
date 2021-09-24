import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bubaxi-sre-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  ngOnInit(): void {
    console.log('GameComponent OnInit');
  }

}
