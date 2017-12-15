import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DataCollection} from '../core/core.interfaces';

@Component({
  selector: 'vvc-survey',
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  sent: boolean;

  @Input() dataCollection: DataCollection;
  @Output() datasubmit = new EventEmitter();
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
