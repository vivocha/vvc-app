import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

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

  @Output() onAccept = new EventEmitter();
  @Output() onReject = new EventEmitter();


  hideLocalVideo = false;
  hideRemoteVideo = false;

  switchVideo = false;

  chatToggle() {
    this.displayChat.emit(!this.context.showChatOnFullScreen);
  }
  isMediaToolbarVisible() {
    return (this.context.videoRxStream || this.context.videoTxStream || this.context.voiceRxStream);
  }

}
