import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { BlogComponent, NewsletterComponent } from  './components';

@NgModule({
  declarations: [
    BlogComponent,
    NewsletterComponent
  ],
  imports: [
    //rwa modules
    SharedModule
  ],
  providers: [ 
  ],                                                                      
  exports:  [ 
    BlogComponent, 
    NewsletterComponent 
  ]
})
export class SocialModule { }
