import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VvcService } from './vvc.service';

import {VvcContactService} from './contact.service';
import {StoreModule} from '@ngrx/store';
import {widgetState, mediaState, mediaOffer, agent, chatMessages, dataCollections} from './core.reducers';
import {VvcMockService} from './mock-vvc.service';
import {WindowRef} from './window.service';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({widgetState, mediaState, mediaOffer, agent, chatMessages, dataCollections})
  ],
  declarations: [],
  providers: [
    WindowRef,
    // { provide: VvcService, useClass: VvcMockService },
      VvcService,
    VvcContactService
  ]
})
export class CoreModule { }
