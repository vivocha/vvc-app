import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'vvc-cbn-minimized-messages',
  templateUrl: './cbn-minimized-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnMinimizedMessagesComponent {

  @Input() context;

}
