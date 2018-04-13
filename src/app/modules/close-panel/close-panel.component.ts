import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-close-panel',
  templateUrl: './close-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClosePanelComponent {

  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();

}
