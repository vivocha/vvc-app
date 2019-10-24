import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-cbn',
  templateUrl: './cbn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnComponent {

  @Input() context;
  @Output() minimized = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() upgrade = new EventEmitter();

  isMinimized = false;

}
