import {Injectable, NgZone} from '@angular/core';
import {WindowRef} from './window.service';
import {Store} from '@ngrx/store';
import {InteractionContext} from '@vivocha/client-visitor-core/dist/widget';
import {TranslateService} from '@ngx-translate/core';

import * as fromStore from '../store';

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
    private store: Store<fromStore.AppState>,
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
  dispatchContext(context){
    this.ts.getTranslation(context.language).toPromise().then(
      result => {
        this.ts.use(context.language);
        this.store.dispatch(new fromStore.LoadContextSuccess({
          loaded: true,
          isMobile: this.isMobile,
          busId: this.busId,
          acct: this.acct,
          world: this.world,
          variables: context.campaign.channels.web.interaction.variables,
          ...context
        }));
        //this.store.dispatch(new fromStore.WidgetLoaded());
      }
    );
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
  ready(){
    return this.store.select(fromStore.getContext);
  }
}
