import {VvcInteractionService} from './interaction.service';
import {WindowRef} from './window.service';
import {VvcContextService} from './context.service';
import {VvcContactWrap} from './contact-wrap.service';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';

export const services: any[] = [
  VvcInteractionService,
  VvcContextService,
  VvcContactWrap,
  VvcProtocolService,
  VvcDataCollectionService,
  WindowRef
];

export * from './interaction.service';
export * from './window.service';
export * from './contact-wrap.service';
export * from './protocol.service';
export * from './data-collection.service';
export * from './context.service';