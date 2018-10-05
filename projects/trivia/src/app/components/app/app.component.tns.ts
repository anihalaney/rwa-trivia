import { Component, OnInit } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  constructor() {

  }
  ngOnInit() {

    firebase.init({}).then( (instance) => { });
  }

}
