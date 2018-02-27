import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

export interface DataCollection {
  status: string;
  type: string;
}

@Component({
  selector: 'vvc-survey',
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  sent: boolean;

  @Input() dataCollection: DataCollection;
  @Input() variables;
  @Output() datasubmit = new EventEmitter();
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
