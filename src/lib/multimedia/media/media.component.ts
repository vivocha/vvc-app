import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'vvc-media',
  templateUrl: './media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent {

  @Input() context;
  @Output() onAccept = new EventEmitter();
  @Output() onReject = new EventEmitter();
  @Output() muteToggle = new EventEmitter();
  @Output() videoToggle = new EventEmitter();
  @Output() displayChat = new EventEmitter();
  @Output() hangUp = new EventEmitter();

  hideLocalVideo = false;
  hideRemoteVideo = false;

  switchVideo = false;

  constructor(private sanitizer: DomSanitizer) { }

  acceptOffer() {
    this.onAccept.emit();
  }
  hangup() {
    this.hangUp.emit();
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
  rejectIncomingOffer() {
    this.onReject.emit();
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
