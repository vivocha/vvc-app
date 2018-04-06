import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'vvc-full-screen-video',
  templateUrl: './full-screen-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenVideoComponent {

  @Input() context;
  @Output() muteToggle = new EventEmitter();
  @Output() videoToggle = new EventEmitter();
  @Output() displayChat = new EventEmitter();
  @Output() hangUp = new EventEmitter();
  @Output() normalScreen = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) { }

  chatToggle(){
    this.displayChat.emit(!this.context.showChatOnFullScreen);
  }
  hangup(){
    this.hangUp.emit();
  }
  toggleMute(){
    this.muteToggle.emit(!this.context.is_muted);
  }
  toggleVideo(){
    if (this.context.in_transit) return;
    this.videoToggle.emit(!this.context.video_tx);
  }
  trustedSrc(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
