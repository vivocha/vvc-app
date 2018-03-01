import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ClientContactCreationOptions} from '@vivocha/global-entities/dist/contact';
import {ContactMediaOffer} from '@vivocha/global-entities/dist';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';

@Injectable()
export class VvcContactWrap {

  private vivocha;
  private contact;
  private context;

  constructor(
    private store: Store<fromStore.AppState>,
    private dcService: VvcDataCollectionService,
    private protocolService: VvcProtocolService
  ){}

  initializeContact(vivocha, context){
    this.vivocha = vivocha;
    this.context = context;

    if (this.context.persistenceId) this.resumeContact();
    else {
      if (this.context.dataCollections && this.context.dataCollections.length > 0) {
        this.dcService.fillDataCollections(this.vivocha, this.context.dataCollections);
      }
      else this.createContact();
    }
  }
  checkForTranscript() {
    const transcript = this.contact.contact.transcript;
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
  createContact(){
    const conf = this.getContactOptions();

    this.vivocha.createContact(conf).then( (contact) => {
      this.vivocha.pageRequest('interactionCreated', contact);
      console.log('contact created, looking for the caps', contact);
      contact.getLocalCapabilities().then( caps => {
        this.dispatch(new fromStore.WidgetCapabilityLoaded({ type: 'localCaps', caps: caps }));
      });
      contact.getRemoteCapabilities().then( caps => {
        this.dispatch(new fromStore.WidgetCapabilityLoaded({ type: 'remoteCaps', caps: caps }));
      });
      this.contact = contact;
      this.mapContact();
    }, (err) => {
      console.log('Failed to create contact', err);
      this.vivocha.pageRequest('interactionFailed', err.message);
    });
  }
  dispatch(action){
    this.store.dispatch(action);
  }
  getContactOptions():ClientContactCreationOptions {
    return {
      campaignId: this.context.campaign.id,
      version: this.context.campaign.version,
      channelId: 'web',
      entryPointId: this.context.entryPointId,
      engagementId: this.context.engagementId,
      initialOffer: this.protocolService.getInitialOffer(this.context.requestedMedia),
      lang: this.context.language,
      vvcu: this.context.page.vvcu,
      vvct: this.context.page.vvct,
      first_uri: this.context.page.first_uri,
      first_title: this.context.page.first_title
    };
  }
  mapContact(){
    /*
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
    */
    this.contact.on('joined', (c) => {
      if (c.user) {
        this.onAgentJoin(c);
      } else {
        this.onLocalJoin(c);
      }
    });
    /*
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
    */
  }
  onAgentJoin(join){
    this.contact.getMedia().then( (media) => {
      const agent = { id: join.user, nick: join.nick, avatar: join.avatar};
      this.vivocha.pageRequest('interactionAnswered', agent);
      this.dispatch(new fromStore.WidgetJoined(agent));
      this.dispatch(new fromStore.WidgetMediaChange(media));
    });
  }
  onLocalJoin(join){
    if (join.reason && join.reason === 'resume') {
      this.contact.getMedia().then((media) => {
        const agent = this.contact.contact.agentInfo;
        this.dispatch(new fromStore.WidgetJoined(agent));
        this.dispatch(new fromStore.WidgetMediaChange(media));
        this.checkForTranscript();
      });
    }
  }
  resumeContact(){

  }
}