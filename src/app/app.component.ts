import {Component, OnInit} from '@angular/core';
import {VvcService} from './core/vvc.service';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState, DataCollectionState, WidgetState, VvcMediaState, VvcMediaOffer} from './core/core.interfaces';
import {VvcContactService} from "./core/contact.service";


@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public defaultLang = 'en';
  private globalState: WidgetState = { state : 'LOADING' };
  private mediaState: VvcMediaState;
  private mediaOffer: VvcMediaOffer;
  private dcs: DataCollectionState;

  private agent$: Observable<{}>;
  private messages$: Observable<{}>;
  private contact;
  private lastOfferDiff;
  private incomingType: string;
  private isNegotiating = false;
  private mediaOnNegotiation;
  private negotiationMessage;

  constructor(private vvc: VvcService,
              private cservice: VvcContactService,
              private translate: TranslateService,
              private store: Store<AppState>) {
    this.bindStores();
  }
  acceptIncomingRequest(msg) {
      if (msg.info_type === 'VIDEO' || msg.info_type === 'VOICE') {
          this.isNegotiating = true;
          this.mediaOnNegotiation = msg.info_type;
          this.negotiationMessage = msg;
          this.store.dispatch({
              type: 'UPDATE_BY_REF',
              payload: {
                  ref: msg.ref,
                  type: 'MEDIA-INFO',
                  state: 'loading'
              }
          });
          this.cservice.upgradeMedia(this.lastOfferDiff);
      }
      /*
          console.log('connected?')
          this.store.dispatch({
              type: 'UPDATE_BY_REF',
              payload: {
                  ref: msgRef,
                  type: 'MEDIA-INFO',
                  state: 'connected'
              }
          });
          */

      console.log('msgRef accept', msg.ref);

  }
  bindStores() {
    this.store.subscribe( state => {
      this.globalState = state.widgetState;
      this.mediaState  = state.mediaState;
      this.mediaOffer  = state.mediaOffer;
      this.dcs         = <DataCollectionState> state.dataCollections;

      this.ckeckForNegotiationEnd();
      this.checkForIncomingRequest();
      this.listenForDowngrades();
      this.getTopBarState();

      console.log('mediaState', state.mediaState);
      console.log('mediaOffer', state.mediaOffer);
    });
    this.messages$ = this.store.select('chatMessages');
    this.agent$    = this.store.select('agent');
  }
  isLoading() {
    return this.globalState.state === 'LOADING';
  }
  checkForIncomingRequest() {
      if (
          this.mediaOffer &&
          this.mediaOffer.diff &&
          this.mediaOffer.diff['added']
      ) {
          const added = this.mediaOffer.diff['added'];
          this.lastOfferDiff = added;
          let m;
          if (added.Voice && added.Video) {
              this.incomingType = 'video';
              m = 'VIDEO';
          }
          else if (added.Voice) {
              this.incomingType = 'voice';
              m = 'VOICE';
          }
          else if (added.Video) {
              this.incomingType = 'video';
              m = 'VIDEO';
          }
          this.store.dispatch({
              type: 'ADD_TEXT',
              payload: {
                  ref: new Date().getTime(),
                  type: 'MEDIA-INFO',
                  info_type: m,
                  offer: added,
                  state: 'request'
              }
          });
      }
  }
  ckeckForNegotiationEnd() {
    if (this.isNegotiating) {
        switch (this.mediaOnNegotiation) {
            case 'VOICE':
            case 'VIDEO':
                const m = (this.mediaOnNegotiation === 'VIDEO') ? 'Video' : 'Voice';
                if (this.mediaState &&
                    this.mediaState[m] &&
                    this.mediaState[m].data &&
                    this.mediaState[m].data.tx_stream &&
                    this.mediaState[m].data.rx_stream) {
                    // TODO: check for optional stream
                    this.isNegotiating = false;
                    this.mediaOnNegotiation = null;
                    this.store.dispatch({
                        type: 'UPDATE_BY_REF',
                        payload: {
                            ref: this.negotiationMessage.ref,
                            type: 'MEDIA-INFO',
                            state: 'connected'
                        }
                    });
                }
                break;
        }
    }
  }
  denyIncomingRequest(msg) {
      console.log('msgRef deny', msg.ref);
      this.cservice.denyOffer();
      this.store.dispatch({
          type: 'UPDATE_BY_REF',
          payload: {
              ref: msg.ref,
              type: 'MEDIA-INFO',
              state: 'rejected'
          }
      });
  }
  listenForDowngrades() {

  }
  getTopBarState() {

  }
  sendChatMessage(msg) {
    this.contact.sendText(msg.text);
  }

  ngOnInit() {
    this.vvc.ready().subscribe( conf => {

      if (!conf.lang) {
        conf.lang = this.defaultLang;
      }
      this.translate.getTranslation( conf.lang ).subscribe( () => {
        this.vvc.initContact({ serv_id: conf.serv_id, type: 'chat', nick: 'Marcolino'}).then( contact => {
          this.contact = contact;
          console.log('contact packed');
        });
      });
      this.translate.setDefaultLang(this.defaultLang);
      this.translate.use(conf.lang);

    });
    this.vvc.init();
  }
}
