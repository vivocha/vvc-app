import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-cbn-minimized',
  templateUrl: './cbn-minimized.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CbnMinimizedComponent {

  @Input() context;
  @Output() expand = new EventEmitter();
  @Output() close = new EventEmitter();
}
