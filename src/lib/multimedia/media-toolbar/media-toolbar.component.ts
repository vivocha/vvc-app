import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-media-toolbar',
  templateUrl: './media-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaToolbarComponent {

  @Input() context;
  @Output() muteToggle = new EventEmitter();
  @Output() videoToggle = new EventEmitter();
  @Output() hangUp = new EventEmitter();

  hangup() {
    this.hangUp.emit();
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
}
