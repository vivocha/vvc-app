import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy,
   ViewChild
} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'vvc-media-tools',
  templateUrl: './media-tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaToolsComponent implements OnInit, OnDestroy {

  @ViewChild('theTimer') theTimer;
  @Input() state: VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() mute = new EventEmitter();
  callInterval;


  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    let localTime = 0;
    if (!this.state.video) {
      this.callInterval = setInterval(() => {
        localTime++;
        const date = new Date(null);
        date.setSeconds(localTime);
        this.theTimer.nativeElement.innerHTML = date.toISOString().substr(11, 8);
      }, 1000);
    }
  }
  ngOnDestroy() {
    clearInterval(this.callInterval);
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
