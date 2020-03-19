import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'vvc-media-container',
  templateUrl: './media-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaContainerComponent implements AfterViewInit {
  @Input() context;
  @Output() onMaximize = new EventEmitter();
  @Output() normalScreen = new EventEmitter();
  @Output() cameraChange = new EventEmitter();

  @ViewChild('bigVideo', {static: true}) bigVideo: ElementRef;
  @ViewChild('localVideo', {static: true}) localVideo: ElementRef;
  @ViewChild('remoteVideo', {static: true}) remoteVideo: ElementRef;

  hideSmallVideo: boolean = false;
  switchVideo: boolean = false;
  showVideoIsPaused: boolean = false;
  userAction: boolean = false;
  ngAfterViewInited: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.ngAfterViewInited = true;
    this.cd.detectChanges();

  }
  canHideSmallVideo() {
    return !this.hideSmallVideo && (this.isLocalVideoVisible || this.isRemoteVideoVisible);
  }
  canShowSmallVideo() {
    return this.hideSmallVideo && (this.isLocalVideoVisible || this.isRemoteVideoVisible);
  }
  get bigVideoSrc() {
    if (this.ngAfterViewInited) {
      if (this.switchVideo) {
        return this.context.videoRxStream || this.context.screenRxStream || this.context.videoTxStream;
      } else {
        return this.context.screenRxStream || this.context.videoRxStream || this.context.videoTxStream;
      }
    }
  }
  get localVideoSrc() {
    if (this.ngAfterViewInited) {
      return this.context.videoTxStream;
    }
  }
  get remoteVideoSrc() {
    if (this.ngAfterViewInited) {
      if (this.switchVideo) {
        return this.context.screenRxStream || this.context.videoRxStream;
      } else {
        return this.context.videoRxStream;
      }
    }
  }
  hasMultipleVideoDevice() {
    return !!this.context.hasMultipleVideoDevice;
  }
  get isBigVideoVisible() {
    return this.context && (
      this.context.screenRxStream ||
      this.context.videoRxStream  ||
      (!this.context.screenRxStream && !this.context.videoRxStream && this.context.videoTxStream)
    );
  }
  get isLocalVideoVisible() {
    return this.context && this.context.videoTxStream && (this.context.screenRxStream || this.context.videoRxStream);
  }
  get isRemoteVideoVisible() {
    return this.context && this.context.screenRxStream && this.context.videoRxStream;
  }
  isFlipped() {
    return !this.context.screenRxStream && !this.context.videoRxStream && this.context.videoTxStream;
  }
  minMaxVideo() {
    (this.context.isFullScreen) ? this.normalScreen.emit() : this.onMaximize.emit();
  }
  playVideo() {
    if (this.ngAfterViewInited) {
      this.userAction = true;
      this.showVideoIsPaused = false;
      if (this.bigVideo && this.bigVideo.nativeElement) {
        if (this.bigVideo.nativeElement.srcObject !== this.context.videoTxStream) {
          this.bigVideo.nativeElement.muted = false;
        } else {
          this.bigVideo.nativeElement.muted = true;
        }
        if (this.bigVideo.nativeElement.paused) {
          this.bigVideo.nativeElement.play();
        }
      }
      if (this.localVideo && this.localVideo.nativeElement && this.localVideo.nativeElement.paused) {
        this.localVideo.nativeElement.play();
      }
      if (this.remoteVideo && this.remoteVideo.nativeElement && this.remoteVideo.nativeElement.paused) {
        this.remoteVideo.nativeElement.play();
      }
    }
  }
  get showLocalVideo() {
    return !this.hideSmallVideo && this.isLocalVideoVisible;
  }
  get showRemoteVideo() {
    return !this.hideSmallVideo && this.isRemoteVideoVisible;
  }
  toggleCamera() {
    this.cameraChange.emit();
  }
  toggleSmallVideo() {
    this.hideSmallVideo = !this.hideSmallVideo;
  }
  switchBigVideo() {
    this.switchVideo = !this.switchVideo;
  }
  videoOnPause(videoId, evt) {
    // console.log('videoOnPause', videoId, evt);
    this.showVideoIsPaused = true;
  }
  logVideoEvent(videoId, evt) {
    // console.log('logVideoEvent', videoId, evt);
  }
}
