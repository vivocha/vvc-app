import {Component, OnInit, Input} from '@angular/core';
import {DataCollection} from '../core/core.interfaces';

@Component({
  selector: 'vvc-survey',
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {

  @Input() dataCollection: DataCollection;

  constructor() { }

  ngOnInit() {
  }

}
