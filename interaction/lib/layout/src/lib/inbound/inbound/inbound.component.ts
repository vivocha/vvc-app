import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-inbound',
  templateUrl: './inbound.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundComponent {

  @Input() context;
  @Output() close = new EventEmitter();
}
