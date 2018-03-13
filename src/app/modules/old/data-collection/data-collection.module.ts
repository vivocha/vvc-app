import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey/survey.component';
import { FormComponent } from './form/form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IncDcComponent } from './inc-dc/inc-dc.component';
import { DcViewerComponent } from './dc-viewer/dc-viewer.component';
import { InitialDataComponent } from './initial-data/initial-data.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    SurveyComponent,
    IncDcComponent,
    DcViewerComponent,
    InitialDataComponent
  ],
  declarations: [
    FormComponent,
    SurveyComponent,
    IncDcComponent,
    DcViewerComponent,
    InitialDataComponent
  ]
})
export class DataCollectionModule { }
