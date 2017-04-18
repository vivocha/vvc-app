import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DataCollection} from '../core/core.interfaces';

@Component({
  selector: 'vvc-survey',
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {

  public sent = false;
  @Input() dataCollection: DataCollection;
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  sendSurvey(formValue) {
    this.sent = true;
  }

}
