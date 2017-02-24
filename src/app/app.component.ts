import {Component, OnInit} from '@angular/core';
import {WindowRef} from './core/window.service';
import {VvcContactService} from './core/contact.service';
import {Store} from '@ngrx/store';
import {VvcWidgetState, AppState, VvcOffer} from './core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private window;
  private servId: string;
  private lang: string;
  private type = 'chat';

  private widgetState: VvcWidgetState;
  private messages: Array<any>;
  constructor(private wref: WindowRef,
              private cserv: VvcContactService,
              private store: Store<AppState>,
              private sanitizer: DomSanitizer) {
    this.window = wref.nativeWindow;
    this.checkForVivocha();

    this.window.start = (withError: boolean) => {
      this.createContact();
    };
  }
  ngOnInit() {
    this.bindStores();
  }
  acceptIncomingRequest() {
    this.cserv.acceptOffer();
  }
  addLocalVideo() {
    this.cserv.addLocalVideo();
  }
  bindStores() {
    this.store.subscribe( state => {
      this.widgetState = <VvcWidgetState> state.widgetState;
      this.messages = state.messages;
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
  createContact() {
    const initialOffer = this.getInitialOffer();
    this.cserv.createContact({ serv_id: this.servId, type: 'chat', nick: 'Marcolino', initial_offer: initialOffer});
  }
  denyIncomingRequest() {
    this.cserv.denyOffer();
  }
  getInitialOffer(): VvcOffer {
    switch (this.type) {
      case 'voice': return { Voice: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'}};
      case 'video': return { Video: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'}};
      default: return { Chat: { rx: 'required', tx: 'required'}, Sharing: { rx: 'required', tx: 'required'} };
    }
  }
  hangup() {
    this.cserv.hangup();
  }
  logState() {
    console.log('state', this.widgetState);
  }
  parseIframeUrl() {
    const hash = this.window.location.hash;
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.servId = hashParts[0];
      this.lang = hashParts[1].split('=')[1];
      this.type = hashParts[2].split('=')[1];
      console.log('type', this.type);
    }
  }
  removeLocalVideo() {
    this.cserv.removeLocalVideo();
  }
  sendChatMessage(text) {
    if (text !== '') {
      this.cserv.sendText(text);
    }
  }
  setFullScreen() {
    this.window.parent.postMessage('vvc-fullscreen-on', '*');
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
