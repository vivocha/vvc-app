import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-cbn-topbar',
  templateUrl: './cbn-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnTopbarComponent {

  @Input() context;
  @Input() showMessages: boolean;
  @Output() minimize = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() close = new EventEmitter();

}
