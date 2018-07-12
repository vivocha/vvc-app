import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-survey',
  templateUrl: './survey.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyComponent {

  @Input() context;
  @Output() submit = new EventEmitter();

  submitData(dc){
    this.submit.emit({
      surveyDefinition: this.context.selectedSurvey,
      surveyData: dc
    });
  }
}
