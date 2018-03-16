import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-template-generic',
  templateUrl: './template-generic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateGenericComponent {

  @Input() message;
  @Output() action = new EventEmitter();
}
