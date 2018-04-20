import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-template-list',
  templateUrl: './template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateListComponent {
  @Input() message;
  @Output() action = new EventEmitter();

  defaultAction(elem){
    if (elem.default_action) this.action.emit(elem.default_action);
  }
}
