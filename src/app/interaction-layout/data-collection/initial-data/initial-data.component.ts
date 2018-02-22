import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

export interface DataCollection {
  status: string;
  type: string;
}


@Component({
  selector: 'vvc-initial-data',
  templateUrl: './initial-data.component.html'
})
export class InitialDataComponent implements OnInit {

  @Input() dataCollection: DataCollection;
  @Input() variables;
  @Output() datasubmit = new EventEmitter();
  @Output() abandon = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
