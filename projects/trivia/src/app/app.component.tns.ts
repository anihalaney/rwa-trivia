import { Component, OnInit } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit { 

  constructor(){
  }
  ngOnInit(){
       // Init your component properties here.
       firebase.init({
        // Optionally pass in properties for database, authentication and cloud messaging,
        // see their respective docs.
      }).then(
        instance => {
          console.log("firebase.init done");
        },
        error => {
        }
      );
  }
}
