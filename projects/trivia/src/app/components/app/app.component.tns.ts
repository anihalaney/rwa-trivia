import { Component, OnInit } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase'
import { AuthenticationProvider } from '../../../../../shared-library/src/lib/core/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthenticationProvider) {

  }
  ngOnInit() {

    firebase.init({}).then((instance) => { });
  }

}
