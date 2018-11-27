import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'vvc-media-container',
  templateUrl: './media-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaContainerComponent {

  @Input() context;
  @Output() onMaximize = new EventEmitter();
  @Output() normalScreen = new EventEmitter();

  @ViewChild('bigVideo') bigVideo: ElementRef;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;


  hideSmallVideo = false;
  switchVideo = false;
  showVideoIsPaused = false;
  userAction = false;
  videoPausedElement: HTMLVideoElement;

  canHideSmallVideo() {
    return !this.hideSmallVideo && (this.isVideoVisible('local') || this.isVideoVisible('remote'));
  }
  canShowSmallVideo() {
    return this.hideSmallVideo && (this.isVideoVisible('local') || this.isVideoVisible('remote'));
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
  isFlipped() {
    return !this.context.screenRxStream && !this.context.videoRxStream && this.context.videoTxStream;
  }
  minMaxVideo() {
    (this.context.isFullScreen) ? this.normalScreen.emit() : this.onMaximize.emit();
  }
  playVideo() {
    this.userAction = true;
    this.showVideoIsPaused = false;
    this.bigVideo.nativeElement.muted = true;

    if (this.bigVideo && this.bigVideo.nativeElement && this.bigVideo.nativeElement.paused) {
      this.bigVideo.nativeElement.play();
    }
    if (this.localVideo && this.localVideo.nativeElement && this.localVideo.nativeElement.paused) {
      this.localVideo.nativeElement.play();
      this.bigVideo.nativeElement.muted = false;
    }
    if (this.remoteVideo && this.remoteVideo.nativeElement && this.remoteVideo.nativeElement.paused) {
      this.remoteVideo.nativeElement.play();
    }
  }
  showLocalVideo() {
    return !this.hideSmallVideo && this.isVideoVisible('local');
  }
  showRemoteVideo() {
    return !this.hideSmallVideo && this.isVideoVisible('remote');
  }
  toggleSmallVideo() {
    this.hideSmallVideo = !this.hideSmallVideo;
  }
  switchBigVideo() {
    this.switchVideo = !this.switchVideo;
  }
  videoOnPause(videoId, err) {
    this.showVideoIsPaused = true;
  }
}
