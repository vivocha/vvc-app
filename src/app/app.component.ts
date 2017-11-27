import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowRef} from './core/window.service';
import {VvcContactService} from './core/contact.service';
import {Store} from '@ngrx/store';
import {VvcWidgetState, AppState} from './core/core.interfaces';
import {TranslateService} from '@ngx-translate/core';
import {MediaToolsComponent} from './media-tools/media-tools.component';

import { BasicContactCreationOptions, ClientContactCreationOptions, ContactMediaOffer } from '@vivocha/global-entities/dist/contact';
import { InteractionManager, InteractionContext } from '@vivocha/client-visitor-core/dist/widget.d';
import { VivochaVisitorInteraction } from '@vivocha/client-visitor-core/dist/interaction.d';

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

  private servId: string; // TODO remove
  public type = 'chat';
  public isMobile = 'false';

  public selectedDataMessage;
  private closeModal = false;

  @ViewChild(MediaToolsComponent) mediaTools;
  callTimerInterval;
  callTimer = 0;
  wasFullScreen = false;

  public widgetState: VvcWidgetState;
  public messages: Array<any>;

  vivocha: any;

  constructor(private wref: WindowRef,
              private cserv: VvcContactService,
              private store: Store<AppState>,
              private translate: TranslateService) {

    this.window = wref.nativeWindow;
    this.appendVivochaScript();
    this.checkForVivocha();

  }
  ngOnInit() {
    // this.vivocha.maximize();
    this.bindStores();
    this.cserv.voiceStart.subscribe( () => {
      this.startTimer();
    });
  }
  abandon() {
    this.vivocha.close();
  }
  acceptIncomingRequest(evt) {
    this.startTimer();
    this.cserv.acceptOffer(evt);
  }
  addLocalVideo() {
    this.cserv.addLocalVideo();
  }
  appendVivochaScript() {
    this.parseIframeUrl();
    const vvcScript = this.window.document.createElement('script');
    vvcScript.src = `https://${this.world}.vivocha.com/a/${this.acct}/js/vivocha_interaction.js`;
    this.window.document.getElementsByTagName('head')[0].appendChild(vvcScript);
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
        this.page = this.vivocha.bus.services[`page-${this.busId}`];
        this.page.getContext().then((context: InteractionContext) => {
          console.log('vivocha.ready context');
          this.cserv.init(this.vivocha);
          this.loadCampaignSettings(context);
          this.translate.getTranslation(context.language);
          this.translate.setDefaultLang('en');
          this.translate.use(context.language);
        })
      });
    } else {
      setTimeout( () => this.checkForVivocha(), 500);
    }
  }
  closeContact() {
    this.cserv.closeContact();
    if (this.widgetState.hasSurvey) {
      this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
    } else {
      this.vivocha.close();
    }
  }
  closeOnSurvey() {
    this.vivocha.close();
  }
  denyIncomingRequest(media) {
    this.cserv.denyOffer(media);
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
  leave() {
    this.cserv.closeContact();
    this.vivocha.close();
  }
  loadCampaignSettings(context: InteractionContext) {
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

    // TODO add the following properties:
    //data?: ContactDataCollection;
    //nick?: string;
    //recall?: ContactRecallSettings;
    //debug?: boolean;

    Promise.resolve(true).then(() => {
      if (context.dataCollections) {
        console.log('should collect data collection', context.dataCollections);
        return this.cserv.collectInitialData(context.dataCollections).then(dataCollection => {
          this.contactOptions.data = dataCollection;
          // TODO check for nickname;
        });
      }
    }).then(() => {
      console.log('checking for pre-routing rules');
      this.page.contactCreation(this.contactOptions, (opts: ClientContactCreationOptions) => {
        console.log('pre-routing callback', opts);
        // TODO merge opts
        console.log('creating contact', this.contactOptions);
        this.cserv.createContact(this.contactOptions, context);
      });
    });
  }
  minimize(state) {
    this.store.dispatch({ type: 'MINIMIZE', payload: state });
    (state) ? this.vivocha.minimize()
            : this.vivocha.maximize();
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
  removeLocalVideo() {
    this.cserv.removeLocalVideo();
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
  }
  showCloseModal(isContactClosed) {
    if (isContactClosed) {
      if (this.widgetState.hasSurvey) {
        this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
      } else {
        //this.vivocha.close();
      }
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
  submitInitialData() {
    // TODO check
    // this.cserv.sendData(this.initialConf);
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
