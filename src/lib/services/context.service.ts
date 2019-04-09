import {Injectable, NgZone} from '@angular/core';
import {WindowRef} from './window.service';
import {VvcUiService} from './ui.service';
import {select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';

import {AppState} from '../store/reducers/main.reducer';
import {getContextState} from '../store/reducers/main.reducer';
import {Observable} from 'rxjs';
import {ContextState} from '../store/models.interface';

@Injectable()
export class VvcContextService {

  private acct;
  private busId;
  private world;
  private isMobile = false;
  private window;
  private vivocha;
  private context: any;

  constructor(
    private store: Store<AppState>,
    private uiService: VvcUiService,
    private wref: WindowRef,
    private ts: TranslateService,
    private zone: NgZone) {

    this.window = wref.nativeWindow;
    this.parseIframeUrl();
    this.checkForVivocha();
  }
  async checkForVivocha() {
    if (this.window.vivocha && this.window.vivocha.ready) {
      await this.window.vivocha.ready(this.busId);
      const context = await this.window.vivocha.pageRequest('getContext');
      const extraDataCollection = await this.window.vivocha.pageRequest('getInteractionModeDataCollectionId', context.mediaPreset);
      if (extraDataCollection) {
        if (!context.dataCollectionIds) {
          context.dataCollectionIds = [];
        }
        context.dataCollectionIds.push(extraDataCollection);
      }
      this.zone.run( () => {
        this.vivocha = this.window.vivocha;
        this.isMobile = this.window.vivocha.isMobile();
        this.context = context;
        this.dispatchContext(context);
      });
    } else {
      setTimeout( () => this.checkForVivocha(), 200);
    }
  }
  dispatchContext(context) {
    this.ts.use(context.language);
    this.ts.getTranslation(context.language).toPromise().then(
      result => {
          this.uiService.initializeContext({
            ...context,
            loaded: true,
            translationLoaded: true,
            isMobile: this.isMobile,
            busId: this.busId,
            acct: this.acct,
            world: this.world,
            variables: this.window.VVC_VAR_ASSETS || {}
          });
      });
  }
  getVivocha() {
    return this.vivocha;
  }
  getContext() {
    return this.context;
  }
  parseIframeUrl() {
    const hash = this.window.location.hash;
    if (hash.indexOf(';') !== -1) {
      const hashParts = this.window.location.hash.substr(2).split(';');
      this.busId = hashParts[0];
      this.acct  = hashParts[1];
      this.world = hashParts[2];
    }
  }
  ready(): Observable<ContextState> {
    return this.store.pipe(select(getContextState));
  }
}
