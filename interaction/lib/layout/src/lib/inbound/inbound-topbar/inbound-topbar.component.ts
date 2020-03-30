import {Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
@Component({
  selector: 'vvc-inbound-topbar',
  templateUrl: './inbound-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundTopbarComponent {

  @Input() context;
  @Output() close = new EventEmitter();
}
