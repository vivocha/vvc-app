import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './core.interfaces';

class MockContact {

  callbacks = {};

  constructor(confObj) {

  }
  getMediaOffer() {
    return Promise.resolve(true);
  }
  emit(eventId, args) {
    this.callbacks[eventId](...args);
  }
  on(eventId, callback) {
    this.callbacks[eventId] = callback;
  }
}

@Injectable()
export class MockContactService {

  agentInfo;
  contact: MockContact;
  isWritingTimer;
  isWritingTimeout = 30000;
  mediaCallback;

  constructor( private store: Store<AppState>,
               private zone: NgZone) { }
  diffOffer(currentOffer, offer) {

  }
  dispatch(action) {
    this.zone.run( () => {
      this.store.dispatch(action);
    });
  }
  init(confObj) {
    this.contact = new MockContact(confObj);
    this.mapContact();
  }
  mapContact() {
    this.contact.on('action', (action_code, args) => {
      if (action_code === 'DataCollection') {
        this.showDataCollection(args[0].id);
      }
    });
    this.contact.on('attachment', (url, meta, fromId, fromNick, isAgent) => {
      const attachment = {url, meta, fromId, fromNick, isAgent};
      this.dispatch({
        type: 'ADD_TEXT',
        payload: {
          text: meta.desc,
          agent: isAgent ? Object.assign({}, this.agentInfo) : {},
          type: isAgent ? 'AGENT-ATTACHMENT' : 'CUSTOMER-ATTACHMENT',
          meta: meta,
          url: (meta.originalUrl) ? meta.originalUrl : url,
          from_nick: fromNick,
          from_id: fromId
        }
      });

    });
    this.contact.on('capabilities', function(){
      // console.log('remote capabilities', arguments);
    });
    this.contact.on('iswriting', (from_id, from_nick, agent) => {
      if (agent) {
        clearTimeout(this.isWritingTimer);
        this.dispatch({type: 'ADD_TEXT', payload: { type: 'AGENT-WRITING' }});
        this.isWritingTimer = setTimeout( () => {
          this.dispatch({type: 'REM_TEXT', payload: { type: 'AGENT-WRITING' }});
        }, this.isWritingTimeout);
      }
    });
    this.contact.on('joined', (c) => {
      if (c.user) {
        this.onAgentJoin(c);
      } else {
        this.onLocalJoin(c);
      }
    });
    this.contact.on('localcapabilities', function(){
      // console.log('localcapabilities', arguments);
    });
    this.contact.on('localtext', (text) => {
      this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'CUSTOMER'}});
    });
    this.contact.on('mediachange', (media, changed) => {
      this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
    });
    this.contact.on('mediaoffer', (offer, cb) => {
      this.mediaCallback = cb;
      this.contact.getMediaOffer().then( currentOffer => {
        const diff = this.diffOffer(currentOffer, offer);
        this.dispatch({type: 'MEDIA_OFFER', payload: { offer: offer, diff: diff }});
      });
    });
    this.contact.on('text', (text, from_id, from_nick, agent ) => {
      if (agent) {
        this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'AGENT'}});
      } else {
        this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'CUSTOMER'}});
      }
    });
    this.contact.on('transferred', (transferred_to) => {
      this.dispatch({type: 'ADD_TEXT', payload: {
        text: 'CHAT.TRANSFER', type: 'AGENT-INFO'}});
    });
  }
  onAgentJoin(c) {

  }
  onLocalJoin(c) {

  }
  showDataCollection(dcId) {

  }
}
