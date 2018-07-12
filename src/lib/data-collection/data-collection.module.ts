import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import { FormComponent } from './form/form.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    DataCollectionComponent
  ],
  declarations: [
    DataCollectionComponent,
    FormComponent
  ]
})
export class DataCollectionModule { }
