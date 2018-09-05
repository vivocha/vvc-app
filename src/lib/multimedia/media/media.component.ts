import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-media',
  templateUrl: './media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent {

  @Input() context;
  @Output() onAccept = new EventEmitter();
  @Output() onReject = new EventEmitter();
  @Output() onMaximize = new EventEmitter();
  @Output() displayChat = new EventEmitter();
  @Output() muteToggle = new EventEmitter();
  @Output() videoToggle = new EventEmitter();
  @Output() hangUp = new EventEmitter();


  isMediaToolbarVisible() {
    return (this.context.videoRxStream || this.context.videoTxStream || this.context.voiceRxStream);
  }



}
