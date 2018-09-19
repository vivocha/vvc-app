import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'vvc-cbn-fullscreen-messages',
  templateUrl: './cbn-fullscreen-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnFullscreenMessagesComponent {

  @Input() context;

}
