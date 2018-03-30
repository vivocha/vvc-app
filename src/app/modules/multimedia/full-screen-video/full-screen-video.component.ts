import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-full-screen-video',
  templateUrl: './full-screen-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenVideoComponent {

  @Input() context;

  constructor(private sanitizer: DomSanitizer) { }


  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
