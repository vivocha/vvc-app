import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-recontact-form',
  templateUrl: './recontact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecontactFormComponent {

  @Input() context;
  @Output() submit = new EventEmitter();

  submitData(dc){
    this.submit.emit({
      dcDefinition: this.context.selectedRecontactItem,
      dcData: dc
    });
  }

}
