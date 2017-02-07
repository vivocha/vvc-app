import {Component, OnInit} from '@angular/core';
import {VvcService} from './core/vvc.service';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState, DataCollectionState, WidgetState, VvcMediaState, VvcMediaOffer} from './core/core.interfaces';


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

  constructor(private vvc: VvcService,
              private translate: TranslateService,
              private store: Store<AppState>) {
    this.bindStores();
  }
  bindStores() {
    this.store.subscribe( state => {
      this.globalState = state.widgetState;
      this.mediaState  = state.mediaState;
      this.mediaOffer  = state.mediaOffer;
      this.dcs         = <DataCollectionState> state.dataCollections;

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
                  status: 'DELIVERED',
                  text: this.translate.instant('CHAT.INCOMING_REQUEST_' + m),
                  type: 'MEDIA-INFO',
                  info_type: m
              }
          });
      }
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
