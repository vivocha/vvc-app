import {Injectable, NgZone} from '@angular/core';
import {AppState} from '../store/reducers/main.reducer';
import {Store} from '@ngrx/store';
import {VvcDataCollectionService} from './data-collection.service';
import {VvcProtocolService} from './protocol.service';
import {VvcMessageService} from './messages.service';
import {objectToDataCollection} from '@vivocha/public-entities/dist/wrappers/data_collection';
import {VvcUiService} from './ui.service';
import {CbnStatus, DataCollectionCompleted, Dimension, LeftScrollOffset} from '../store/models.interface';
import {AgentState} from '../store/models.interface';
import {ClientContactCreationOptions} from '@vivocha/public-entities/dist/contact';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class VvcContactWrap {

  private vivocha;
  private contact;
  private context;

  lastSystemMessageId;
  agent;
  agentRequestCallback;
  dissuasionTimer;
  downgradeDimensions: Dimension;
  transferTimer;
  hasReceivedMsgs = false;
  isClosed = false;
  isWritingTimer;
  isWritingTimeout = 30000;
  incomingCallback;
  incomingOffer;
  incomingMedia;
  interactionStart;

  autoChat = false;
  autoChatInitialData;
  messageArchive = [];

  customActions = {};
  visitorNick;

  cbnChannelStatus: CbnStatus[] = ['dialing', 'ringing', 'busy', 'no-answer', 'unassigned', 'failed', 'cancel', 'answer'];

  dimensions = {};
  constructor(
    private store: Store<AppState>,
    private dcService: VvcDataCollectionService,
    private protocolService: VvcProtocolService,
    private messageService: VvcMessageService,
    private uiService: VvcUiService,
    private zone: NgZone
  ) {}

  acceptAgentRequest(requestId) {
    this.agentRequestCallback(null, true);
    this.messageService.removeMessage(this.lastSystemMessageId);
    this.messageService.sendSystemMessage('STRINGS.MESSAGES.' + requestId.toUpperCase() + '_ACCEPTED');
  }
  acceptOffer() {
    this.mergeOffer(this.incomingOffer, this.incomingCallback);
  }
  addChatToFullScreen(show) {
    this.uiService.setFullScreenChat(show);
    if (this.context.mediaPreset !== 'chat') {
      this.askForUpgrade('Chat');
    }
  }
  askForUpgrade(media) {
    if (media !== 'Chat') {
      this.uiService.setIsOffering(media);
    }
    this.contact.getMediaOffer().then(offer => {
      if (media === 'Chat') {
        offer[media] = {
          tx: 'required',
          rx: 'required'
        };
      } else {
        offer[media] = {
          tx: 'required',
          rx: 'required',
          via: 'net',
          engine: 'WebRTC'
        };
      }
      if (media === 'Video') {
        offer['Voice'] = {
          tx: 'required',
          rx: 'required',
          via: 'net',
          engine: 'WebRTC'
        };
      }
      this.contact.offerMedia(offer).then(() => {
        this.zone.run( () => {

        });
      }, (err) => {
        this.zone.run( () => {
          this.uiService.setOfferRejected();
        });
      });
    });

  }
  attachDataAndCreateContact(context) {
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
    contactOptions.data.push(objectToDataCollection(data, dataCollection.id, dataCollection));
    this.createContact(contactOptions);
  }
  cancelDissuasionTimeout() {
    if (this.dissuasionTimer) {
      clearTimeout(this.dissuasionTimer);
      delete this.dissuasionTimer;
    }
  }
  cancelTransferTimeout() {
    if (this.transferTimer) {
      clearTimeout(this.transferTimer);
      delete this.transferTimer;
    }
  }
  cbnStatusChanged(id, info) {
    this.uiService.setCbnState(id);
  }
  checkForTranscript() {
    const transcript = this.contact.contact.transcript;
    for (const m in transcript) {
        const msg = transcript[m];
        switch (msg.type) {
          case 'text':
            const agent = (msg.agent) ? this.agent : false;
            if (msg.quick_replies) {
              this.messageService.addQuickRepliesMessage(msg, this.agent);
            } else if (msg.template) {
              this.messageService.addTemplateMessage(msg, this.agent);
            } else {
              this.messageService.addChatMessage(msg, agent, this.visitorNick);
            }
            break;
          case 'attachment':
            const meta = msg.meta;
            meta.url = (meta.originalUrl) ? meta.originalUrl : msg.url;
            const attachment = {
              body: meta.desc || meta.originalName,
              type: 'chat',
              meta: meta,
              from_nick: msg.from_nick,
              from_id: msg.from_id
            };
            if (msg.agent) {
              this.messageService.addChatMessage(attachment, this.agent, this.visitorNick);
            } else {
              this.messageService.addChatMessage(attachment, null, this.visitorNick);
            }
            break;
          case 'link':
            this.messageService.addLinkMessage(msg.url, msg.from_id, msg.from_nick, msg.desc, msg.agent);
            break;
        }
      }
  }
  closeApp() {
    this.vivocha.pageRequest('interactionClosed', 'destroy');
  }
  closeContact(dim?: Dimension) {
    this.leave().then((reason) => {
      this.zone.run(() => {
        this.uiService.setClosedByVisitor();
        this.messageService.sendSystemMessage('STRINGS.MESSAGES.LOCAL_CLOSE');
        (this.context.variables.customSize && dim) ? this.setDimension(dim) : this.vivocha.setNormalScreen();
        this.isClosed = true;
        this.vivocha.pageRequest('interactionClosed', reason);
      });
    });
  }
  closeUploadPanel() {
    this.uiService.setUploadPanel(false);
  }
  createAutoContact(dataToMerge?) {
    this.autoChat = true;
    this.autoChatInitialData = dataToMerge;
    this.uiService.setAutoChat();
    this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT'});
    if (this.context.variables.showWelcomeOnAutoChat) {
      this.messageService.sendSystemMessage('STRINGS.CHAT.AUTO_CHAT_FIRST_MESSAGE');
    }
    this.uiService.setUiReady();
  }
  createContact(dataToMerge, hideQueue?) {
    const conf: ClientContactCreationOptions = this.getContactOptions(dataToMerge);
    if (conf && conf.nick) {
      this.visitorNick = conf.nick;
    }
    // console.log('CREATING CONTACTS WITH OPTIONS', conf);
    this.vivocha.pageRequest('interactionCreation', conf, (opts: ClientContactCreationOptions = conf) => {
      // console.log('pre-routing callback-----', opts);
      this.interactionStart = +new Date();
      // console.log('TRANSFER ROUTING', this.context.routing);
      const timeout = (this.context.routing.dissuasionTimeout || 60) * 1000;
      this.dissuasionTimer = setTimeout(() => {
        this.leave('dissuasion').then(() => {
          this.setRecallOrLeave('timeout', 'dissuasion');
        });
      }, timeout);
      this.vivocha.createContact(opts).then( (contact) => {
        this.vivocha.pageRequest('interactionCreated', contact).then( () => {
          this.zone.run( () => {
            // console.log('contact created', JSON.stringify(contact.contact.initial_offer, null, 2));
            this.contact = contact;
            this.uiService.setUiReady();
            // console.log('contact type', contact.contact.type, contact.contact);
            if (contact.contact.type === 'cbn') {
              this.uiService.setCbnMode();
            }
            if (contact.contact.initial_offer.Sharing) {
              if (!this.autoChat) {
                if (contact.contact.initial_offer.Chat && hideQueue) {
                  this.uiService.hideQueueForChat();
                } else {
                  this.uiService.showQueuePanel();
                }
              }
              this.uiService.initializeProtocol(this.context, {
                initialOffer: contact.contact.initial_offer
              });
              this.mapContact();
              if (this.autoChat) {
                this.messageArchive.map( m => this.contact.sendText(m));
                this.autoChat = false;
              }
            } else {
              this.hasReceivedMsgs = true;
              this.cancelDissuasionTimeout();
              this.uiService.setWebleadSent();
              this.vivocha.pageRequest('interactionClosed', 'closed');
            }
          });
        });
      }, (err) => {
        console.log('Failed to create contact', err, opts);
        this.zone.run( () => {
          this.cancelDissuasionTimeout();
          this.setRecallOrLeave(err.message === 'Precondition Failed' ? 'noAgents' : 'error', 'error');
        });
      });
    });
  }
  getContactOptions(dataToMerge?): ClientContactCreationOptions {
    const initialOpts: ClientContactCreationOptions = {
      campaignId: this.context.campaign.id,
      version: this.context.campaign.version,
      channelId: 'web',
      entryPointId: this.context.entryPointId,
      engagementId: this.context.engagementId,
      mediaPreset: this.context.mediaPreset,
      lang: this.context.language,
      vvcu: this.context.page.vvcu,
      vvct: this.context.page.vvct,
      first_uri: this.context.page.first_uri,
      first_title: this.context.page.first_title
    };
    if (this.context.page.first_uri) {
      initialOpts.first_uri = this.context.page.first_uri;
    }
    if (this.context.page.first_title) {
      initialOpts.first_title = this.context.page.first_title;
    }
    if (dataToMerge) {
      return Object.assign({}, initialOpts, dataToMerge);
    } else {
      return Object.assign({}, initialOpts);
    }
  }
  hangUp(dim: Dimension) {
    this.contact.getMediaOffer().then(mediaOffer => {
      if (mediaOffer['Voice']) {
        mediaOffer['Voice'].tx = 'off';
        mediaOffer['Voice'].rx = 'off';
      }
      if (mediaOffer['Video']) {
        mediaOffer['Video'].tx = 'off';
        mediaOffer['Video'].rx = 'off';
      }
      this.zone.run(() => {
        // console.log('MEDIAOFFER', mediaOffer);
        if (!mediaOffer['Screen'] || mediaOffer['Screen'].rx === 'off') {
          // this.vivocha.setNormalScreen();
          this.setDimension(dim);
          this.uiService.setHangUpState();
        }
      });
      this.contact.offerMedia(mediaOffer).then( () => {
        this.zone.run( () => {
          if (this.context.mediaPreset !== 'chat') {
            this.askForUpgrade('Chat');
          }
        });
      });
    });
  }
  hasRecallForNoAgent() {
    return false;
  }
  hideChat() {
    this.uiService.hideChat();
  }
  initializeContact(vivocha, context) {
    this.vivocha = vivocha;
    this.context = context;
    this.dcService.setInitialContext(context, vivocha);
    if (this.isInPersistence()) {
      this.resumeContact(context);
      if (this.dcService.hasSurvey()) {
        this.dcService.onDataCollectionCompleted().subscribe( (data: DataCollectionCompleted) => {
          if (data && data.type === 'survey') {
            this.contact.storeSurvey(data.dataCollection);
          }
        });
      }
    } else {
      this.dcService.onDataCollectionCompleted().subscribe( (data: DataCollectionCompleted) => {
        if (data) {
          // console.log('DATA', data);
          const hideQueue = data.lastCompletedType && data.lastCompletedType === 'dialog';
          switch (data.type) {
            case 'dc':
              this.dcService.setResolved();
              if (this.isAutoChat()) {
                this.createAutoContact(data.contactCreateOptions);
              } else {
                this.createContact(data.contactCreateOptions, hideQueue);
              }
              break;
            case 'recontact':
              this.dcService.setResolved();
              const infoToMerge: any = data.contactCreateOptions || {};
              // infoToMerge.recallFromId = this.contact.id;
              this.createContact(infoToMerge, hideQueue);
              break;
            case 'survey':
              this.contact.storeSurvey(data.dataCollection);
              break;
          }
        }
      });
      this.dcService.processDataCollections();
      this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT'});
    }
  }
  isAutoChat() {
    return this.context.mediaPreset === 'chat' && this.context.variables.autoChat;
  }
  isChatEmulationContact() {
    return false;
  }
  isOfflineMessage(text) {
    const m = this.messageArchive.filter( msg => msg === text)[0];
    if (m) {
      this.messageArchive = [...this.messageArchive.filter( msg => msg !== text)];
      return true;
    }
    return false;
  }
  isRecallContact() {
    return false;
  }
  isInPersistence() {
    return !!this.context && !!this.context.persistenceId;
  }
  leave(reason?: string) {
    return new Promise((resolve, reject) => {
      if (this.contact) {
        const now = +new Date();
        const contactTime = (now - this.interactionStart);
        const ev = reason ? reason : (this.hasReceivedMsgs ? 'closed' : (contactTime > 10000 ? 'abandoned' : 'cancelled') );

        this.contact.leave(ev, () => {
          this.contact.release();
          if (this.contact.channel.isConnected()) {
            this.contact.channel.disconnect();
          }
          this.isClosed = true;
          resolve(reason);
        });
      } else {
        resolve('failed');
      }
    });
  }
  mapContact() {
    this.contact.on('agentrequest', (message, cb) => {
      this.zone.run( () => {
        this.onAgentRequest(message, cb);
      });
    });
    this.contact.on('attachment', (url, meta, fromId, fromNick, isAgent) => {
      this.zone.run( () => {
        // const attachment = {url, meta, fromId, fromNick, isAgent};
        meta.url = (meta.originalUrl) ? meta.originalUrl : url;
        const msg = {
          body: meta.desc || meta.originalName,
          type: 'chat',
          meta: meta,
          from_nick: fromNick,
          from_id: fromId
        };
        if (isAgent) {
          this.messageService.addChatMessage(msg, this.agent, this.visitorNick);
        } else {
          this.messageService.addChatMessage(msg, null, this.visitorNick);
        }
      });
    });
    this.contact.on('close', obj => {
      // console.log('CLOSE', obj);
      this.onClose(obj);
    });
    this.contact.on('datachannel', dc => {
      if (dc && dc.id === 'callstatus') {
        this.zone.run( () => {
          this.registerCallStatusEvents(dc);
        });
      }
    });
    this.contact.on('joined', (c) => {
      if (c.user) {
        this.cancelDissuasionTimeout();
        this.onAgentJoin(c);
      } else {
        this.onLocalJoin(c);
      }
    });
    this.contact.on('rawmessage', (msg) => {
      this.zone.run( () => {
        if (msg.type !== 'text') {
          return;
        }
        if (msg.quick_replies) {
          this.messageService.addQuickRepliesMessage(msg, this.agent);
        } else if (msg.template) {
          this.messageService.addTemplateMessage(msg, this.agent);
        } else {
          this.messageService.addChatMessage(msg, this.agent, this.visitorNick);
        }
        if (msg.agent) {
          this.uiService.setIsWriting(false);
        }
        this.uiService.newMessageReceived();
        if (this.context.variables.playAudioNotification) {
          this.playAudioNotification();
        }
        this.hasReceivedMsgs = true;
      });

    });
    this.contact.on('link', (url: string, from_id: string, from_nick: string, desc?: string, agent?: boolean) => {
      this.openAttachment(url);
      this.zone.run(() => {
        this.messageService.addLinkMessage(url, from_id, from_nick, desc, agent);
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
        if (this.agent && this.agent.is_bot) {
          this.setIsWriting();
        }
        if (!this.isOfflineMessage(text)) {
          this.messageService.addLocalMessage(text);
        }
      });
    });
    this.contact.on('left', obj => {
      // console.log('LEFT', obj);
      this.onLeft(obj);
    });
    this.contact.on('localcapabilities', caps => {
      // console.log('ON_LOCAL',caps);
    });
    this.contact.on('capabilities', caps => {
      // console.log('ON_REMOTE',caps);
    });
    this.contact.on('mediachange', async (media, changed) => {
      // console.log('mediachange', media, changed);
      if (this.vivocha.dot(media, 'Video.data.rx_stream.id')) {
        this.vivocha.dot(media, 'Video.data.rx_stream.media', await this.contact.getMediaStream('video', 'rx'));
      }
      if (this.vivocha.dot(media, 'Video.data.tx_stream.id')) {
        this.vivocha.dot(media, 'Video.data.tx_stream.media', await this.contact.getMediaStream('video', 'tx'));
      }
      if (this.vivocha.dot(media, 'Voice.data.rx_stream.id')) {
        this.vivocha.dot(media, 'Voice.data.rx_stream.media', await this.contact.getMediaStream('audio', 'rx'));
      }
      if (this.vivocha.dot(media, 'Voice.data.tx_stream.id')) {
        this.vivocha.dot(media, 'Voice.data.tx_stream.media', await this.contact.getMediaStream('audio', 'tx'));
      }
      if (this.vivocha.dot(media, 'Screen.data.rx_stream.id')) {
        this.vivocha.dot(media, 'Screen.data.rx_stream.media', await this.contact.getMediaStream('screen', 'rx'));
      }
      if (this.vivocha.dot(media, 'Screen.data.tx_stream.id')) {
        this.vivocha.dot(media, 'Screen.data.tx_stream.media', await this.contact.getMediaStream('screen', 'tx'));
      }
      this.zone.run( () => {
        this.protocolService.setMediaChange(media);
        this.uiService.setMediaState(media);
        if (changed && changed.removed && changed.removed.media && changed.removed.media.Screen) {
          this.downgradeDimensions ? this.setDimension(this.downgradeDimensions) : this.vivocha.setNormalScreen();
          this.uiService.setHangUpState();
        }
      });
    });
    this.contact.on('mediaoffer', (offer, cb) => {
      this.zone.run( () => {
        this.onMediaOffer(offer, cb);
      });
    });
    this.contact.on('transferred', () => {
      this.zone.run( () => {
        this.messageService.sendSystemMessage('STRINGS.MESSAGES.TRANSFERRED');
        this.setTransferTimer();
      });
    });
    Object.keys(this.customActions).forEach( a => {
      this.contact.on(a, (message, callback) => {
        this.zone.run( () => {
          this.customActions[a]['callback'] = callback;
          this.customActions[a].stream.next(message);
        });
      });
    });
  }
  maximizeWidget(isFullScreen: boolean, dim: Dimension){
    (isFullScreen) ? this.uiService.setFullScreen() : this.uiService.setNormalState();
    this.setDimension(dim);
  }
  mergeOffer(diffOffer, cb) {
    this.contact.mergeMedia(diffOffer).then(mergedMedia => {
      this.zone.run( () => {
        cb(undefined, mergedMedia);
        // this.uiService.setOfferAccepted();
      });
    });
  }
  muteToggle(muted) {
    this.uiService.setMuteInProgress();
    this.contact.getMediaEngine('WebRTC').then( engine => {
      if (muted) {
        engine.muteLocalAudio();
      } else {
        engine.unmuteLocalAudio();
      }
      this.zone.run( () => {
        this.uiService.setMuted(muted);
      });
    });
  }
  minimize(minimize: boolean, isFullScreen?: boolean, positionObject?: any, sizeObject?: any) {
    if (minimize) {
      /*
      this.vivocha.minimize({
        bottom: (positionObject && positionObject.bottom) ? positionObject.bottom : '10px',
        right: (positionObject && positionObject.right) ? positionObject.right : '10px'
      }, {
        width: (sizeObject && sizeObject.width) ? sizeObject.width : '70px',
        height: (sizeObject && sizeObject.height) ? sizeObject.height : '70px'
      });
      */
      this.uiService.setMinimizedState();
    } else {
      if (isFullScreen) {
       this.setFullScreen();
      } else {
        // this.vivocha.maximize();
        this.uiService.setNormalState();
      }
    }
  }
  minimizeMedia() {
    if (!this.protocolService.isAlreadyConnectedWith('Chat')) {
      this.askForUpgrade('Chat');
    }
    this.uiService.setMinimizedMedia();
  }
  minimizeWidget(dim: Dimension) {
    this.uiService.setMinimizedState();
    this.setDimension(dim);
  }
  noAgents() {
    return false;
  }
  onAgentJoin(join) {
    this.cancelTransferTimeout();
    this.contact.getMedia().then( (media) => {
      this.zone.run( () => {
        const agent: AgentState  = {
          id: join.user,
          nick: join.nick,
          is_bot: !!join.is_bot,
          is_agent: !join.is_bot,
        };
        if (join.avatar) {
          agent.avatar = join.avatar;
        }
        this.agent = agent;
        this.vivocha.pageRequest('interactionAnswered', agent);
        this.protocolService.setMediaChange(media);
        this.uiService.initializeMedia(media);
        this.setAnsweredState(agent);
      });
    });
  }
  onAgentRequest(message, cb) {
    this.agentRequestCallback = cb;
    this.lastSystemMessageId = this.messageService.sendRequestMessage(message);
  }
  onClose(obj) {
    this.leave('remote').then(() => {
      this.zone.run( () => {
        this.uiService.setClosedByAgent();
        // this.vivocha.setNormalScreen();
        this.downgradeDimensions ? this.setDimension(this.downgradeDimensions) : this.vivocha.setNormalScreen();
        this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
        this.isClosed = true;
        this.vivocha.pageRequest('interactionClosed', 'closed');
      });
    });
  }
  onLeft(obj) {
    if (
        (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) ||
        (obj.reason && obj.reason === 'disconnect')
    ) {
      this.leave('remote').then(() => {
        this.zone.run(() => {
          this.uiService.setClosedByAgent();
          // this.vivocha.setNormalScreen();
          this.downgradeDimensions ? this.setDimension(this.downgradeDimensions) : this.vivocha.setNormalScreen();
          this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
          this.isClosed = true;
          this.vivocha.pageRequest('interactionClosed', 'closed');
        });
      });
    }
  }
  onLocalJoin(join) {
    // console.log('local join', join);
  }
  onMediaOffer(offer, cb) {
    this.uiService.setMediaOffer(offer);
    const o = this.protocolService.confirmNeeded(offer);
    if (o.askForConfirmation) {
      this.incomingMedia = o.media;
      this.uiService.setIncomingMedia(o.media);
      this.incomingCallback = cb;
      this.incomingOffer = o.offer;
    } else {
      const newOffer = this.protocolService.mergeOffer(offer);
      this.mergeOffer(newOffer, cb);

    }
  }
  openAttachment(url: string, click?: boolean, target?: string) {
    const msg = { type: 'web_url', url, click, target };
    this.vivocha.pageRequest('interactionEvent', msg.type, msg);
  }
  playAudioNotification() {
    const notif = new Audio();
    notif.src = window['beepmp3'];
    notif.load();
    notif.play();
  }
  processQuickReply(reply) {
    this.messageService.updateQuickReply(reply.msgId);
    const vvcQuickReply: any = {
      code: 'message',
      type: 'text',
      body: reply.action.title
    };
    if (reply.action.payload !== undefined) {
      vvcQuickReply.payload = reply.action.payload;
    }
    if (this.contact && !this.isClosed) {
      this.contact.send(vvcQuickReply);
    } else {
      this.dcService.sendMessageViaCollector(false, vvcQuickReply.body, vvcQuickReply.payload);
    }
    this.messageService.addLocalMessage(reply.action.title);
  }
  registerCallStatusEvents(dataChannel) {
    for (const i in this.cbnChannelStatus) {
      dataChannel.on(this.cbnChannelStatus[i], (info) => {
        this.zone.run( () => {
          this.cbnStatusChanged(this.cbnChannelStatus[i], info);
        });
      });
    }
  }
  registerCustomAction(action): Observable<any> {
    this.customActions[action.id] = { stream: new Subject() };
    return this.customActions[action.id].stream;
  }
  rejectAgentRequest(requestId) {
    this.agentRequestCallback(null, false);
    this.messageService.removeMessage(this.lastSystemMessageId);
    this.messageService.sendSystemMessage('STRINGS.MESSAGES.' + requestId.toUpperCase() + '_REJECTED');
  }
  rejectOffer() {
    this.incomingCallback('error', {});
    this.messageService.sendSystemMessage('STRINGS.CALL_REJECTED');
    this.uiService.setOfferRejected();
  }
  resumeContact(context: any) {
    this.vivocha.dataRequest('getData', 'persistence.contact').then((contactData) => {
      this.vivocha.resumeContact(contactData).then((contact) => {
        this.vivocha.pageRequest('interactionCreated', contact);
        this.zone.run(() => {
          this.contact = contact;
          this.uiService.setUiReady();
          this.uiService.initializeProtocol(context, {
            initialOffer: contact.initial_offer
          });
          this.mapContact();
          this.contact.getMedia().then((media) => {
            this.zone.run( () => {
              const agentInfo = this.contact.contact.agentInfo;
              const agent: AgentState = {
                id: agentInfo.id,
                nick: agentInfo.nick,
                is_bot: !!agentInfo.bot,
                is_agent: !agentInfo.bot,
              };
              if (agentInfo.avatar) {
                agent.avatar = agentInfo.avatar;
              }
              // console.log('LOCAL JOIN', agent, this.contact);
              this.agent = agent;
              this.uiService.setAgent(agent);
              if (this.context.variables.showAgentInfoOnTopBar) {
                this.uiService.setTopBarWithAgentInfo(agent);
              } else {
                this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT'});
              }
              this.protocolService.setMediaChange(media);
              this.uiService.initializeMedia(media);
              this.checkForTranscript();
            });
          });
        });
      }, (err) => {
        console.log('Failed to resume contact', err);
        this.vivocha.pageRequest('interactionFailed', err.message);
        this.uiService.setCreationFailed();
        setTimeout( () => {
          this.closeApp();
        }, 2000);
      });
    });
  }
  sendAttachment(upload) {
    this.uiService.setUploading();
    this.contact.attach(upload.file, upload.text).then(() => {
      this.zone.run( () => {
        this.uiService.setUploaded();
      });
    });
  }
  sendIsWriting() {
    if (!this.autoChat && this.contact) {
      this.contact.sendIsWriting();
    }
  }
  sendPostBack(msg) {
    const vvcPostBack: any = {
      code: 'message',
      type: 'postback',
      body: msg.title
    };
    if (msg.payload !== undefined) {
      vvcPostBack.payload = msg.payload;
    }
    if (msg.type === 'postback') {
      if (this.contact && !this.isClosed) {
        this.contact.send(vvcPostBack);
      } else {
        this.dcService.sendMessageViaCollector(true, vvcPostBack.body, vvcPostBack.payload);
      }
    } else {
      msg.click = true;
      this.vivocha.pageRequest('interactionEvent', msg.type, msg);
    }
  }
  sendRequest(requestId, requestData) {
    return this.contact.request(requestId, requestData);
  }
  sendText(text) {
    if (this.autoChat) {
      this.messageArchive.push(text);
      this.messageService.addChatMessage({ body: text, ts: +new Date().getTime()});
      if (this.messageArchive.length === 1) {
        if (this.context.variables.showConnectingOnAutoChat) {
          this.messageService.sendSystemMessage('STRINGS.QUEUE.CONNECTING');
        }
        this.createContact(this.autoChatInitialData);
      }
    } else {
      if (this.contact && !this.isClosed) {
        this.contact.sendText(text);
      } else {
        this.messageService.addChatMessage({ body: text, ts: +new Date().getTime()});
        this.dcService.sendMessageViaCollector(false, text);
      }
    }
  }
  setAnsweredState(agent) {
    this.messageService.removeMessage(this.lastSystemMessageId);
    this.uiService.setAgent(agent);
    if (this.context.variables.showAgentInfoOnTopBar) {
      this.uiService.setTopBarWithAgentInfo(agent);
    } else {
      this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT'});
    }
    if (this.context.variables.showWelcomeMessage) {
      this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: agent.nick });
    }
  }
  setDimension(dim) {
    /*
    if (this.dimensions && this.dimensions[dim]) {
      this.vivocha.pageRequest('dimensions', this.dimensions[dim]);
    }*/
    /*
    if (dim === 'cbn-minimized') {
      this.vivocha.pageRequest('setSize', {
        width: this.context.variables.initialWidth,
        height: '64px'
      });
      this.vivocha.pageRequest('setPosition', {
        right: this.context.variables.initialRight,
        bottom: '-10px'
      });
    }*/
    this.vivocha.pageRequest('setDimensions', dim);
  }
  setFullScreen() {
    this.uiService.setFullScreen();
    // this.vivocha.setFullScreen();
  }
  setIsWriting() {
    clearTimeout(this.isWritingTimer);
    this.uiService.setIsWriting(true);
    this.isWritingTimer = setTimeout( () => {
      this.uiService.setIsWriting(false);
    }, this.isWritingTimeout);
  }
  setNormalScreen() {
    this.uiService.setNormalScreen();
    this.vivocha.setNormalScreen();
    this.vivocha.pageRequest('setSize', {
      width: this.context.variables.initialWidth,
      height: this.context.variables.initialHeight
    });
    this.vivocha.pageRequest('setPosition', {
      right: this.context.variables.initialRight,
      bottom: this.context.variables.initialBottom
    });
  }
  setQueueState() {
    this.lastSystemMessageId = this.messageService.sendSystemMessage('STRINGS.QUEUE.CONNECTING');
  }
  setTransferTimer() {
    const timeout = (this.context.routing.transferFailureTimeout || 60) * 1000;
    this.transferTimer = setTimeout(() => {
      this.leave('dissuasion').then(() => {
        this.setRecallOrLeave('timeout', 'dissuasion');
      });
    }, timeout);
  }
  async setRecallOrLeave(event, reason) {
    const presets = await this.vivocha.pageRequest('interactionFailed', event);
    this.zone.run(() => {
      if (
        presets &&
        presets.availablePresetModes &&
        presets.availablePresetModes.length > 0
      ) {
        // process a recontact
        this.context.mediaPreset = presets.availablePresetModes[0].offer;
        if (
          presets.availablePresetModes[0].dataCollectionId &&
          presets.availablePresetModes[0].dataCollectionId !== ''
        ) {
          this.dcService.processDcById(presets.availablePresetModes[0].dataCollectionId, 'recontact');
        } else {
          this.dcService.processRecontact();
        }
      } else {
        if (reason === 'dissuasion') {
          this.uiService.setDissuasion();
        } else {
          this.uiService.setCreationFailed();
        }
      }
    });
  }
  setTopBar(avatarUrl: string, title: string, subtitle: string) {
    this.uiService.setTopBarWithAvatar(avatarUrl, title, subtitle);
  }
  setTopBarAvatar(avatarUrl: string) {
    this.uiService.setTopBarAvatar(avatarUrl);
  }
  setTopBarSubtitle(subtitle: string) {
    this.uiService.setTopBarSubtitle(subtitle);
  }
  setTopBarTitle(title: string) {
    this.uiService.setTopBarTitle(title);
  }
  showCloseModal(show: boolean) {
    this.uiService.setCloseModal(show);
  }
  showUploadPanel() {
    this.uiService.setUploadPanel(true);
  }
  showSurvey() {
    this.dcService.showSurvey();
  }
  submitDataCollection(dc) {
    this.dcService.submitDataCollection(dc);
  }
  submitSurvey(survey) {
    this.dcService.submitSurvey(survey);
  }
  toggleEmojiPanel() {
    this.uiService.toggleEmojiPanel();
  }
  toggleVideo(show) {
    this.contact.getMediaOffer().then(mediaOffer => {
      if (mediaOffer['Video']) {
        // const mode = show ? 'required' : 'off';
        const videoTx = mediaOffer['Video'].tx;
        if (videoTx === 'required') {
          mediaOffer['Video'].tx = 'off';
        } else {
          mediaOffer['Video'].tx = 'required';
        }
      }
      this.zone.run( () => {
        this.uiService.setInTransit(true);
      });
      // console.log('TOGGLE VIDEO', show, JSON.stringify(mediaOffer, null, 2));
      this.contact.offerMedia(mediaOffer).then( () => {
        this.zone.run( () => {
          this.uiService.setInTransit(false);
        });
      });
    });
  }
  updateLeftScrollOffset(o: LeftScrollOffset) {
    this.messageService.updateLeftScroll(o);
  }
  upgradeCbnToChat() {
    this.uiService.upgradeCbnToChat();
  }
  useDimensionsForDowngrades(dim: Dimension) {
    this.downgradeDimensions = dim;
  }
}
