import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ContactMediaOffer} from '@vivocha/public-entities/dist/contact';
import {AppState} from '../store/reducers/main.reducer';

@Injectable()
export class VvcProtocolService {

  lastMediaChange: any;
  previousChannels = [];
  currentChannels = [];
  constructor(
    private store: Store<AppState>
  ){

  }
  confirmNeeded(offer){
    const resp = { askForConfirmation : false, offer: {}, media: '' };

    for (const i in offer) {
      switch (i) {
        case 'Voice':
          if (!this.isAlreadyConnectedWith('Voice') &&
              offer[i]['tx'] !== 'off' &&
              offer[i]['rx'] !== 'off'
          ) {
            resp.askForConfirmation = true;
            resp.offer[i] = offer[i];
          }
          break;
        case 'Video':
          if (!this.isAlreadyConnectedWith('Video') &&
              offer[i]['tx'] !== 'off' || offer[i]['rx'] !== 'off'
          ) {
            if (!this.isAlreadyConnectedWith('Voice')) {
              resp.askForConfirmation = true;
              resp.offer[i] = offer[i];
            }
          }
          break;
      }
    }
    if (resp.offer['Voice']) {
      resp.media = 'Voice';
    }
    if (resp.offer['Video']) {
      resp.media = 'Video';
    }
    return resp;

  }
  getChannels(mediaChange){
    const c = [];
    Object.keys(mediaChange).forEach( k => {
      if (mediaChange[k].tx || mediaChange[k].rx) c.push(k);
    });
    return c;
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
  isAlreadyConnectedWith(media){
    return (
      this.lastMediaChange[media] &&
      this.lastMediaChange[media].tx &&
      this.lastMediaChange[media].rx);
  }
  mergeOffer(diffOffer){
    for (const m in diffOffer) {
      if (m === 'Video' && diffOffer[m].tx === 'optional') {
        diffOffer[m].tx = 'off';
      }
      diffOffer[m].rx = (diffOffer[m].rx !== 'off');
      diffOffer[m].tx = (diffOffer[m].tx !== 'off');
    }
    return diffOffer;
  }
  setMediaChange(media){
    this.lastMediaChange = media;
  }
}