import {Injectable, NgZone} from '@angular/core';
import {WindowRef} from './window.service';
import {VvcUiService} from './ui.service';
import {Store} from '@ngrx/store';
import {InteractionContext} from '@vivocha/client-visitor-core/dist/widget';
import {TranslateService} from '@ngx-translate/core';

import {AppState} from '../store/reducers/main.reducer';
import {getContextState} from '../store/reducers/main.reducer';
import {Observable} from 'rxjs/Observable';
import {ContextState} from '../store/models.interface';

@Injectable()
export class VvcContextService {

  private acct;
  private busId;
  private world;
  private isMobile = false;
  private window;
  private vivocha;
  private context: InteractionContext;

  constructor(
    private store: Store<AppState>,
    private uiService: VvcUiService,
    private wref: WindowRef,
    private ts: TranslateService,
    private zone: NgZone){

    this.window = wref.nativeWindow;
    this.parseIframeUrl();
    this.checkForVivocha();
  }
  checkForVivocha(){
    if (this.window.vivocha && this.window.vivocha.ready) {
      this.window.vivocha.ready(this.busId).then(() => {
        this.window.vivocha.pageRequest('getContext').then((context: any) => {
          this.zone.run( () => {
            this.vivocha = this.window.vivocha;
            this.isMobile = this.window.vivocha.isMobile();
            this.context = context;
            this.dispatchContext(context);
          });
        });
      });
    } else {
      setTimeout( () => this.checkForVivocha(), 200);
    }
  }
  closeApp(){
    this.vivocha.pageRequest('interactionClosed', 'close');
    this.vivocha.pageRequest('interactionClosed', 'destroy');
  }
  dispatchContext(context){
    this.ts.use(context.language);
    this.ts.getTranslation(context.language).toPromise().then(
      result => {
          this.uiService.initializeContext({
            loaded: true,
            translationLoaded: true,
            isMobile: this.isMobile,
            busId: this.busId,
            acct: this.acct,
            world: this.world,
            variables: context.campaign.channels.web.interaction.variables,
            ...context
          });
      });
  }
  getVivocha(){
    return this.vivocha;
  }
  parseIframeUrl(){
    const hash = this.window.location.hash;
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.busId = hashParts[0];
      this.acct  = hashParts[1];
      this.world = hashParts[2];
    }
  }
  ready():Observable<ContextState>{
    return this.store.select(getContextState);
  }
}