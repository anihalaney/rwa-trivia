import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlogComponent, NewsletterComponent, SocialPaletteComponent } from './components';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { effects, reducer } from './store';

@NgModule({
  declarations: [
    BlogComponent,
    NewsletterComponent,
    SocialPaletteComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    //ngrx feature store
    StoreModule.forFeature('social', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),
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
