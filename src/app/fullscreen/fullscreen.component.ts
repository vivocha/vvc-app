import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-fullscreen',
  templateUrl: './fullscreen.component.html'
})
export class FullscreenComponent implements OnInit {
  @Input() state: VvcWidgetState;
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
