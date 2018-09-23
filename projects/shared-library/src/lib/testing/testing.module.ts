import { NgModule } from '@angular/core';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './router-stubs';

//NOTE: this module is needed only for aot compilation
//The aot compiler needs all components/directives to be declared in a module
//This module is not being used
//Refer to https://github.com/angular/angular/issues/13590

@NgModule({
  declarations: [
    RouterLinkStubDirective, RouterOutletStubComponent
  ],
  providers: [ 
  ]
})
export class TestingModule { }
