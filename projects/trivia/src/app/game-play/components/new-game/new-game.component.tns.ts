import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() {
    console.log('new game');
   }

  ngOnDestroy() {

  }
}
