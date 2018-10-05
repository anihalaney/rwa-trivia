import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';

@Component({
  selector: 'login-home',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(
    private tnsFirebaseService: FirebaseService
  ) {
  }


  ngOnInit() {
  }

  /**
   * Google Login
   */
  googleLogin() {
    this.tnsFirebaseService.googleConnect();

  }

  /**
   * Facebook Login
   */
  facebookLogin() {
    this.tnsFirebaseService.facebookConnect();
  }

}
