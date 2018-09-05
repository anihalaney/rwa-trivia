import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
    console.log('home');
    console.log('debug');
   }

  ngOnInit() {
    console.log("ngonit");
  }

  onClick(){
    console.log("clicked");
    this.router.navigate(["login"]);
  }
}
