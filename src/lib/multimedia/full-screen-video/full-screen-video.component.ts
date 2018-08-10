import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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

  hideLocalVideo = false;
  hideRemoteVideo = false;

  switchVideo = false;

  constructor(private sanitizer: DomSanitizer) { }

  chatToggle() {
    this.displayChat.emit(!this.context.showChatOnFullScreen);
  }
  getSrcForVideo(type: 'big' | 'local' | 'remote') {
    switch (type) {
      case 'big':
        if (this.switchVideo) {
          return this.context.videoRxStream || this.context.screenRxStream || this.context.videoTxStream;
        } else {
          return this.context.screenRxStream || this.context.videoRxStream || this.context.videoTxStream;
        }
      case 'local':
        return this.context.videoTxStream;
      case 'remote':
        if (this.switchVideo) {
          return this.context.screenRxStream || this.context.videoRxStream;
        } else {
          return this.context.videoRxStream;
        }
    }
  }
  hangup() {
    this.hangUp.emit();
  }
  isMediaToolbarVisible() {
    return (this.context.videoRxStream || this.context.videoTxStream || this.context.voiceRxStream);
  }
  isFlipped() {
    return !this.context.screenRxStream && !this.context.videoRxStream && this.context.videoTxStream;
  }
  isVideoVisible(type: 'big' | 'local' | 'remote') {
    switch (type) {
      case 'big':
        return (
          this.context.screenRxStream ||
          this.context.videoRxStream  ||
          (!this.context.screenRxStream && !this.context.videoRxStream && this.context.videoTxStream)
        );
      case 'local':
        return (
          this.context.videoTxStream && (this.context.screenRxStream || this.context.videoRxStream)
        );
      case 'remote':
        return (
          this.context.screenRxStream && this.context.videoRxStream
        );
    }
  }
  toggleMute() {
    this.muteToggle.emit(!this.context.isMuted);
  }
  toggleVideo() {
    if (this.context.inVideoTransit) {
      return;
    }
    this.videoToggle.emit(!this.context.videoTxStream);
  }
  trustedSrc(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
