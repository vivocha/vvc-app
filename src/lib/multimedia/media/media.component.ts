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

  hideVideo = false;

  constructor(private sanitizer: DomSanitizer) { }

  acceptOffer() {
    this.onAccept.emit();
  }
  hangup() {
    this.hangUp.emit();
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
