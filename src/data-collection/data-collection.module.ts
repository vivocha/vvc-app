import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import { FormComponent } from './form/form.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import { SurveyComponent } from './survey/survey.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    DataCollectionComponent, SurveyComponent
  ],
  declarations: [DataCollectionComponent, FormComponent, SurveyComponent]
})
export class DataCollectionModule { }
