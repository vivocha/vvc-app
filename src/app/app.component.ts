import { Component, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { objectToDataCollection } from '@vivocha/global-entities/dist/wrappers/data_collection';
import { BasicContactCreationOptions, ClientContactCreationOptions, ContactMediaOffer } from '@vivocha/global-entities/dist/contact';
import { InteractionContext } from '@vivocha/client-visitor-core/dist/widget.d';
import { InteractionManager } from '@vivocha/client-visitor-core/dist/page_interaction.d';
import { VivochaVisitorInteraction } from '@vivocha/client-visitor-core/dist/interaction.d';

import { WindowRef } from './core/window.service';
import { VvcContactService } from './core/contact.service';
import { VvcWidgetState, AppState } from './core/core.interfaces';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import { Angular2AutoScroll } from 'app/autoscroll.directive';

declare var vivocha: VivochaVisitorInteraction;

@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private window;
  private busId: string;
  public world: string;
  public acct: string;

  public page: InteractionManager;
  public context: InteractionContext;
  public contactOptions: BasicContactCreationOptions;

  public type = 'chat';
  public isMobile = 'false';

  public selectedDataMessage;
  private closeModal = false;
  private closeToDestroy = false;

  @ViewChild(MediaToolsComponent) mediaTools;
  callTimerInterval;
  callTimer = 0;
  wasFullScreen = false;

  public widgetState: VvcWidgetState;
  public messages: Array<any>;

  waitingInitialDataCollections: {
    [id: string]: (...args) => void;
  } = {};

  vivocha: any;

  @ViewChild(Angular2AutoScroll) autoScroll;

  constructor(private wref: WindowRef,
              private cserv: VvcContactService,
              private store: Store<AppState>,
              private zone: NgZone,
              private translate: TranslateService) {

    this.window = wref.nativeWindow;
    this.parseIframeUrl();
    this.checkForVivocha();
  }
  ngOnInit() {
    this.bindStores();
    this.initResizeListeners();
    this.cserv.voiceStart.subscribe( () => {
      this.startTimer();
    });
  }
  abandon() {
    // TODO show message
    this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    this.closeInteraction();
  }
  acceptIncomingRequest(evt, msg) {
    if (msg.type === 'incoming-request') {
      this.cserv.acceptRequest(evt, msg);
    } else {
      this.cserv.acceptOffer(evt);
      this.startTimer();
    }
  }
  addLocalVideo() {
    this.cserv.addLocalVideo();
  }
  bindStores() {
    this.store.subscribe( state => {
      console.log('STORE', state);
      this.widgetState = <VvcWidgetState> state.widgetState;
      this.messages = state.messages;
      if (this.wasFullScreen && this.widgetState.video === false) {
        this.setNormalScreen();
      }
    });
  }
  checkForVivocha() {
    if (this.window['vivocha'] && this.window['vivocha'].ready) {
      this.window.vivocha.ready(this.busId).then(() => {
        console.log('vivocha.ready');
        this.vivocha = this.window['vivocha'];
        this.isMobile = this.vivocha.isMobile();
        this.vivocha.pageRequest('getContext').then((context: any) => {
          console.log('vivocha.ready context', context);
          this.context = context;

          if(!this.context.campaign.channels.web.interaction.variables) {
            this.context.campaign.channels.web.interaction.variables = {};
          }
          // check companyLogoUrl
          if (this.context.campaign.channels.web.interaction.variables.companyLogoUrl) {
            this.context.campaign.channels.web.interaction.variables.companyLogoUrl = '../../../' + this.context.campaign.channels.web.interaction.variables.companyLogoUrl;
          } else {
            this.context.campaign.channels.web.interaction.variables.companyLogoUrl = 'assets/static/acct-img.png';
          }

          this.cserv.init(this.vivocha);
          this.translate.getTranslation(context.language);
          this.translate.setDefaultLang('en');
          this.translate.use(context.language);
          if (context.persistenceId) {
            this.resumeContactCreationOptions(context);
          } else {
            this.createContactCreationOptions(context);
          }
        })
      });
    } else {
      setTimeout( () => this.checkForVivocha(), 200);
    }
  }
  closeContact() {
    this.cserv.closeContact();
    if (this.widgetState.hasSurvey) {
      this.zone.run( () => {
        this.store.dispatch({
          type: 'SHOW_SURVEY',
          payload: this.context.survey
        });
      });
    } else {
      // TODO hide modal if present
      // TODO show message
      this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    }
    this.closeInteraction();
  }
  closeInteraction() {
    if (!this.closeToDestroy) {
      this.vivocha.pageRequest('interactionClosed', 'close');
      this.closeToDestroy = true;
    } else {
      this.vivocha.pageRequest('interactionClosed', 'destroy');
    }
  }
  closeOnSurvey(data) {
    const survey = objectToDataCollection(data, this.context.survey.id, this.context.survey);
    this.cserv.contact.storeSurvey(survey, (err, res) => {
      // TODO show message
      this.closeInteraction();
    });
  }
  createContactCreationOptions(context: InteractionContext) {
    this.contactOptions = {
      campaignId: context.campaign.id,
      version: context.campaign.version,
      channelId: 'web',
      entryPointId: context.entryPointId,
      engagementId: context.engagementId,
      initialOffer: this.getInitialOffer(context.requestedMedia),
      lang: context.language,
      vvcu: context.page.vvcu,
      vvct: context.page.vvct,
      first_uri: context.page.first_uri,
      first_title: context.page.first_title
    };

    Promise.resolve(true).then(() => {
      if (context.dataCollections && context.dataCollections.length > 0) {
        console.log('found', context.dataCollections.length, 'data collection objects', JSON.stringify(context.dataCollections));
        this.contactOptions.data = [];
        const showDataCollection = (dataCollection): Promise<boolean> => {
          //console.log(JSON.stringify(dataCollection, null, 2));
          return (new Promise((resolve, reject) => {
            this.waitingInitialDataCollections[dataCollection.id] = (data) => {
              for (let i = 0; i < dataCollection.fields.length; i++) {
                if (dataCollection.fields[i].format === 'nickname' && data[dataCollection.fields[i].id]) {
                  this.contactOptions.nick = data[dataCollection.fields[i].id];
                  break;
                }
              }
              this.contactOptions.data.push(objectToDataCollection(data, dataCollection.id, dataCollection));
              resolve(true);
            };
            this.zone.run( () => {
              this.store.dispatch({
                type: 'INITIAL_DATA',
                payload: dataCollection
              });
              this.translate.reloadLang(context.language);
            });
          }));
        };
        const next = (i: number = 0): Promise<boolean> => {
          if (context.dataCollections[i]) {
            console.log('collecting data collection', i, context.dataCollections[i].id);
            return showDataCollection(context.dataCollections[i]).then((data) => {
              return next(++i);
            });
          } else {
            return Promise.resolve(true);
          }
        }
        return next();
      }
    }).then(() => {
      console.log('checking for pre-routing rules');
      this.vivocha.pageRequest('interactionCreation', this.contactOptions, (opts: ClientContactCreationOptions) => {
        console.log('pre-routing callback', opts);
        // TODO merge opts
        if (!this.contactOptions.nick) {
          // TODO get default visitor nickname this.contactOptions.nick
        }
        // TODO add the following properties to this.contactOptions (recall debug)
        // recall?: ContactRecallSettings;
        // debug?: boolean;
        console.log('creating contact', this.contactOptions);
        this.cserv.createContact(this.contactOptions, context);
      });
    });
  }
  denyIncomingRequest(evt, msg) {
    if (msg.type === 'incoming-request') {
      this.cserv.denyRequest(evt, msg);
    } else {
      this.cserv.denyOffer(evt);
    }
  }
  dismissCloseModal() {
    this.closeModal = false;
  }
  download(url) {
    this.window.open(url, '_blank');
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
  hangup() {
    this.stopTimer();
    this.cserv.hangup();
  }
  hideDataCollectionPanel() {
    this.store.dispatch({ type: 'SHOW_DATA_COLLECTION', payload: false });
  }
  initResizeListeners() {
    const supportedModes = ['top', 'left', 'bottom', 'right', 'top-right', 'top-left', 'bottom-right', 'bottom-left'];
    supportedModes.forEach(m => this.resizeWindow(m));
  }
  leave() {
    this.cserv.closeContact();
    // TODO show message
    this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    this.closeInteraction();
  }
  minimize(state) {
    this.store.dispatch({ type: 'MINIMIZE', payload: state });
    if (state) {
      this.vivocha.minimize(
        {
          bottom: "10px",
          right: "10px"
        },
        {
          width: '70px',
          height: '70px'
        })
    } else {
      this.vivocha.maximize();
    }
  }
  parseIframeUrl() {
    const hash = this.window.location.hash;
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.busId = hashParts[0];
      this.acct = hashParts[1];
      this.world = hashParts[2];
    }
  }
  processAction(action: any){
    this.cserv.sendPostBack(action);
  }
  removeLocalVideo() {
    this.cserv.removeLocalVideo();
  }
  resizeWindow(mode: string) {
    let node: HTMLElement;
    switch (mode) {
      case 'top':
        node = document.getElementById('n-resize');
        break;
      case 'left':
        node = document.getElementById('w-resize');
        break;
      case 'right':
        node = document.getElementById('e-resize');
        break;
      case 'bottom':
        node = document.getElementById('s-resize');
        break;
      case 'top-right':
        node = document.getElementById('nw-resize');
        break;
      case 'top-left':
        node = document.getElementById('ne-resize');
        break;
      case 'bottom-right':
        node = document.getElementById('sw-resize');
        break;
      case 'bottom-left':
        node = document.getElementById('se-resize');
        break;
    }
    const mouseDown$ = Observable.fromEvent(node, 'mousedown');
    const mouseMove$ = Observable.fromEvent(document, 'mousemove');
    const mouseUp$ = Observable.fromEvent(document, 'mouseup');

    mouseDown$
      .switchMap(() => mouseMove$)
      .takeUntil(mouseUp$)
      .subscribe(evt => {
        if (!this.widgetState.minimized && this.context.campaign.channels.web.interaction.variables.canBeResized) { // is not minimized && can be resized
          switch (mode) {
            case 'top':
              this.vivocha.resize({
                width: 0,
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: 0
              });
              break;
            case 'left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: 0
              });
              this.vivocha.move({
                top: 0,
                left: evt['movementX']
              });
              break;
            case 'right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: 0
              });
              break;
            case 'bottom':
              this.vivocha.resize({
                width: 0,
                height: evt['movementY']
              });
              break;

            case 'top-right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: 0
              });
              break;

            case 'top-left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: evt['movementX']
              });
              break;

            case 'bottom-right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: evt['movementY']
              });
              break;

            case 'bottom-left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: evt['movementY']
              });
              this.vivocha.move({
                top: 0,
                left: evt['movementX']
              });
              break;
          }
        } else {
          // do nothing;
        }
      }, err => { }, () => {
        this.resizeWindow(mode);
      });
  }
  resumeContactCreationOptions(context: InteractionContext) {
    this.cserv.resumeContact(context);
  }
  sendAttachment(evt) {
    console.log('sending attachment', evt.text, evt.file);
    if (evt.file) {
      this.cserv.sendAttachment({ file: evt.file, text: evt.text});
    }
  }
  sendChatMessage(text) {
    if (text !== '') {
      this.cserv.sendText(text);
    }
  }
  sendDataCollection(obj) {
    this.cserv.sendDataCollection(obj);
  }
  setChatVisibility(visibility: boolean) {
    this.store.dispatch({ type: 'CHATVISIBILITY', payload: visibility});
    if(visibility) {
      this.store.dispatch({ type: 'RESET_NOT_READ' });
    }
  }
  setFullScreen() {
    this.wasFullScreen = true;
    this.store.dispatch({ type: 'FULLSCREEN', payload: true});
    this.vivocha.setFullScreen();
  }
  setMute(mute: boolean) {
    this.cserv.muteAudio(mute);
  }
  setNormalScreen() {
    this.wasFullScreen = false;
    this.store.dispatch({ type: 'FULLSCREEN', payload: false});
    this.vivocha.setNormalScreen();
    if(this.autoScroll) {
      setTimeout(() => this.autoScroll.forceScrollDown(), 50);
    } else {
      console.warn('Missing reference to autoScroll, cannot scroll down the message list');
    }
  }
  showCloseModal(isContactClosed) {
    if (isContactClosed) {
      this.closeContact();
    } else {
      this.closeModal = true;
    }
  }
  showDataCollection(message) {
    this.selectedDataMessage = message;
  }
  startTimer() {
    this.stopTimer();
    this.callTimerInterval = setInterval( () => {
      this.callTimer++;
      if (this.mediaTools) {
        this.mediaTools.setTime(this.callTimer);
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.callTimerInterval);
    this.callTimer = 0;
  }
  submitInitialData(id, dataCollection) {
    this.waitingInitialDataCollections[id].call(this, dataCollection);
  }
  syncDataCollection(obj) {
    const dc = obj.dataCollection;
    this.cserv.syncDataCollection(dc);
  }
  upgradeMedia(media: string) {
    const startedWith = (this.widgetState.voice) ? 'voice' : media;
    this.cserv.askForUpgrade(media, startedWith.toUpperCase()).then( () => {
      this.startTimer();
    });
  }
}
