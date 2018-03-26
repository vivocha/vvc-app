import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'vvc-chat',
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {

  @Input() context;
}
