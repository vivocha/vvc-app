import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
   ViewChild
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'vvc-media-tools',
  templateUrl: './media-tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaToolsComponent {

  @ViewChild('theTimer') theTimer;
  @Input() state: any; //VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() mute = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) { }

  setTime(time) {
    const date = new Date(Date.UTC(1970, 8, 1, 0, 0, time));
    date.setSeconds(time);
    this.theTimer.nativeElement.innerHTML = date.toUTCString().substr(17, 8);
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
