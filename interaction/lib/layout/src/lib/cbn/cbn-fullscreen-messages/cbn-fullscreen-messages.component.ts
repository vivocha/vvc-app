import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-cbn-fullscreen-messages',
  templateUrl: './cbn-fullscreen-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnFullscreenMessagesComponent {

  @Input() context;
  @Output() upgrade = new EventEmitter();

}
