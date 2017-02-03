import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VvcService } from './vvc.service';
import {WindowService} from './core.opaque-tokens';
import {VvcContactService} from './contact.service';
import {StoreModule} from '@ngrx/store';
import {widgetState, mediaState, mediaOffer, agent, chatMessages, dataCollections} from './core.reducers';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({widgetState, mediaState, mediaOffer, agent, chatMessages, dataCollections})
  ],
  declarations: [],
  providers: [
    { provide: WindowService, useValue: window},
    VvcService,
    VvcContactService
  ]
})
export class CoreModule { }
