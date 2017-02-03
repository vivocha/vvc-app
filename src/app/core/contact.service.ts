import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, DataCollectionState} from './core.interfaces';

const dc2: DataCollectionState = {
    state: 'visible',
    dataCollection: {
        key: 'DC.USER.TITLE',
        name: 'data_collection',
        desc: 'Initial Data Collection',
        data: [
            {
                key: 'DC.USER.NICKNAME',
                controlType: 'vvc-input',
                name: 'codiceUtente',
                desc: 'identificativo utente',
                type: 'nickname',
                config: {
                    required: true,
                    min: 5
                },
                visible: true
            },
            {
                key: 'DC.USER.USERID',
                controlType: 'vvc-input',
                name: 'polizzaUtente',
                desc: 'codice polizza utente',
                type: 'text',
                config: {
                    required: true,
                    min: 3,
                    max: 3
                },
                visible: true
            },
            {
                key: 'DC.USER.USERID',
                controlType: 'vvc-input',
                name: 'polizzaUtente2',
                desc: 'codice polizza utente2',
                type: 'text',
                config: {
                    required: true,
                    min: 3,
                    max: 3
                },
                visible: true
            },
            {
                key: 'DC.USER.PRIVACY.LABEL',
                controlType: 'vvc-privacy',
                name: 'privacy',
                desc: 'accetta privacy',
                type: 'privacy',
                config: {
                    required: true,
                },
                policy: {
                    key: 'DC.USER.PRIVACY.POLICY',
                    linkLabel: 'DC.USER.PRIVACY.LINK'

                }
            }
        ]
    }
};

@Injectable()
export class VvcContactService {

  agentInfo;
  contact;
  isWritingTimer;
  isWritingTimeout = 30000;
  statusMessageUpdate = 3000;
  mediaCallback;
  mediaState;

  constructor( private store: Store<AppState>,
               private zone: NgZone) { }
  acceptOffer(diffOffer) {
    for (const m in diffOffer) {
        diffOffer[m].rx = (diffOffer[m].rx !== 'off');
        diffOffer[m].tx = (diffOffer[m].tx !== 'off');
    }
    this.contact.mergeMedia(diffOffer).then(mergedMedia => {
        this.mediaCallback(undefined, mergedMedia);
    });
}
  askForUpgrade(media) {
    this.store.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'OREQUEST'} });
    this.contact.getMediaOffer().then(offer => {
        if (media === 'VIDEO') {
            offer.Video = {
                tx: 'required',
                rx: 'required',
                via: 'net',
                engine: 'WebRTC'
            };
        }
        if (media === 'VIDEO' || media === 'VOICE') {
            offer.Voice = {
                tx: 'required',
                rx: 'required',
                via: 'net',
                engine: 'WebRTC'
            };
        }
        this.contact.offerMedia(offer).then(() => {
            this.store.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'READY'} });
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'CHAT.MEDIA_ACCEPTED',
                type: 'AGENT-INFO',
                isEmph: true
            }});
        }, (err) => {
            let reason = 'REJECTED';
            if (err === 'bad_state') {
                reason = 'FAILED';
            }
            this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'OREQUEST', error: reason }});
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'SMARTBAR.MEDIA_' + reason,
                type: 'AGENT-INFO',
                isError: true
            }});
            setTimeout( () => {
                this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'READY' }});
            }, this.statusMessageUpdate);
        });
    });
  }
  checkForTranscript() {
    const transcript = this.contact.contact.transcript;
    for (const m in transcript) {
        const msg = transcript[m];
        switch (msg.type) {
            case 'text':
                this.dispatch({type: 'ADD_TEXT', payload: {text: msg.body, type: msg.agent ? 'AGENT' : 'CUSTOMER' }});
                break;
            case 'attachment':
                this.dispatch({
                    type: 'ADD_TEXT',
                    payload: {
                        text: msg.meta.desc,
                        agent: msg.agent ? Object.assign({}, this.agentInfo) : {},
                        type: msg.agent ? 'AGENT-ATTACHMENT' : 'CUSTOMER-ATTACHMENT',
                        meta: msg.meta,
                        url: msg.url,
                        from_nick: msg.from_nick,
                        from_id: msg.from_id
                    }
                });
                break;
        }
    }
  }
  denyOffer() {
    this.mediaCallback('error', {});
  }
  diffOffer(currentOffer, incomingOffer, flat?) {
      let hasAdded = false;
      let hasChanged = false;
      let hasRemoved = false;

      let diff = { added: {}, changed: {}, removed: {} };
      let flatDiff = { added: [], changed: [], removed: [] };
      for (let m in incomingOffer){
          if (currentOffer[m]){
              let changed = false;
              if (currentOffer[m].rx !== incomingOffer[m].rx) changed = true;
              if (currentOffer[m].tx !== incomingOffer[m].tx) changed = true;
              if (currentOffer[m].engine !== incomingOffer[m].engine) changed = true;
              if (currentOffer[m].via !== incomingOffer[m].via) changed = true;
              if (changed){
                  hasChanged = true;
                  diff.changed[m] = incomingOffer[m];
                  flatDiff.changed.push(m);
              }
          }
          else {
              if(incomingOffer[m].rx !== "off") {
                  hasAdded = true;
                  diff.added[m] = incomingOffer[m];
                  flatDiff.added.push(m);
              }
          }
      }
      for (let c in currentOffer){
          if (!incomingOffer[c]){
              hasRemoved = true;
              diff.removed[c] = currentOffer[c];
              flatDiff.removed.push(c);
          }
      }
      if (!hasAdded) delete diff.added;
      if (!hasChanged) delete diff.changed;
      if (!hasRemoved) delete diff.removed;
      return (flat) ? flatDiff : diff;
  }
  dispatch(action) {
    this.zone.run( () => {
      this.store.dispatch(action);
    });
  }
  downgrade(media) {
    if (media === 'VOICE') {
        this.contact.getMediaOffer().then(mediaOffer => {
            if (mediaOffer['Voice']) {
                mediaOffer['Voice'].tx = 'off';
                mediaOffer['Voice'].rx = 'off';
            }
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
                mediaOffer['Video'].rx = 'off';
            }
            this.contact.offerMedia(mediaOffer);
        });
    }
    if (media === 'VIDEO') {
        this.contact.getMediaOffer().then(mediaOffer => {
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
                mediaOffer['Video'].rx = 'off';
            }
            this.contact.offerMedia(mediaOffer);
        });
    }
  }
  getMediaState(){
    return this.mediaState;
  }
  getUpgradeState(mediaObject){
        for(let m in mediaObject){
            mediaObject[m].rx = (mediaObject[m].rx !== 'off');
            mediaObject[m].tx = (mediaObject[m].tx !== 'off');
        }
        return mediaObject
    }
  init(contact) {
    this.contact = contact;
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
  muteAudio(muted) {
    this.contact.getMediaEngine('WebRTC').then( engine => {
        if (muted) {
            engine.muteLocalAudio();
        } else {
            engine.unmuteLocalAudio();
        }
    });
  }
  onAgentJoin(join) {
      this.contact.getMedia().then( (media) => {
          const agent = { user: join.user, nick: join.nick, avatar: join.avatar}
          this.agentInfo = agent;
          this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
          this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'READY' }});
          this.dispatch({ type: 'ADD_AGENT', payload: agent});
          this.dispatch({ type: 'ADD_TEXT', payload: {
              text: 'CHAT.WELCOME',
              type: 'AGENT-INFO', agent: Object.assign({}, this.agentInfo)
          }});
      });
  }
  onLocalJoin(join) {
      if (join.reason && join.reason == 'resume') {
          this.contact.getMedia().then((media) => {
              this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
              this.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'READY'}});
              this.agentInfo = this.contact.contact.agentInfo;
              this.dispatch({type: 'ADD_AGENT', payload: this.agentInfo});
              this.dispatch({
                  type: 'ADD_TEXT', payload: {
                      text: 'CHAT.WELCOME',
                      type: 'AGENT-INFO', agent: Object.assign({}, this.agentInfo)
                  }
              });
              this.checkForTranscript();
          });
      }
  }
  sendAttachment(msg) {
    const ref = new Date().getTime();
    this.contact.attach(msg.file, msg.text).then( () => {
      this.dispatch({ type: 'REM_BY_REF', payload: ref });
    }, () => {
      this.dispatch({ type: 'REM_BY_REF', payload: ref });
      this.dispatch({ type: 'ADD_TEXT', payload: {
        text: 'CHAT.FILE_TRANSFER_FAILED',
        type: 'AGENT-INFO'
      } });
    });
    this.dispatch({
      type: 'ADD_TEXT', payload: {
        text: 'CHAT.FILE_TRANSFER',
        type: 'AGENT-INFO',
        ref: ref
      }
    });
  }
  sendText(text: string) {
    this.contact.sendText(text);
  }
  showDataCollection(dataId) {
      switch (dataId) {
          case 'user':
              this.dispatch({ type: 'NEW_DC', payload: dc2});
              break;
          default: break;
      }
  }
  upgradeMedia(upgradeState) {
    this.contact.mergeMedia(this.getUpgradeState(upgradeState)).then( (mergedMedia) => {
        if (this.mediaCallback) {
            this.mediaCallback(null, mergedMedia);
        }
    });
  }
}
