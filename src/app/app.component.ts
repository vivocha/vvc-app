import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowRef} from './core/window.service';
import {VvcContactService} from './core/contact.service';
import {Store} from '@ngrx/store';
import {VvcWidgetState, AppState, VvcOffer} from './core/core.interfaces';
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
  public isMobile = 'false';
  public world: string;
  public acct: string;

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
    this.appendVivochaScript();
    this.checkForVivocha();

  }
  ngOnInit() {
    this.window.parent.postMessage('vvc-maximize-iframe', '*');
    this.bindStores();
    this.cserv.voiceStart.subscribe( () => {
      this.startTimer();
    });
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
  appendVivochaScript() {
    this.parseIframeUrl();
    const vvcScript = this.window.document.createElement('script');
    vvcScript.src = 'https://' + this.world + '.vivocha.com/a/' + this.acct + '/js/vivocha_widget.js';
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
    if (this.window['vivocha'] && this.window['vivocha'].getContact) {
      this.cserv.init(this.window['vivocha']);
      //this.parseIframeUrl();
      this.loadCampaignSettings();
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
    this.window.parent.postMessage('vvc-close-iframe', '*');
  }
  loadCampaignSettings() {
    const initialOffer = this.getInitialOffer();
    this.initialConf = {
      serv_id: this.servId,
      type: this.type,
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
    this.initialConf.opts.mobile = (this.isMobile === 'true');
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
    console.log('iframe hash', hash);
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.servId = hashParts[0];
      this.lang = hashParts[1].split('=')[1];
      this.type = hashParts[2].split('=')[1];
      this.isMobile = hashParts[3].split('=')[1];
      this.acct = hashParts[4].split('=')[1];
      this.world = hashParts[5].split('=')[1];

      console.log('iframe params', {
        servId: this.servId,
        acct: this.acct,
        world: this.world,
        lang: this.lang,
        isMobile: this.isMobile
      });

      this.translate.getTranslation( this.lang );
      this.translate.setDefaultLang('en');
      this.translate.use(this.lang);
      // this.loadCampaignSettings();
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
    this.cserv.syncDataCollection(dc);
  }
  upgradeMedia(media: string) {
    const startedWith = (this.widgetState.voice) ? 'voice' : media;
    this.cserv.askForUpgrade(media, startedWith.toUpperCase()).then( () => {
      this.startTimer();
    });
  }
}
