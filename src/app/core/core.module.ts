import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WindowRef} from './window.service';
import {VvcContactService} from './contact.service';
import {StoreModule} from '@ngrx/store';
import {widgetState, messages} from './core.reducers';
import {VvcDataCollectionService} from './dc.service';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({widgetState, messages})
  ],
  declarations: [],
  providers: [
    WindowRef,
    { provide: VvcContactService, useClass: VvcContactService },
    { provide: VvcDataCollectionService, useClass: VvcDataCollectionService}
  ]
})
export class CoreModule { }
