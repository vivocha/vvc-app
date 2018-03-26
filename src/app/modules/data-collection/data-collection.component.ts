import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-data-collection',
  templateUrl: './data-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataCollectionComponent {

  @Input() context;
  @Output() submit = new EventEmitter();

  submitData(dc){
    console.log('submitting dc', dc);
    this.submit.emit({
      dcDefinition: this.context.selectedDataCollection,
      dcData: dc
    });
  }
}
