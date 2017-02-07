import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {Http} from "@angular/http";
import { AttachmentPanelComponent } from './attachment-panel/attachment-panel.component';
import { VideoPanelComponent } from './video-panel/video-panel.component';
import { VoicePanelComponent } from './voice-panel/voice-panel.component';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/WidgetTranslations/xl8', '.json');
}


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
  ],
  exports: [
    MediaToolsComponent
  ],
  declarations: [MediaToolsComponent, AttachmentPanelComponent, VideoPanelComponent, VoicePanelComponent, EmojiPanelComponent]
})
export class MediaToolsModule {}
