import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-fullscreen',
  templateUrl: './fullscreen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent implements OnInit {
  @Input() state: any; //VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  @Output() minimize = new EventEmitter();
  @Output() showchat = new EventEmitter();
  @Output() mute = new EventEmitter();
  chatVisible = true;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  chatToggle() {
    this.chatVisible = !this.chatVisible;
    this.showchat.emit(this.chatVisible);
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
