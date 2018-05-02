import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlogComponent, NewsletterComponent, SocialPaletteComponent } from './components';

@NgModule({
  declarations: [
    BlogComponent,
    NewsletterComponent,
    SocialPaletteComponent
  ],
  imports: [
    //rwa modules
    SharedModule
  ],
  providers: [
  ],
  exports: [
    BlogComponent,
    NewsletterComponent,
    SocialPaletteComponent
  ]
})
export class SocialModule { }
