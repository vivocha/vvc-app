import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ContactMediaOffer} from '@vivocha/global-entities/dist';

@Injectable()
export class VvcProtocolService {

  constructor(
    private store: Store<fromStore.AppState>
  ){

  }
  getInitialOffer(type: string): ContactMediaOffer {
    switch (type) {
      case 'voice': return {
        Voice: { rx: 'required', tx: 'required', engine: 'WebRTC'},
        Sharing: { rx: 'required', tx: 'required'}
      };
      case 'video': return {
        Video: { rx: 'required', tx: 'required', engine: 'WebRTC'},
        Voice: { rx: 'required', tx: 'required', engine: 'WebRTC'},
        Sharing: { rx: 'required', tx: 'required'}
      };
      default: return { Chat: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'} };
    }
  }
}