import {Injectable, NgZone} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ClientContactCreationOptions} from '@vivocha/global-entities/dist/contact';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';
import {InteractionContext} from '@vivocha/client-visitor-core/dist/widget';
import {VvcMessageService} from './messages.service';
import {objectToDataCollection} from '@vivocha/global-entities/dist/wrappers/data_collection';

@Injectable()
export class VvcContactWrap {

  private vivocha;
  private contact;
  private context;

  lastSystemMessageId;
  agent;
  isClosed = false;
  isWritingTimer;
  isWritingTimeout = 30000;

  constructor(
    private store: Store<fromStore.AppState>,
    private dcService: VvcDataCollectionService,
    private protocolService: VvcProtocolService,
    private messageService: VvcMessageService,
    private zone: NgZone
  ){}

  attachDataAndCreateContact(context){
    const contactOptions: { data: any[], nick?: string} = { data: [] };
    const dataCollection = context.dataCollections[0];
    const data = {};
    for (let i = 0; i < dataCollection.fields.length; i++) {
      const field = dataCollection.fields[i];
      if (field.format === 'nickname' && field.id) {
        contactOptions.nick = data[field.id];
      }
      const hasDefault = typeof field.defaultConstant !== 'undefined';

      field.value = hasDefault ? field.defaultConstant.toString() : field.defaultConstant;

      data[field.id] = field.value;
    }
    contactOptions.data.push(objectToDataCollection(data, dataCollection.id, dataCollection))
    console.log('PREPARED DATA', data, dataCollection, contactOptions);
    this.createContact(contactOptions);
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
  closeContact(){
    if (this.contact) {
      this.contact.leave();
      this.store.dispatch(new fromStore.WidgetClosedByVisitor());
      this.messageService.sendSystemMessage('STRINGS.MESSAGES.LOCAL_CLOSE');
      this.isClosed = true;
    }
  }
  createContact(dataToMerge?){
    this.setQueueState();
    const conf = this.getContactOptions(dataToMerge);
    console.log('INITIAL OPTIONS', conf);
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
  getContactOptions(dataToMerge?):ClientContactCreationOptions {
    const initialOpts =  {
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
    if (dataToMerge){
      return Object.assign({}, initialOpts, dataToMerge);
    }
    else return Object.assign({}, initialOpts);
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
          if (this.hasDataCollection()) this.attachDataAndCreateContact(context);
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
        if (msg.agent) this.store.dispatch(new fromStore.WidgetIsWriting(false));
      }
      this.store.dispatch(new fromStore.WidgetNewMessage());
      //this.playAudioNotification();
    });
    this.contact.on('iswriting', (from_id, from_nick, agent) => {
      if (agent) {
        this.setIsWriting();
      }
    });
    this.contact.on('localtext', (text) => {
      this.messageService.addLocalMessage(text);
    });
    this.contact.on('left', obj => {
      console.log('LEFT', obj);
      if (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) {
        this.store.dispatch(new fromStore.WidgetClosedByAgent());
        this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
        this.isClosed = true;
      }
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

      */

    /*

    this.contact.on('localcapabilities', caps => {
      this.dispatch(new fromStore.LocalCaps(caps));
    });

    this.contact.on('mediachange', (media, changed) => {
      this.dispatchConnectionMessages(media);
      this.dispatch(new fromStore.MediaChange(media));
    });
    this.contact.on('mediaoffer', (offer, cb) => {
      this.onMediaOffer(offer, cb);
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
  minimize(minimize){
    if (minimize) {
      this.vivocha.minimize({ bottom: "10px", right: "10px" }, { width: '70px', height: '70px' });
      this.store.dispatch(new fromStore.WidgetMinimize(true));
    } else {
      this.vivocha.maximize();
      this.store.dispatch(new fromStore.WidgetMinimize(false));
      this.store.dispatch(new fromStore.WidgetResetUnread());
    }
  }
  noAgents(){
    return false;
  }
  onAgentJoin(join){
    this.contact.getMedia().then( (media) => {
      console.log('AGENT JOIN', join);
      const agent : {
        id: string,
        nick: string,
        is_bot: boolean,
        is_agent: boolean,
        avatar?: string
      } = {
        id: join.user,
        nick: join.nick,
        is_bot: !!join.is_bot,
        is_agent: !join.is_bot,
      };
      if (join.avatar){
        agent.avatar = (join.avatar.base_url) ? join.avatar.base_url + join.avatar.images[0].file : join.avatar
      }
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
  processQuickReply(reply){
    this.messageService.updateQuickReply(reply.msgId);
    this.contact.sendText(reply.action.title)
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
  sendPostBack(msg){
    const vvcPostBack = {
      code: "message",
      type: "postback",
      body: msg.title
    };
    if (msg.type === "postback") {
      console.log('dispatching from contact service', msg, vvcPostBack);
      this.contact.send(vvcPostBack);
    }
    else {
      console.log('message type differs from postback', msg);
      this.vivocha.pageRequest('interactionEvent', msg.type, msg);
    }
  }
  sendText(text){
    this.contact.sendText(text);
  }
  setAnsweredState(agent){
    this.dispatch(new fromStore.WidgetJoined(agent));
    this.messageService.removeMessage(this.lastSystemMessageId);
    if (this.context.variables.showWelcomeMessage){
      this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: agent.nick });
    }
    this.store.dispatch(new fromStore.WidgetTopBar({ title: this.agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: this.agent.avatar}));

  }
  setIsWriting(){
    clearTimeout(this.isWritingTimer);
    this.store.dispatch(new fromStore.WidgetIsWriting(true));
    this.isWritingTimer = setTimeout( () => {
      this.store.dispatch(new fromStore.WidgetIsWriting(false));
    }, this.isWritingTimeout);
  }
  setQueueState(){
    this.store.dispatch(new fromStore.WidgetQueue());
    this.store.dispatch(new fromStore.WidgetTopBar({ title: 'STRINGS.QUEUE.TOPBAR.TITLE', subtitle: 'STRINGS.QUEUE.TOPBAR.SUBTITLE'}));
    this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.QUEUE.CONNECTING');

  }
}