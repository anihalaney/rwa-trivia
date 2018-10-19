import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CheckBox } from 'nativescript-checkbox';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

const data = [{id: 1, name: 'name 1', image: 'image'},
              {id: 2, name: 'name 2', image: 'image'},
              {id: 3, name: 'name 3', image: 'image'},
              {id: 1, name: 'name 1', image: 'image'},
              {id: 2, name: 'name 2', image: 'image'},
              {id: 3, name: 'name 3', image: 'image'},
              {id: 1, name: 'name 1', image: 'image'},
              {id: 2, name: 'name 2', image: 'image'},
              {id: 3, name: 'name 3', image: 'image'} ];

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit, OnDestroy {

  @ViewChild('contactListview') listViewComponent: RadListViewComponent;
  playerMode = 0;
  showSelectPlayer = false;
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  constructor() { }

  ngOnInit() {
    this.dataItem = data;

    // this.dataItem = ['s', 's', 'd'];
  }

  ngOnDestroy() { }

  addTag() { }

  startGame() { }
}
