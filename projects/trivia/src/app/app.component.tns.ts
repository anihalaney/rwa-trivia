import { Component, OnInit } from '@angular/core';
const firebase = require("nativescript-plugin-firebase");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit { 

  constructor(){
    console.log('hello world 2');
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
          console.log(`firebase.init error: ${error}`);
        }
      );
  }
}
