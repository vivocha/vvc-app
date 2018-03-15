import {Injectable, NgZone} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ClientContactCreationOptions} from '@vivocha/global-entities/dist/contact';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';
import {InteractionContext} from '@vivocha/client-visitor-core/dist/widget';
import {VvcEventEmit} from '../store/actions';
import {VvcMessageService} from './messages.service';

@Injectable()
export class VvcContactWrap {

  private vivocha;
  private contact;
  private context;

  lastSystemMessageId;
  agent;

  constructor(
    private store: Store<fromStore.AppState>,
    private dcService: VvcDataCollectionService,
    private protocolService: VvcProtocolService,
    private messageService: VvcMessageService,
    private zone: NgZone
  ){}

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
    this.setQueueState();
    const conf = this.getContactOptions();
    this.vivocha.createContact(conf).then( (contact) => {
      this.contact = contact;
      this.mapContact();
    }, (err) => {
      console.log('Failed to create contact', err);
      this.vivocha.pageRequest('interactionFailed', err.message);
    });
  }
  dispatch(action){
    //console.log('emitting outside the zone', action);
    //this.zone.run( () => {
      //console.log('emitting inside the zone', action);
      this.store.dispatch(action);
    //});
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
  hasDataCollection() {
    return (this.context.dataCollections && this.context.dataCollections.length > 0);
  }
  hasRecallForNoAgent(){
    return false;
  }
  initializeContact(vivocha, context){
    this.vivocha = vivocha;
    this.context = context;
    if (this.isInPersistence()) this.resumeContact(context);
    else {
      if (this.isRecallContact()){
        this.dcService.showRecall();
      } else {
        if (this.isChatEmulationContact()) {
          if (this.hasDataCollection() && this.hasRecallForNoAgent() && this.noAgents()) {
            this.dcService.showDcWithRecall();
          }
        } else {
          if (this.hasDataCollection()) this.dcService.showDc();
          else this.createContact();
        }
      }
    }
  }
  isChatEmulationContact(){
    return false;
  }
  isRecallContact(){
    return false;
  }
  isInPersistence(){
    return !!this.context.persistenceId
  }
  mapContact(){
    this.vivocha.pageRequest('interactionCreated', this.contact);
    this.contact.getLocalCapabilities().then( caps => {
      this.dispatch(new fromStore.WidgetLocalCaps(caps));
    });
    this.contact.getRemoteCapabilities().then( caps => {
      this.dispatch(new fromStore.WidgetRemoteCaps(caps));
    });
    this.contact.on('joined', (c) => {
      if (c.user) {
        this.onAgentJoin(c);
      } else {
        this.onLocalJoin(c);
      }
    });
    this.contact.on('rawmessage', (msg) => {
      if (msg.type != 'text') return;
      if (msg.quick_replies){
        this.messageService.addQuickRepliesMessage(msg);
      }
      else if (msg.template) {
        this.messageService.addTemplateMessage(msg);
      } else {
        console.log('dispatching chat message', this.contact.contact.agentInfo, this.contact);
        this.messageService.addChatMessage(msg, this.agent);
        /*
        if (this.widgetState && (this.widgetState.minimized || !this.widgetState.chatVisibility)) {
          this.dispatch({type: 'INCREMENT_NOT_READ'});
        }
        */
      }
      //this.playAudioNotification();
      //this.clearIsWriting();
    });
    this.contact.on('localtext', (text) => {
      this.messageService.addLocalMessage(text);
    });
      /*

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
  noAgents(){
    return false;
  }
  onAgentJoin(join){
    this.contact.getMedia().then( (media) => {
      const agent = {
        id: join.user,
        nick: join.nick,
        avatar: (join.avatar.base_url) ? join.avatar.base_url + join.avatar.images[0].file : join.avatar
      };
      this.agent = agent;
      this.vivocha.pageRequest('interactionAnswered', agent);
      //this.dispatch(new fromStore.WidgetMediaChange(media));
      this.setAnsweredState(agent)
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
  resumeContact(context: InteractionContext){
    this.vivocha.dataRequest('getData', 'persistence.contact').then((contactData) => {
      this.vivocha.resumeContact(contactData).then((contact) => {
        this.contact = contact;
        this.mapContact();
      }, (err) => {
        console.log('Failed to resume contact', err);
        this.vivocha.pageRequest('interactionFailed', err.message);
      });
    });
  }
  sendText(text){
    this.contact.sendText(text);
  }
  setAnsweredState(agent){
    this.dispatch(new fromStore.WidgetJoined(agent));
    this.dispatch(new VvcEventEmit({ name: 'AGENT_JOIN', agent: agent }));
    this.messageService.removeMessage(this.lastSystemMessageId);
    if (this.context.variables.showWelcomeMessage){
      this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: agent.nick });
    }
  }
  setQueueState(){
    this.store.dispatch(new VvcEventEmit({ name: 'QUEUE' }));
    this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.QUEUE.CONNECTING');
  }
}