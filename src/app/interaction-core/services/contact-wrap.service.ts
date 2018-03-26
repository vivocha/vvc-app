import {Injectable, NgZone} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ClientContactCreationOptions} from '@vivocha/global-entities/dist/contact';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';
import {InteractionContext} from '@vivocha/client-visitor-core/dist/widget';
import {VvcMessageService} from './messages.service';
import {objectToDataCollection} from '@vivocha/global-entities/dist/wrappers/data_collection';
import {VvcUiService} from './ui.service';
import {DataCollectionState} from '../store/models.interface';

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
    private uiService: VvcUiService,
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
    this.createContact(contactOptions);
  }
  checkForTranscript() {
    const transcript = this.contact.contact.transcript;
    for (const m in transcript) {
      const msg = transcript[m];
      switch (msg.type) {
        case 'text':
          this.messageService.addChatMessage(msg, this.agent);
          break;
        case 'attachment':
          this.store.dispatch(new fromStore.NewMessage({
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
      this.uiService.setClosedByVisitor();
      this.messageService.sendSystemMessage('STRINGS.MESSAGES.LOCAL_CLOSE');
      this.isClosed = true;
    }
  }
  closeUploadPanel(){
    this.uiService.setUploadPanel(false);
  }
  createContact(dataToMerge?){
    this.setQueueState();
    const conf = this.getContactOptions(dataToMerge);
    this.vivocha.createContact(conf).then( (contact) => {
      this.contact = contact;
      this.mapContact();
    }, (err) => {
      console.log('Failed to create contact', err);
      this.vivocha.pageRequest('interactionFailed', err.message);
    });
  }
  dispatch(action){
    //this.zone.run( () => {
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
  /*
  hasDataCollection() {
    return this.dcService.hasDataCollection(this.context);
  }*/
  hasRecallForNoAgent(){
    return false;
  }
  initializeContact(vivocha, context){
    this.vivocha = vivocha;
    this.context = context;
    this.uiService.initializeUi(this.context);
    if (this.isInPersistence()) this.resumeContact(context);
    else {

      this.dcService.onDataCollectionCompleted(context).subscribe( (data: DataCollectionState) => {
        if (data.completed) {
          this.createContact(data.creationOptions);
        }
      });
      this.dcService.processDataCollections();
      /*
      if (this.isRecallContact()){
        this.dcService.showRecall();
      } else {
        if (this.isChatEmulationContact()) {
          if (this.hasDataCollection() && this.hasRecallForNoAgent() && this.noAgents()) {
            this.dcService.showDcWithRecall();
          }
        } else {
          if (this.hasDataCollection()) {
            if (this.dcService.dcAlreadyFilled()) {
              this.attachDataAndCreateContact(context);
            }
            else console.log("should render dc");
          }
          else this.createContact();
        }
      }
      */
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
      //this.dispatch(new fromStore.WidgetLocalCaps(caps));
    });
    this.contact.getRemoteCapabilities().then( caps => {
      //this.dispatch(new fromStore.WidgetRemoteCaps(caps));
    });
    this.contact.on('attachment', (url, meta, fromId, fromNick, isAgent) => {
      this.zone.run( () => {
        const attachment = {url, meta, fromId, fromNick, isAgent};
        console.log('ATTACHMENT', attachment);
        meta.url = (meta.originalUrl) ? meta.originalUrl : url;
        const msg = {
          body: meta.desc || meta.originalName,
          type: 'chat',
          isAgent: isAgent,
          meta: meta,
          from_nick: fromNick,
          from_id: fromId
        };
        this.messageService.addChatMessage(msg, this.agent);
      });
      /*
      this.dispatch(new fromStore.NewMessage({
        text: meta.desc || meta.originalName,
        type: 'chat',
        isAgent: isAgent,
        meta: meta,
        url: (meta.originalUrl) ? meta.originalUrl : url,
        from_nick: fromNick,
        from_id: fromId
      }))
      */
    });
    this.contact.on('joined', (c) => {
        if (c.user) {
          this.onAgentJoin(c);
        } else {
          this.onLocalJoin(c);
        }
    });
    this.contact.on('rawmessage', (msg) => {
      this.zone.run( () => {
        if (msg.type != 'text') return;
        if (msg.quick_replies){
          this.messageService.addQuickRepliesMessage(msg);
        }
        else if (msg.template) {
          this.messageService.addTemplateMessage(msg);
        } else {
          console.log('dispatching chat message', this.contact.contact.agentInfo, this.contact);
          this.messageService.addChatMessage(msg, this.agent);
        }
        if (msg.agent) this.uiService.setIsWriting(false);
        this.uiService.newMessageReceived();
        //this.playAudioNotification();
      });

    });
    this.contact.on('iswriting', (from_id, from_nick, agent) => {
      this.zone.run( () => {
        if (agent) {
          this.setIsWriting();
        }
      });
    });
    this.contact.on('localtext', (text) => {
      this.zone.run( () => {
        if (this.agent.is_bot){
          this.setIsWriting();
        }
        this.messageService.addLocalMessage(text);
      });
    });
    this.contact.on('left', obj => {
      this.zone.run( () => {
        console.log('LEFT', obj);
        if (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) {
          //this.store.dispatch(new fromStore.WidgetClosedByAgent());
          this.uiService.setClosedByAgent();
          this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
          this.isClosed = true;
        }
      });

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
      this.uiService.setMinimizedState()
    } else {
      this.vivocha.maximize();
      this.uiService.setNormalState();
    }
  }
  noAgents(){
    return false;
  }
  onAgentJoin(join){
    this.contact.getMedia().then( (media) => {
      this.zone.run( () => {
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
    });
  }
  onLocalJoin(join){
    if (join.reason && join.reason === 'resume') {
      this.contact.getMedia().then((media) => {
        this.zone.run( () => {
          const agentInfo = this.contact.contact.agentInfo;
          const agent : {
            id: string,
            nick: string,
            is_bot: boolean,
            is_agent: boolean,
            avatar?: string
          } = {
            id: agentInfo.id,
            nick: agentInfo.nick,
            is_bot: !!agentInfo.bot,
            is_agent: !agentInfo.bot,
          };
          if (join.avatar){
            agent.avatar = (join.avatar.base_url) ? join.avatar.base_url + join.avatar.images[0].file : join.avatar
          }
          console.log('LOCAL JOIN', agent, this.contact);
          this.agent = agent;
          this.uiService.setAgent(agent);
          //this.dispatch(new fromStore.WidgetMediaChange(media));
          this.checkForTranscript();
        });
      });
    }
  }
  openAttachment(url){
    const msg = { type: 'web_url', url: url };
    this.vivocha.pageRequest('interactionEvent', msg.type, msg);
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

    /*
    this.callStartedWith = context.requestedMedia.toUpperCase();
    this.vivocha.dataRequest('getData', 'persistence.contact').then((contactData) => {
      this.dispatch({type: 'INITIAL_OFFER', payload: {
          offer: contactData.initial_offer,
          context: context
        }});
      this.vivocha.resumeContact(contactData).then((contact) => {
        this.vivocha.pageRequest('interactionCreated', contact);
        console.log('contact created, looking for the caps', contact);
        contact.getLocalCapabilities().then( caps => {
          this.dispatch({type: 'LOCAL_CAPS', payload: caps });
        });
        contact.getRemoteCapabilities().then( caps => {
          this.dispatch({type: 'REMOTE_CAPS', payload: caps });
        });
        this.contact = contact;
        this.mapContact();
      }, (err) => {
        console.log('Failed to resume contact', err);
        this.vivocha.pageRequest('interactionFailed', err.message);
      });
    });
    */
  }
  sendAttachment(upload) {
    this.uiService.setUploading();
    this.contact.attach(upload.file, upload.text).then(() => {
      this.zone.run( () => {
        this.uiService.setUploaded();
      })
    })
  }
  sendPostBack(msg){
    const vvcPostBack = {
      code: "message",
      type: "postback",
      body: msg.title
    };
    if (msg.type === "postback") {
      this.contact.send(vvcPostBack);
    }
    else {
      this.vivocha.pageRequest('interactionEvent', msg.type, msg);
    }
  }
  sendText(text){
    this.contact.sendText(text);
  }
  setAnsweredState(agent){
    this.uiService.setAgent(agent);
    this.messageService.removeMessage(this.lastSystemMessageId);
    if (this.context.variables.showWelcomeMessage){
      this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: agent.nick });
    }
  }
  setIsWriting(){
    clearTimeout(this.isWritingTimer);
    this.uiService.setIsWriting(true);
    this.isWritingTimer = setTimeout( () => {
      this.uiService.setIsWriting(false);
    }, this.isWritingTimeout);
  }
  setQueueState(){
    this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.QUEUE.CONNECTING');
  }
  showCloseModal(show: boolean){
    this.uiService.setCloseModal(show);
  }
  showUploadPanel(){
    this.uiService.setUploadPanel(true);
  }
  submitDataCollection(dc){
    this.dcService.submitDataCollection(dc);
  }
  toggleEmojiPanel(){
    this.uiService.toggleEmojiPanel();
  }
}