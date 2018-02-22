import {Injectable, NgZone} from '@angular/core';
import {WindowRef} from './window.service';
import {Store} from '@ngrx/store';
import * as fromStore from './store';

@Injectable()
export class VvcInteractionService {

  private acct;
  private busId;
  private world;
  private isMobile = false;

  private window;
  private vivocha;

  constructor(
    private store: Store<fromStore.AppState>,
    private wref: WindowRef,
    private zone: NgZone,
  ){
    this.window = wref.nativeWindow;
  }
  init(){
    this.parseIframeUrl();
    this.checkForVivocha();
  }
  checkForVivocha(){
    if (this.window.vivocha && this.window.vivocha.ready) {
      this.window.vivocha.ready(this.busId).then(() => {
        this.window.vivocha.pageRequest('getContext').then((context: any) => {
          this.vivocha = this.window.vivocha;
          this.isMobile = this.window.vivocha.isMobile();
          this.dispatchContext(context);
        });
      });
    } else {
      setTimeout( () => this.checkForVivocha(), 200);
    }
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
  dispatchContext(context){
    //this.zone.run( () => {
      this.store.dispatch(new fromStore.LoadContextSuccess({
        loaded: true,
        isMobile: this.isMobile,
        busId: this.busId,
        acct: this.acct,
        world: this.world,
        ...context
      }));
    //});
  }
}