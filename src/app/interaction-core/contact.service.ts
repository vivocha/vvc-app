import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';

import { ClientContactCreationOptions } from '@vivocha/global-entities/dist/contact';
import { InteractionContext } from '@vivocha/client-visitor-core/dist/widget.d';
import { VivochaVisitorContact } from '@vivocha/client-visitor-core/dist/contact.d';
import { VvcOffer, WidgetState } from './store/models.interface';

import * as fromStore from './store';

@Injectable()
export class VvcContactService {
  vivocha;
  agentInfo;
  contact: VivochaVisitorContact;
  isWritingTimer;
  isWritingTimeout = 30000;
  agentRequestCallback;
  mediaCallback;
  incomingOffer: VvcOffer;
  incomingId;
  callStartedWith;
  voiceStart = new EventEmitter();
  widgetState: WidgetState;

  constructor(private store: Store<fromStore.AppState>, private zone: NgZone) {
    store.subscribe( state => {
      this.widgetState = <WidgetState> state.widgetState;
    });
  }
  acceptOffer(opts) {
    const diffOffer = this.incomingOffer;
    this.callStartedWith = 'VOICE';
    if (opts === 'voice-only' && diffOffer.Video) {
      diffOffer.Video.tx = 'off';
      this.callStartedWith = 'VIDEO';
    }
    if (opts === 'video-full' && diffOffer.Video) {
      diffOffer.Video.tx = 'required'; // TODO CHECK FOR CAPS
      this.callStartedWith = 'VIDEO';
    }
    this.mergeOffer(diffOffer);
    this.dispatch(new fromStore.UpdateMessage({
      id: this.incomingId,
      state: 'loading'
    }))
  }
  acceptRequest(res, msg) {
    this.agentRequestCallback(null, res);
    this.dispatch(new fromStore.RemoveMessage({ id: this.incomingId }));
    this.dispatch(new fromStore.NewMessage({
      id: new Date().getTime(),
      type: 'incoming-request',
      media: msg.media,
      state: 'closed',
      text: msg.text + '_ACCEPTED'
    }))
  }
  addLocalVideo() {
    this.contact.getMediaOffer().then(mediaOffer => {
      if (mediaOffer['Video']) {
        mediaOffer['Video'].tx = 'required';
      }
      return this.contact.offerMedia(mediaOffer);
    });
  }
  askForUpgrade(media, startedWith) {
    this.callStartedWith = startedWith;
    this.dispatch(new fromStore.MediaOffering(true));
    if (media === startedWith) {
      this.incomingId = new Date().getTime();
      this.dispatch(new fromStore.NewMessage({
        id: this.incomingId,
        media: this.callStartedWith,
        state: 'loading',
        type: 'incoming-request'
      }))
    }
    return this.contact.getMediaOffer().then(offer => {
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
      return this.contact.offerMedia(offer).then(() => {
        this.dispatch(new fromStore.MediaOffering(false));
      }, (err) => {
        let reason = 'REJECTED';
        if (err === 'bad_state') {
          reason = 'FAILED';
        }
        this.dispatch(new fromStore.MediaOffering(false));
        this.dispatch(new fromStore.RemoveMessage({ id: this.incomingId }));
        this.dispatch(new fromStore.NewMessage({
          id: new Date().getTime(),
          type: 'incoming-request',
          media: this.callStartedWith,
          state: 'closed',
          extraClass: 'rejected',
          text: 'STRINGS.MESSAGES.REMOTE_' + this.callStartedWith + '_' + reason
        }))
      });
    });
  }
  checkForTranscript() {
    const transcript = this.contact.contact.transcript;
    if (transcript && transcript.length > 0) {
      this.dispatch(new fromStore.ReduceTopbar());
    }
    for (const m in transcript) {
      const msg = transcript[m];
      switch (msg.type) {
        case 'text':
          this.dispatch(new fromStore.NewMessage({text: msg.body, type: 'chat', isAgent: msg.agent}));
          break;
        case 'attachment':
          this.dispatch(new fromStore.NewMessage({
            text: msg.meta.desc || msg.meta.originalName,
            type: 'chat',
            isAgent: msg.agent,
            meta: msg.meta,
            url: (msg.meta.originalUrl) ? msg.meta.originalUrl : msg.url,
            from_nick: msg.from_nick,
            from_id: msg.from_id
          }));
          break;
      }
    }
  }
  clearIsWriting() {
    clearTimeout(this.isWritingTimer);
    this.dispatch(new fromStore.RemoveIsWriting());
    this.dispatch(new fromStore.AgentIsWriting(false));
  }
  closeContact() {
    if (this.contact) {
      this.contact.leave();
    }
  }
  createContact(conf: ClientContactCreationOptions, context: InteractionContext) {
    this.callStartedWith = context.requestedMedia.toUpperCase();
    this.dispatch(new fromStore.InitialOffer({ offer: conf.initialOffer, context: context}));
    this.vivocha.createContact(conf).then((contact) => {
      this.vivocha.pageRequest('interactionCreated', contact);
      console.log('contact created, looking for the caps', contact);
      contact.getLocalCapabilities().then( caps => {
        this.dispatch(new fromStore.LocalCaps(caps));
      });
      contact.getRemoteCapabilities().then( caps => {
        this.dispatch(new fromStore.RemoteCaps(caps));
      });
      this.contact = contact;
      this.mapContact();
      if (context.requestedMedia !== 'chat') {
        this.voiceStart.emit();
      }
    }, (err) => {
      console.log('Failed to create contact', err);
      this.vivocha.pageRequest('interactionFailed', err.message);
    });
  }
  denyOffer(media) {
    this.mediaCallback('error', {});
    this.dispatch(new fromStore.RemoveMessage({ id: this.incomingId }));
    this.dispatch(new fromStore.NewMessage({
      id: new Date().getTime(),
      type: 'incoming-request',
      media: media,
      state: 'closed',
      extraClass: 'rejected',
      text: 'STRINGS.MESSAGES.' + media + '_REJECTED'
    }))
  }
  denyRequest(res, msg) {
    this.agentRequestCallback(null, res);
    this.dispatch(new fromStore.RemoveMessage({ id: this.incomingId }));
    this.dispatch(new fromStore.NewMessage({
      id: new Date().getTime(),
      type: 'incoming-request',
      media: msg.media,
      state: 'closed',
      extraClass: 'rejected',
      text: msg.text + '_REJECTED'
    }))
  }
  dispatch(action) {
    this.zone.run( () => {
      this.store.dispatch(action);
    });
  }
  dispatchConnectionMessages(newMedia) {
    const hasVoice = !!(newMedia['Voice'] &&
      newMedia['Voice']['data'] &&
      newMedia['Voice']['data']['tx_stream'] &&
      newMedia['Voice']['data']['rx_stream']);

    if (!this.widgetState.voice && hasVoice) {
      this.dispatch(new fromStore.RemoveMessage({ id: this.incomingId }));
      this.dispatch(new fromStore.NewMessage({
        id: new Date().getTime(),
        type: 'incoming-request',
        media: this.callStartedWith,
        state: 'closed',
        extraClass: 'accepted',
        text: 'STRINGS.MESSAGES.' + this.callStartedWith + '_STARTED'
      }));
    }
    if (this.widgetState.voice && !hasVoice) {
      this.dispatch(new fromStore.NewMessage({
        id: new Date().getTime(),
        type: 'incoming-request',
        media: this.callStartedWith,
        state: 'closed',
        extraClass: 'accepted',
        text: 'STRINGS.MESSAGES.' + this.callStartedWith + '_ENDED'
      }))
    }
  }
  getUpgradeState(mediaObject) {
    for (const m in mediaObject) {
      mediaObject[m].rx = (mediaObject[m].rx !== 'off');
      mediaObject[m].tx = (mediaObject[m].tx !== 'off');
    }
    return mediaObject;
  }
  fetchDataCollection(dc) {
    this.dispatch(new fromStore.AddDataCollection(dc));
    this.dispatch(new fromStore.NewMessage({
      id: new Date().getTime(),
      type: 'incoming-request',
      media: 'DC',
      state: 'open',
      dataCollection: dc
    }))
  }
  hangup() {
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
  init(vivocha) {
    this.vivocha = vivocha;
  }
  isIncomingRequest(offer): { askForConfirmation: boolean, offer: VvcOffer, media: string} {
    const resp = { askForConfirmation : false, offer: {}, media: '' };
    for (const i in offer) {
      switch (i) {
        case 'Voice':
          if (!this.widgetState[i.toLowerCase()]
            && offer[i]['tx'] !== 'off'
            && offer[i]['rx'] !== 'off') {
            resp.askForConfirmation = true;
            resp.offer[i] = offer[i];
          }
          break;
        case 'Video':
          if (!this.widgetState[i.toLowerCase()]
            && ( offer[i]['tx'] !== 'off' || offer[i]['rx'] !== 'off')) {
            if (!this.widgetState['voice']) {
              resp.askForConfirmation = true;
            }
            resp.offer[i] = offer[i];
          }
          break;
      }
    }
    if (resp.offer['Voice']) {
      resp.media = 'VOICE';
    }
    if (resp.offer['Video']) {
      resp.media = 'VIDEO';
    }
    return resp;
  }
  mapContact() {
    console.log('mapping stuff on the contact');
    //MARCO - ADD TEMPORARY ON ACTION TO RECEIVE NEW MEDIA MESSAGES
    this.contact.on('action', (action_code, args) => {
      if (action_code === 'quick') {
        const quick = {
          code: 'message',
          type: 'text',
          body: 'Pick a size',
          quick_replies: [
            { content_type: 'text', title: 'Small', payload: 'SMALL', image_url: '' },
            { content_type: 'text', title: 'Medium', payload: 'MEDIUM', image_url: '' },
            { content_type: 'text', title: 'Large', payload: 'LARGE', image_url: '' }
          ]
        };
        quick.type = 'quick-replies';
        this.dispatch(new fromStore.NewMessage(quick));
      }
      if (action_code === 'template'){
        const template = {
          type: 'template',
          template: 'generic',
          elements: [
            {
              title: "Titolo",
              subtitle: "Sottotitolo",
              image_url: "https://image.freepik.com/free-vector/web-development-and-graphic-design-banners_23-2147526170.jpg",
              default_action: {
                type: "web_url",
                url: "https://image.freepik.com"
              },
              buttons: [
                { type: "web_url", title: "Visualizza Dettaglio", url: "https://image.freepik.com/free-vector/" },
                { type: "postback", title: "Transfer Chat", payload: { agentId: 'Pippo', whatever: 'whatever' }}
              ]
            }
          ]
        }
        this.dispatch(new fromStore.NewMessage(template));

      }
      this.clearIsWriting();
    });
    this.contact.on('DataCollection', (dataCollection, cb) => {
      this.fetchDataCollection(dataCollection);
    });
    this.contact.on('agentrequest', (message, cb) => {
      this.onAgentRequest(message, cb);
    });
    this.contact.on('attachment', (url, meta, fromId, fromNick, isAgent) => {
      const attachment = {url, meta, fromId, fromNick, isAgent};
      this.dispatch(new fromStore.NewMessage({
        text: meta.desc || meta.originalName,
        type: 'chat',
        isAgent: isAgent,
        meta: meta,
        url: (meta.originalUrl) ? meta.originalUrl : url,
        from_nick: fromNick,
        from_id: fromId
      }))

    });
    this.contact.on('capabilities', caps => {
      this.dispatch(new fromStore.RemoteCaps(caps));
    });
    this.contact.on('iswriting', (from_id, from_nick, agent) => {
      if (agent) {
        this.setIsWriting();
      }
    });
    this.contact.on('joined', (c) => {
      if (c.user) {
        this.onAgentJoin(c);
      } else {
        this.onLocalJoin(c);
      }
    });
    this.contact.on('left', obj => {
      console.log('LEFT', obj);
      if (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) {
        this.sendCloseMessage();
      }
    });
    this.contact.on('localcapabilities', caps => {
      this.dispatch(new fromStore.LocalCaps(caps));
    });
    this.contact.on('localtext', (text) => {
      this.dispatch(new fromStore.NewMessage({text: text, type: 'chat', isAgent: false}));
    });
    this.contact.on('mediachange', (media, changed) => {
      this.dispatchConnectionMessages(media);
      this.dispatch(new fromStore.MediaChange(media));
    });
    this.contact.on('mediaoffer', (offer, cb) => {
      this.onMediaOffer(offer, cb);
    });
    this.contact.on('text', (text, from_id, from_nick, agent ) => {
      this.dispatch(new fromStore.ReduceTopbar());
      this.dispatch(new fromStore.NewMessage({text: text, type: 'chat', isAgent: agent}));
      if (this.widgetState && (this.widgetState.minimized || !this.widgetState.chatVisibility)) {
        this.dispatch(new fromStore.IncrementNotRead());
      }
      this.playAudioNotification();
      this.clearIsWriting();
    });
    this.contact.on('transferred', (transferred_to) => {
      this.dispatch(new fromStore.NewMessage({
        id: new Date().getTime(),
        type: 'incoming-request',
        media: 'TRANSFER',
        state: 'closed',
        extraClass: 'rejected',
        text: 'STRINGS.MESSAGES.TRANSFERRED'
      }))
    });
  }
  mergeOffer (diffOffer) {
    for (const m in diffOffer) {
      if (m === 'Video' && diffOffer[m].tx === 'optional') {
        diffOffer[m].tx = 'off';
      }
      diffOffer[m].rx = (diffOffer[m].rx !== 'off');
      diffOffer[m].tx = (diffOffer[m].tx !== 'off');
    }
    this.contact.mergeMedia(diffOffer).then(mergedMedia => {
      this.mediaCallback(undefined, mergedMedia);
    });
  }
  muteAudio(muted) {
    this.dispatch(new fromStore.MuteInProgress(true));
    this.contact.getMediaEngine('WebRTC').then( engine => {
      if (muted) {
        engine.muteLocalAudio();
      } else {
        engine.unmuteLocalAudio();
      }
      this.dispatch(new fromStore.MuteInProgress(false));
      this.dispatch(new fromStore.Mute(muted));
    });
  }
  onAgentJoin(join) {
    this.contact.getMedia().then( (media) => {
      const agent = { id: join.user, nick: join.nick, avatar: join.avatar};
      this.agentInfo = agent;
      this.vivocha.pageRequest('interactionAnswered', agent);
      this.dispatch(new fromStore.Joined(agent));
      this.dispatch(new fromStore.MediaChange(media));
    });
  }
  onAgentRequest(message, cb) {
    this.agentRequestCallback = cb;
    this.incomingId = new Date().getTime();
    this.dispatch(new fromStore.NewMessage({
      id: this.incomingId,
      state: 'open',
      media: 'REQUEST_' + message,
      accept: true,
      decline: false,
      type: 'incoming-request',
      text: 'STRINGS.MESSAGES.' + message.toUpperCase()
    }))
  }
  onLocalJoin(join) {
    if (join.reason && join.reason === 'resume') {
      this.contact.getMedia().then((media) => {
        const agent = this.contact.contact.agentInfo;
        this.dispatch(new fromStore.Joined(agent));
        this.dispatch(new fromStore.MediaChange(media));
        this.checkForTranscript();
      });
    }
  }
  onMediaOffer(offer, cb) {
    this.mediaCallback = cb;
    const confirmation = this.isIncomingRequest(offer);
    if (confirmation.askForConfirmation) {
      this.incomingId = new Date().getTime();
      this.incomingOffer = confirmation.offer;
      this.dispatch(new fromStore.NewMessage({
        id: this.incomingId,
        media: confirmation.media,
        accept: 'video-full',
        conditional: 'voice-only',
        decline: confirmation.media,
        state: 'open',
        type: 'incoming-offer',
        text: 'STRINGS.MESSAGES.' + confirmation.media + '_REQUEST'
      }))
    } else {
      this.mergeOffer(offer);
    }
  }
  playAudioNotification() {
    const notif = new Audio();
    notif.src = 'assets/static/beep.mp3';
    notif.load();
    notif.play();
  }
  removeLocalVideo() {
    this.contact.getMediaOffer().then(mediaOffer => {
      if (mediaOffer['Video']) {
        mediaOffer['Video'].tx = 'off';
      }
      this.contact.offerMedia(mediaOffer);
    });
  }
  resumeContact(context: InteractionContext) {
    this.callStartedWith = context.requestedMedia.toUpperCase();
    this.vivocha.dataRequest('getData', 'persistence.contact').then((contactData) => {
      this.dispatch(new fromStore.InitialOffer({
        offer: contactData.initial_offer,
        context: context
      }));
      this.vivocha.resumeContact(contactData).then((contact) => {
        this.vivocha.pageRequest('interactionCreated', contact);
        console.log('contact created, looking for the caps', contact);
        contact.getLocalCapabilities().then( caps => {
          this.dispatch(new fromStore.LocalCaps(caps));
        });
        contact.getRemoteCapabilities().then( caps => {
          this.dispatch(new fromStore.RemoteCaps(caps));
        });
        this.contact = contact;
        this.mapContact();
      }, (err) => {
        console.log('Failed to resume contact', err);
        this.vivocha.pageRequest('interactionFailed', err.message);
      });
    });
  }
  sendAttachment(msg) {
    const ref = new Date().getTime();
    this.contact.attach(msg.file, msg.text).then( () => {
      this.dispatch(new fromStore.RemoveMessage({id: ref}));
    }, () => {
      this.dispatch(new fromStore.RemoveMessage({id: ref}));
    });
    this.dispatch(new fromStore.NewMessage({
      id: ref, state: 'uploading', type: 'chat', isAgent: false
    }))
  }
  sendCloseMessage() {
    this.dispatch(new fromStore.NewMessage({
      id: new Date().getTime(),
      type: 'incoming-request',
      media: 'AGENTCLOSE',
      state: 'closed',
      extraClass: 'rejected',
      text: 'STRINGS.MESSAGES.REMOTE_CLOSE'
    }));
    this.dispatch(new fromStore.CloseContact(true));
    this.dispatch(new fromStore.RemoveIsWriting());
  }
  sendDataCollection(obj) {
    const dc = obj.dataCollection;
    const message = obj.msg;
    this.dispatch(new fromStore.UpdateMessage({id: message.id, state: 'closed'}));
    this.dispatch(new fromStore.MergeDataCollection(dc));
  }
  sendPostBack(payload: any){
    console.log('dispatching from contact service', payload);
  }
  sendText(text: string) {
    this.contact.sendText(text);
  }
  setIsWriting() {
    clearTimeout(this.isWritingTimer);
    this.dispatch(new fromStore.AgentIsWriting(true));
    this.dispatch(new fromStore.NewMessage({ type: 'chat', state: 'iswriting', isAgent: true}))
    this.isWritingTimer = setTimeout( () => {
      this.dispatch(new fromStore.RemoveIsWriting());
      this.dispatch(new fromStore.AgentIsWriting(false));
    }, this.isWritingTimeout);
  }
  syncDataCollection(dataCollection) {
    this.dispatch(new fromStore.MergeDataCollection(dataCollection));
  }
  upgradeMedia(upgradeState) {
    this.contact.mergeMedia(this.getUpgradeState(upgradeState)).then( (mergedMedia) => {
      if (this.mediaCallback) {
        this.mediaCallback(null, mergedMedia);
      }
    });
  }
}
