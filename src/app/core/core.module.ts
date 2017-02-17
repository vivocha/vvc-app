import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WindowRef} from './window.service';
import {VvcContactService} from './contact.service';
import {StoreModule} from '@ngrx/store';
import {widgetState} from './core.reducers';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({widgetState})
  ],
  declarations: [],
  providers: [
    WindowRef,
    { provide: VvcContactService, useClass: VvcContactService }
  ]
})
export class CoreModule { }
