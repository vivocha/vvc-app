import { Injectable, NgZone } from '@angular/core';
import { AppState } from '../store/reducers/main.reducer';
import { Store } from '@ngrx/store';
import { VvcDataCollectionService } from './data-collection.service';
import { VvcProtocolService } from './protocol.service';
import { VvcMessageService } from './messages.service';
import { objectToDataCollection } from '@vivocha/public-entities/dist/wrappers/data_collection';
import { VvcUiService } from './ui.service';
import { CbnStatus, DataCollectionCompleted, Dimension, LeftScrollOffset } from '../store/models.interface';
import { AgentState } from '../store/models.interface';
import { ClientContactCreationOptions } from '@vivocha/public-entities/dist/contact';
import { Observable, Subject } from 'rxjs';
import { NewEvent } from '../store/actions/events.actions';

@Injectable()
export class VvcContactWrap {

  private vivocha;
  private contact;
  private context;
  private logger = console;

  lastSystemMessageId;
  agent;
  agentRequestCallback;
  dissuasionTimer;
  transferTimer;
  hasReceivedMsgs = false;
  isClosed = false;
  isWritingTimer;
  isWritingTimeout = 30000;
  incomingCallback;
  incomingOffer;
  incomingMedia;
  interactionStart;
  joinedByAgent = false;

  interactionCreated = false;
  interactionEvtQueue = [];

  autoChat = false;
  autoChatInitialData;
  messageArchive = [];

  customActions = {};
  visitorNick;

  cbnChannelStatus: CbnStatus[] = ['dialing', 'ringing', 'busy', 'no-answer', 'unassigned', 'failed', 'cancel', 'answer'];

  dimensions = {};

  watchPositionId = null;

  recontactDone: boolean = false;

  constructor(
    private store: Store<AppState>,
    private dcService: VvcDataCollectionService,
    private protocolService: VvcProtocolService,
    private messageService: VvcMessageService,
    private uiService: VvcUiService,
    private zone: NgZone
  ) { }

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
        this.zone.run(() => {

        });
      }, (err) => {
        this.zone.run(() => {
          this.uiService.setOfferRejected();
        });
      });
    });

  }
  attachDataAndCreateContact(context) {
    const contactOptions: { data: any[], nick?: string } = { data: [] };
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
      this.track('dissuasion timeout cleared');
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
    if (this.context.variables.showWelcomeMessage && this.isInPersistence()) {
      this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: this.agent.nick });
    }
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
          meta.url = (msg.url) ? msg.url : meta.originalUrl;
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
        this.track('closed by visitor');
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
    this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT' });
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
    this.logger.log('creating contact with options:', conf);
    this.vivocha.pageRequest('interactionCreation', conf, (opts: ClientContactCreationOptions = conf) => {
      this.logger.log('pre-routing callback. opts:', opts);
      this.interactionStart = +new Date();
      const timeout = (this.context.routing.dissuasionTimeout || 60) * 1000;
      this.dissuasionTimer = setTimeout(() => {
        this.leave('dissuasion').then(() => {
          this.setRecallOrLeave('timeout', 'dissuasion');
        });
      }, timeout);
      this.track('creating contact');
      this.vivocha.createContact(opts, this.mapContact()).then((contact) => {
        this.zone.run(() => {
          this.contact = contact;
          this.track('contact created');
          this.mapContactActions();
          this.contact.getLocalCapabilities().then((caps) => {
            this.uiService.setLocalCaps(caps);
          });
        });
        this.vivocha.pageRequest('interactionCreated', contact).then(() => {
          this.interactionReady();
          this.zone.run(() => {
            this.logger.log('contact created', JSON.stringify(contact.contact.initial_offer, null, 2));
            this.uiService.setUiReady();
            this.track('blue screen');
            this.logger.log('contact type', contact.contact.type, contact.contact);
            if (contact.contact.type === 'cbn') {
              this.uiService.setCbnMode();
            }
            if (contact.contact.initial_offer.Sharing) {
              if (!this.autoChat) {
                if (contact.contact.initial_offer.Chat && hideQueue) {
                  this.uiService.hideQueueForChat();
                } else {
                  this.uiService.showQueuePanel();
                  this.track('queue screen');
                }
              }
              this.uiService.initializeProtocol(this.context, {
                initialOffer: contact.contact.initial_offer
              });
              if (this.autoChat) {
                this.messageArchive.map(m => this.contact.sendText(m));
                this.autoChat = false;
              }
            } else {
              this.hasReceivedMsgs = true;
              this.cancelDissuasionTimeout();
              this.uiService.setWebleadSent();
              this.vivocha.pageRequest('interactionClosed', 'closed');
            }
            this.checkForTranscript();
          });
        });
      }, (err) => {
        this.logger.error('Failed to create contact', err, opts);
        this.zone.run(() => {
          this.cancelDissuasionTimeout();
          this.setRecallOrLeave(err.message === 'Precondition Failed' ? 'noAgents' : 'error', 'error');
          this.track('creation failed', err);
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
      webleadHash: this.context.interactionMode.webleadHash,
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
        this.logger.log('MEDIAOFFER', mediaOffer);
        if (!mediaOffer['Screen'] || mediaOffer['Screen'].rx === 'off') {
          // this.vivocha.setNormalScreen();
          this.setDimension(dim);
          this.uiService.setHangUpState();
        }
      });
      this.contact.offerMedia(mediaOffer).then(() => {
        this.zone.run(() => {
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
    this.logger = this.vivocha.getLogger('vvc-interaction');
    this.logger.log('contactWrapService.initializeContact');
    this.context = context;
    this.dcService.setInitialContext(context, vivocha);
    if (this.isInPersistence()) {
      this.resumeContact(context);
      if (this.dcService.hasSurvey()) {
        this.dcService.onDataCollectionCompleted().subscribe((data: DataCollectionCompleted) => {
          if (data && data.type === 'survey') {
            this.contact.storeSurvey(data.dataCollection);
          }
        });
      }
    } else {
      this.dcService.onDataCollectionCompleted().subscribe((data: DataCollectionCompleted) => {
        this.logger.log('onDataCollectionCompleted. data:', data);
        if (data) {
          const hideQueue = data.lastCompletedType && data.lastCompletedType === 'dialog';
          switch (data.type) {
            /*
            case 'sync':
              console.log('sync contact', data.contactCreateOptions);
              this.dcService.setResolved();
              this.createContact({});
              break;
            */
            case 'dc':
              this.dcService.setResolved();
              if (this.isAutoChat()) {
                this.createAutoContact(data.contactCreateOptions);
              } else {
                this.createContact(data.contactCreateOptions, hideQueue);
              }
              break;
            case 'recontact':
              if(!this.recontactDone) {
                this.logger.log('creating recontact. context: ', this.context);
                this.dcService.setResolved();
                const infoToMerge: any = data.contactCreateOptions || {};
                // infoToMerge.recallFromId = this.contact.id;
                this.createContact(infoToMerge, hideQueue);
                this.recontactDone = true;
              } else {
                // if we are here something went wrong. TODO fix widget finished state automa bad state
                this.logger.log('recontact already set');
                this.uiService.setCreationFailed();
              }
              break;
            case 'survey':
              this.contact.storeSurvey(data.dataCollection);
              break;
          }
        }
      });
      this.dcService.processDataCollections();
      this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT' });
    }
  }
  interactionReady() {
    this.interactionCreated = true;
    this.track('interaction ready');
    if (this.interactionEvtQueue.length > 0) {
      for (const e of this.interactionEvtQueue) {
        switch (e.type) {
          case 'joined':
            this.onJoined(e.data);
            break;
          case 'rawmessage':
            this.processRawMessage(e.data);
            break;
        }
      }
      this.interactionEvtQueue = [];
    }
  }
  isAutoChat() {
    return this.context.mediaPreset === 'chat' && this.context.variables.autoChat;
  }
  isChatEmulationContact() {
    return false;
  }
  isOfflineMessage(text) {
    const m = this.messageArchive.filter(msg => msg === text)[0];
    if (m) {
      this.messageArchive = [...this.messageArchive.filter(msg => msg !== text)];
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
        const ev = reason ? reason : (this.hasReceivedMsgs ? 'closed' : (contactTime > 10000 ? 'abandoned' : 'cancelled'));

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
  debug(evtId: string, data?: any, opts?: any) {
    if (this.context.variables.enableDebug) {
      console.log('___' + evtId + '___', data, opts);
    }
  }
  handleGeoAction(data: any) {
    if (navigator.geolocation) {
      this.zone.run(() => {
        this.messageService.sendSystemMessage('STRINGS.MESSAGES.AGENT_ASKING_POSITION');
      });
      navigator.geolocation.getCurrentPosition((pos) => {
        this.logger.log('user position', pos);
        this.contact.sendAction('Geo', [{
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }]);
      }, (error) => {
        this.logger.error('position error', error);
        if (error.code === 1) {
          this.zone.run(() => {
            this.messageService.sendSystemMessage('STRINGS.MESSAGES.USER_DENIED_POSITION_PERMISSION');
          });
        }
      });
    } else {
      this.logger.warn('navigator.geolocation not available');
    }
  }
  handleAutoGeoAction(data: any) {
    if (navigator.geolocation) {
      if (data && data[0] === 0 && this.watchPositionId) {
        this.logger.log('clear watch userPosition');
        navigator.geolocation.clearWatch(this.watchPositionId);
      } else if (data && data[0] === -1) {
        this.logger.log('watch user position');
        this.zone.run(() => {
          this.messageService.sendSystemMessage('STRINGS.MESSAGES.AGENT_ASKING_WATCH_POSITION');
        });
        this.watchPositionId = navigator.geolocation.watchPosition((pos) => {
          this.logger.log('user position', pos);
          this.contact.sendAction('Geo', [{
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }]);
        }, (error) => {
          this.logger.error('position error', error);
          if (error.code === 1) {
            this.zone.run(() => {
              this.messageService.sendSystemMessage('STRINGS.MESSAGES.USER_DENIED_WATCH_POSITION_PERMISSION');
            });
          }
        });
      }
    } else {
      this.logger.warn('navigator.geolocation not available');
    }
  }
  mapContactActions() {
    this.contact.on('action', (name, data) => {
      if (name === 'Geo') {
        this.handleGeoAction(data);
      } else {
        this.handleAutoGeoAction(data);
      }
    });
  }
  mapContact() {
    const contactHandlers = [
      {
        event: 'agentrequest',
        handler: (message, cb) => {
          this.zone.run(() => {
            this.onAgentRequest(message, cb);
          });
        }
      },
      {
        event: 'attachment',
        handler: (url, meta, fromId, fromNick, isAgent) => {
          this.zone.run(() => {
            // const attachment = {url, meta, fromId, fromNick, isAgent};
            meta.url = (url) ? url : meta.originalUrl;
            const msg = {
              body: meta.desc || meta.originalName,
              type: 'chat',
              meta: meta,
              from_nick: fromNick,
              from_id: fromId
            };
            if (isAgent) {
              this.messageService.addChatMessage(msg, this.agent, this.visitorNick);
              this.uiService.setIsWriting(false);
              if (this.context.variables.playAudioNotification) {
                this.playAudioNotification();
              }
            } else {
              this.messageService.addChatMessage(msg, null, this.visitorNick);
            }
          });
        }
      },
      {
        event: 'close',
        handler: obj => {
          this.onClose(obj);
        }
      },
      {
        event: 'datachannel',
        handler: dc => {
          if (dc && dc.id === 'callstatus') {
            this.zone.run(() => {
              this.registerCallStatusEvents(dc);
            });
          }
        }
      },
      {
        event: 'joined',
        handler: (c) => {
          if (this.interactionCreated) {
            this.debug('joined', c);
            this.onJoined(c);
          } else {
            this.debug('joined', c, 'queued');
            this.interactionEvtQueue.push({ type: 'joined', data: c });
          }
        }
      },
      {
        event: 'rawmessage',
        handler: (msg) => {
          if (this.interactionCreated) {
            this.debug('rawmessage', msg);
            this.processRawMessage(msg);
          } else {
            this.debug('rawmessage', msg, 'queued');
            this.interactionEvtQueue.push({ type: 'rawmessage', data: msg });
          }
        }
      },
      {
        event: 'link',
        handler: (url: string, from_id: string, from_nick: string, desc?: string, agent?: boolean) => {
          this.openAttachment(url);
          this.zone.run(() => {
            this.messageService.addLinkMessage(url, from_id, from_nick, desc, agent);
          });
        }
      },
      {
        event: 'iswriting',
        handler: (from_id, from_nick, agent) => {
          this.zone.run(() => {
            if (agent) {
              this.track('agent is writing');
              this.setIsWriting();
            }
          });
        }
      },
      {
        event: 'localtext',
        handler: (text) => {
          this.zone.run(() => {
            if (this.agent && this.agent.is_bot) {
              this.setIsWriting();
            }
            if (!this.isOfflineMessage(text)) {
              this.messageService.addLocalMessage(text);
            }
          });
        }
      },
      {
        event: 'left',
        handler: obj => {
          this.logger.log('LEFT', obj);
          this.onLeft(obj);
        }
      },
      {
        event: 'localcapabilities',
        handler: caps => {
          this.logger.log('localcapabilities', caps);
        }
      },
      {
        event: 'capabilities',
        handler: caps => {
          this.uiService.setRemoteCaps(caps);
        }
      },
      {
        event: 'mediachange',
        handler: async (media, changed) => {
          this.logger.log('mediachange', media, changed);
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
          this.zone.run(() => {
            this.protocolService.setMediaChange(media);
            this.uiService.setMediaState(media);
            if (changed && changed.removed && changed.removed.media && changed.removed.media.Screen) {
              this.store.dispatch(new NewEvent({ type: 'removedMediaScreen' }));
              this.uiService.setHangUpState();
            }
          });
        }
      },
      {
        event: 'mediaoffer',
        handler: (offer, cb) => {
          this.zone.run(() => {
            this.onMediaOffer(offer, cb);
          });
        }
      },
      {
        event: 'transferred',
        handler: () => {
          this.zone.run(() => {
            this.track('transferred');
            this.messageService.sendSystemMessage('STRINGS.MESSAGES.TRANSFERRED');
            this.setTransferTimer();
          });
        }
      }
    ];

    Object.keys(this.customActions).forEach(event => {
      contactHandlers.push({
        event,
        handler: (message, callback) => {
          this.zone.run(() => {
            this.customActions[event]['callback'] = callback;
            this.customActions[event].stream.next(message);
          });
        }
      });
    });

    return contactHandlers;
  }
  maximizeWidget(isFullScreen: boolean, dim: Dimension) {
    (isFullScreen) ? this.uiService.setFullScreen() : this.uiService.setNormalState();
    this.setDimension(dim);
  }
  mergeOffer(diffOffer, cb) {
    this.contact.mergeMedia(diffOffer).then(mergedMedia => {
      this.zone.run(() => {
        cb(undefined, mergedMedia);
        // this.uiService.setOfferAccepted();
      });
    });
  }
  muteToggle(muted) {
    this.uiService.setMuteInProgress();
    this.contact.getMediaEngine('WebRTC').then(engine => {
      if (muted) {
        engine.muteLocalAudio();
      } else {
        engine.unmuteLocalAudio();
      }
      this.zone.run(() => {
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
  async onAgentJoin(join) {
    this.joinedByAgent = true;
    this.cancelTransferTimeout();
    return this.contact.getMedia().then((media) => {
      this.zone.run(() => {
        const agent: AgentState = {
          id: join.user,
          nick: join.nick,
          is_bot: !!join.is_bot,
          is_agent: !join.is_bot,
        };
        if (join.avatar) {
          agent.avatar = join.avatar;
        } else if(this.context.variables.agentAvatarDefault) {
          agent.avatar = this.context.variables.agentAvatarDefault;
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
      this.zone.run(() => {
        this.uiService.setClosedByAgent();
        this.track('closed by agent');
        this.store.dispatch(new NewEvent({ type: 'closedByAgent', data: obj }));

        this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
        this.isClosed = true;
        this.vivocha.pageRequest('interactionClosed', 'closed');
      });
    });
  }
  onJoined(data) {
    if (data.user) {
      this.cancelDissuasionTimeout();
      this.onAgentJoin(data);
    } else {
      this.onLocalJoin(data);
    }
  }
  onLeft(obj) {
    if (
      (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) ||
      (obj.reason && obj.reason === 'disconnect')
    ) {
      this.leave('remote').then(() => {
        this.zone.run(() => {
          this.uiService.setClosedByAgent();
          this.track('closed by agent');
          this.store.dispatch(new NewEvent({ type: 'closedByAgent', data: obj }));

          this.messageService.sendSystemMessage('STRINGS.MESSAGES.REMOTE_CLOSE');
          this.isClosed = true;
          this.vivocha.pageRequest('interactionClosed', 'closed');
        });
      });
    }
  }
  onLocalJoin(join) {
    this.contact.getRemoteCapabilities().then(caps => {
      this.uiService.setRemoteCaps(caps);
    });
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
  async onRawMessage(msg) {
    if (!this.joinedByAgent && msg.agent) {
      this.cancelDissuasionTimeout();
      const agentInfo = this.vivocha.dot(this, 'contact.contact.agentInfo') || {};
      const joinedAgent: any = {
        user: msg.from_id,
        nick: msg.from_nick,
        is_bot: msg.is_bot,
      };
      if (agentInfo.avatar && agentInfo.id === msg.from_id) {
        joinedAgent.avatar = agentInfo.avatar;
      }
      await this.onAgentJoin(joinedAgent);
    }
    if (msg.type !== 'text') {
      return;
    }
    const agent = (msg.agent) ? this.agent : false;
    if (msg.quick_replies) {
      this.messageService.addQuickRepliesMessage(msg, agent);
    } else if (msg.template) {
      this.messageService.addTemplateMessage(msg, agent);
    } else {
      this.messageService.addChatMessage(msg, agent, this.visitorNick);
    }
    if (msg.agent) {
      this.uiService.setIsWriting(false);
    }
    this.uiService.newMessageReceived();
    if (this.context.variables.playAudioNotification) {
      this.playAudioNotification();
    }
    this.hasReceivedMsgs = true;
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
  processRawMessage(msg) {
    this.zone.run(() => {
      this.onRawMessage(msg);
    });
  }
  registerCallStatusEvents(dataChannel) {
    for (const i in this.cbnChannelStatus) {
      dataChannel.on(this.cbnChannelStatus[i], (info) => {
        this.zone.run(() => {
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
    this.track('resuming contact');
    this.vivocha.dataRequest('getData', 'persistence.contact').then((contactData) => {
      this.track('resuming getData');
      this.vivocha.resumeContact(contactData, this.mapContact()).then((contact) => {
        this.track('resumed contact');
        this.zone.run(() => {
          this.contact = contact;
          this.mapContactActions();
          this.contact.getLocalCapabilities().then((caps) => {
            this.uiService.setLocalCaps(caps);
          });
        });
        this.vivocha.pageRequest('interactionCreated', contact);

        this.interactionReady();

        this.zone.run(() => {
          this.uiService.initializeProtocol(context, {
            initialOffer: contact.initial_offer
          });
          this.contact.getMedia().then((media) => {
            this.zone.run(() => {
              const agentInfo = this.contact.contact.agentInfo;
              this.logger.log('LOCAL JOIN', agentInfo, this.contact);
              if (agentInfo) {
                this.uiService.setUiReady();
                const agent: AgentState = {
                  id: agentInfo.id,
                  nick: agentInfo.nick,
                  is_bot: !!agentInfo.bot,
                  is_agent: !agentInfo.bot,
                };
                if (agentInfo.avatar) {
                  agent.avatar = agentInfo.avatar;
                } else if(this.context.variables.agentAvatarDefault) {
                  agent.avatar = this.context.variables.agentAvatarDefault;
                }
                this.agent = agent;
                this.uiService.setAgent(agent);
                if (this.context.variables.showAgentInfoOnTopBar) {
                  this.uiService.setTopBarWithAgentInfo(agent);
                } else {
                  this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT' });
                }
                this.protocolService.setMediaChange(media);
                if (Object.keys(media).length > 1) {
                  this.uiService.initializeMedia(media);
                } else {
                  this.uiService.setMinimizedState();
                }
                this.checkForTranscript();
              } else {
                this.dcService.setResolved();
                this.uiService.setUiReady();
                this.uiService.showQueuePanel();
                this.track('queue screen - resume');
              }
            });
          });
        });

      }, (err) => {
        this.vivocha.pageRequest('interactionFailed', err.message);
        this.uiService.setCreationFailed();
        this.track('resume failed');
        setTimeout(() => {
          this.closeApp();
          this.track('iframe app removed');
        }, 2000);
      });
    });
  }
  sendAttachment(upload) {
    this.uiService.setUploading();
    this.contact.attach(upload.file, upload.text).then(() => {
      this.zone.run(() => {
        this.uiService.setUploaded();
      });
    });
  }
  sendIsWriting() {
    if (!this.autoChat && this.contact) {
      this.track('visitor is writing');
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
      this.messageService.addChatMessage({ body: text, ts: +new Date().getTime() });
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
        this.messageService.addChatMessage({ body: text, ts: +new Date().getTime() });
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
      this.uiService.setTopBar({ title: 'STRINGS.TOPBAR.TITLE_DEFAULT', subtitle: 'STRINGS.TOPBAR.SUBTITLE_DEFAULT' });
    }
    if (this.context.variables.showWelcomeMessage && !this.isInPersistence()) {
      this.messageService.sendSystemMessage('STRINGS.CHAT.WELCOME_MESSAGE', { nickname: agent.nick });
    }
    this.track('answered state');
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
    this.isWritingTimer = setTimeout(() => {
      this.uiService.setIsWriting(false);
    }, this.isWritingTimeout);
  }
  setNormalScreen(dim: any = {}) {
    this.uiService.setNormalScreen();
    this.vivocha.setNormalScreen();
    this.vivocha.pageRequest('setSize', {
      width: this.context.variables.initialWidth,
      height: this.context.variables.initialHeight
    });
    if (Object.keys(dim).length > 0) {
      this.vivocha.pageRequest('setDimensions', dim);
    } else {
      this.vivocha.pageRequest('setPosition', {
        right: this.context.variables.initialRight,
        bottom: this.context.variables.initialBottom
      });
    }
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
        this.track('recontact processing');
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
          this.track('dissuaded');
        } else {
          this.uiService.setCreationFailed();
          this.track('creation failed', reason);
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
    this.track('show close modal', show);
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
  toggleCamera() {
    this.contact.switchToNextCamera();
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
      this.zone.run(() => {
        this.uiService.setInTransit(true);
      });
      this.contact.offerMedia(mediaOffer).then(() => {
        this.zone.run(() => {
          this.uiService.setInTransit(false);
        });
      });
    });
  }
  track(id: string, obj?: any) {
    if (this.vivocha && this.context.variables.enableDebug) {
      const v = JSON.stringify(obj) || '-';
      this.vivocha.track(id, v);
    }
  }
  updateLeftScrollOffset(o: LeftScrollOffset) {
    this.messageService.updateLeftScroll(o);
  }
  upgradeCbnToChat() {
    this.uiService.upgradeCbnToChat();
  }
}
