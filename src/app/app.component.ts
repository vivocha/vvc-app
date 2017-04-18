import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowRef} from './core/window.service';
import {VvcContactService} from './core/contact.service';
import {Store} from '@ngrx/store';
import {VvcWidgetState, AppState, VvcOffer, DataCollection, VvcDataCollection} from './core/core.interfaces';
import {TranslateService} from '@ngx-translate/core';
import {MediaToolsComponent} from './media-tools/media-tools.component';




@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private window;
  private servId: string;
  private lang = 'en';
  public type = 'chat';
  private previousMsgLength = 1;
  public selectedDataMessage;
  private closeModal = false;
  private initialConf;

  @ViewChild(MediaToolsComponent) mediaTools;
  callTimerInterval;
  callTimer = 0;
  wasFullScreen = false;

  public widgetState: VvcWidgetState;
  public messages: Array<any>;

  constructor(private wref: WindowRef,
              private cserv: VvcContactService,
              private store: Store<AppState>,
              private translate: TranslateService) {
    this.window = wref.nativeWindow;
    this.checkForVivocha();

    this.window.start = (withError: boolean) => {
      this.createContact();
    };
  }
  ngOnInit() {
    this.window.parent.postMessage('vvc-maximize-iframe', '*');
    this.bindStores();
  }
  abandon() {
    this.window.parent.postMessage('vvc-close-iframe', '*');
  }
  acceptIncomingRequest(evt) {
    this.startTimer();
    this.cserv.acceptOffer(evt);
  }
  addLocalVideo() {
    this.cserv.addLocalVideo();
  }
  bindStores() {
    this.store.subscribe( state => {
      this.widgetState = <VvcWidgetState> state.widgetState;
      this.messages = state.messages;
      if (this.wasFullScreen && this.widgetState.video === false) {
        this.setNormalScreen();
      }
      console.log('STATE', this.widgetState.state, this.widgetState.not_read);
    });
  }
  checkForVivocha() {
    if (this.window['vivocha'] && this.window['vivocha'].getContact) {
      this.cserv.init(this.window['vivocha']);
      this.parseIframeUrl();
    } else {
      setTimeout( () => this.checkForVivocha(), 500);
    }
  }
  closeContact() {
    this.cserv.closeContact();
    // this.window.parent.postMessage('vvc-close-iframe', '*');
    if (this.widgetState.hasSurvey) {
      this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
    } else {
      this.window.parent.postMessage('vvc-close-iframe', '*');
    }
  }
  closeOnSurvey() {
    this.window.parent.postMessage('vvc-close-iframe', '*');
  }
  compileDataCollection(dc: DataCollection) {
    /*
    console.log('DC', dc);
    this.selectedDataCollection = dc;
    this.store.dispatch({ type: 'SHOW_DATA_COLLECTION', payload: true });
    */
  }
  createContact() {
    this.cserv.createContact(this.initialConf);
    /*
    const initialOffer = this.getInitialOffer();
    this.cserv.createContact({
      serv_id: this.servId,
      type: 'chat',
      nick: 'Marcolino',
      initial_offer: initialOffer,
      opts: { // campaign /service options
        media: {
          Video : 'visitor',
          Voice : 'visitor'
        },
        survey: {
          dataToCollect: 'schema#survey-id',
          sendTranscript: 'ask'
        },
        dataCollection: {
          dataToCollect: 'schema#data-id'
        }
      }
    });
    */
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
  getInitialOffer(): VvcOffer {
    switch (this.type) {
      case 'voice': return { Voice: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'}};
      case 'video': return { Video: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'}};
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
    this.window.parent.postMessage('vvc-close-iframe', '*');
  }
  loadCampaignSettings() {
    const initialOffer = this.getInitialOffer();
    this.initialConf = {
      serv_id: this.servId,
      type: 'chat',
      nick: 'Marcolino',
      initial_offer: initialOffer,
      opts: { // campaign /service options
        media: {
          Video : 'visitor',
          Voice : 'visitor'
        },
        survey: {
          dataToCollect: 'schema#survey-id',
          sendTranscript: 'ask'
        }
        /*,
        dataCollection: {
          dataToCollect: 'schema#data-id'
        }*/
      }
    };
    if (this.initialConf.opts.dataCollection) {
      console.log('should collect data collection');
      this.cserv.collectInitialData(this.initialConf);
    } else {
      console.log('creating the contact');
      this.cserv.createContact(this.initialConf);
    }
  }
  minimize(state) {
    this.store.dispatch({ type: 'MINIMIZE', payload: state });
    (state) ? this.window.parent.postMessage('vvc-minimize-iframe', '*')
            : this.window.parent.postMessage('vvc-maximize-iframe', '*');
  }
  parseIframeUrl() {
    const hash = this.window.location.hash;
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.servId = hashParts[0];
      this.lang = hashParts[1].split('=')[1];
      this.type = hashParts[2].split('=')[1];
      console.log('type', this.type);
      this.translate.getTranslation( this.lang );
      this.translate.setDefaultLang('en');
      this.translate.use(this.lang);
      // this.createContact();
      this.loadCampaignSettings();
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
    this.window.parent.postMessage('vvc-fullscreen-on', '*');
  }
  setMute(mute: boolean) {
    this.cserv.muteAudio(mute);
  }
  setNormalScreen() {
    this.wasFullScreen = false;
    this.store.dispatch({ type: 'FULLSCREEN', payload: false});
    this.window.parent.postMessage('vvc-fullscreen-off', '*');
  }
  showCloseModal(isContactClosed) {
    if (isContactClosed) {
      if (this.widgetState.hasSurvey) {
        this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
      } else {
        this.window.parent.postMessage('vvc-close-iframe', '*');
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
    this.cserv.sendData(this.initialConf);
  }
  syncDataCollection(obj) {
    const dc = obj.dataCollection;
    const msg = obj.message;
    this.cserv.syncDataCollection(dc);
  }
  upgradeMedia(media: string) {
    const startedWith = (this.widgetState.voice) ? 'voice' : media;
    this.cserv.askForUpgrade(media, startedWith.toUpperCase()).then( () => {
      this.startTimer();
    });
  }
}
