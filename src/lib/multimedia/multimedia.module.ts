import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';
import { TranslateModule } from '@ngx-translate/core';
import { FullScreenVideoComponent } from './full-screen-video/full-screen-video.component';
import { MediaContainerComponent } from './media-container/media-container.component';
import { MediaToolbarComponent } from './media-toolbar/media-toolbar.component';
import { IncomingOfferComponent } from './incoming-offer/incoming-offer.component';
import { OutgoingOfferComponent } from './outgoing-offer/outgoing-offer.component';
import { VvcCommonModule } from './../common/vvc-common.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    VvcCommonModule
  ],
  exports: [MediaComponent, FullScreenVideoComponent],
  declarations: [
    MediaComponent,
    FullScreenVideoComponent,
    MediaContainerComponent,
    MediaToolbarComponent,
    IncomingOfferComponent,
    OutgoingOfferComponent
  ]
})
export class MultimediaModule { }
