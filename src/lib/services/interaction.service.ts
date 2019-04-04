import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getUiState } from '../store/selectors/widget.selectors';
import { AppState, getEventsState } from '../store/reducers/main.reducer';
import { VvcContextService } from './context.service';
import { ContextState, Dimension, EventsState, LeftScrollOffset, UiState } from '../store/models.interface';
import { VvcContactWrap } from './contact-wrap.service';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent } from 'rxjs';
import { skipUntil, takeUntil, repeat } from 'rxjs/operators';
import { NewEvent } from '../store/actions/events.actions';

@Injectable()
export class VvcInteractionService {

  /**
   * It will contain the Interaction App position if it's dragged
   */
  dragged: any | boolean = false;

  /**
   * Local reference that indicates that the #setFullScreen method was called
   */
  isFullScreen: boolean = false;

  private vivocha;
  private context: ContextState;

  agentRequestCallback;

  constructor(
    private store: Store<AppState>,
    private contextService: VvcContextService,
    private contactService: VvcContactWrap,
    private translateService: TranslateService
  ) {
  }

  /**** PUBLIC METHOD ****/
  acceptAgentRequest(requestId) {
    this.contactService.acceptAgentRequest(requestId);
  }
  acceptOffer() {
    this.contactService.acceptOffer();
  }
  addChatToFullScreen(show) {
    this.contactService.addChatToFullScreen(show);
  }
  askForVideoUpgrade() {
    this.contactService.askForUpgrade('Video');
  }
  askForVoiceUpgrade() {
    this.contactService.askForUpgrade('Voice');
  }
  changeLang(lang) {
    this.translateService.use(lang);
  }
  closeApp() {
    this.track('interaction service close app');
    this.contactService.closeApp();
  }
  closeContact(dim?: Dimension) {
    this.track('interaction service close contact');
    this.contactService.closeContact(dim);
  }
  closeUploadPanel() {
    this.contactService.closeUploadPanel();
  }
  dismissCloseModal() {
    this.track('dismiss close modal');
    this.contactService.showCloseModal(false);
  }
  events(): Observable<EventsState> {
    return this.store.pipe(select(getEventsState));
  }
  getState(): Observable<UiState> {
    return this.store.pipe(select(getUiState));
  }
  getVariables() {
    const context: any = this.contextService.getContext();
    return context.variables || {};
  }
  hangUp(dim: Dimension) {
    this.contactService.hangUp(dim);
  }
  hideChat() {
    this.contactService.hideChat();
  }
  init() {
    const contextReady = this.contextService.ready();
    contextReady.subscribe((context: ContextState) => {
      if (context.loaded) {
        this.vivocha = this.contextService.getVivocha();
        this.context = context;
        this.registerChangeLangService();
        this.contactService.initializeContact(this.vivocha, this.context);
        this.listenForDrag();
      }
    });
    return contextReady.pipe(filter(context => context.loaded));
  }
  listenForDrag() {

    this.dragged = false;
    const context: any = this.contextService.getContext();
    const variables: any = context.variables || {};
    const vivocha: any = this.contextService.getVivocha();
    const dragEnabledVar: boolean = variables['dragEnabled'];
    const draggableSelectorVar: string = variables['draggableSelector'];
    const node: HTMLElement = document.querySelector(draggableSelectorVar);
    const canUseDrag: boolean = dragEnabledVar && !!node && !context.isMobile;

    if (canUseDrag) {
      const mouseDown$: Observable<MouseEvent> = fromEvent(node, 'mousedown') as Observable<MouseEvent>;
      const mouseMove$: Observable<MouseEvent> = fromEvent(document, 'mousemove') as Observable<MouseEvent>;
      const mouseUp$: Observable<MouseEvent> = fromEvent(document, 'mouseup') as Observable<MouseEvent>;

      const drag$ = mouseMove$.pipe(
        skipUntil(mouseDown$),
        takeUntil(mouseUp$),
        repeat()
      );

      console.log('drag listeners setup okay');

      drag$.subscribe(
        async (evt) => {
          const windowSizePx = await vivocha.pageRequest('getWindowSize');
          const windowSize = {
            width: parseInt(windowSizePx.width.replace('px', ''), 10),
            height: parseInt(windowSizePx.height.replace('px', ''), 10)
          };
          const boundingClientRect = await vivocha.pageRequest('getBoundingClientRect');

          let moveX = evt['movementX'];
          let moveY = evt['movementY'];

          if (variables['dragLimit']) {
            const offset = {
              left: variables['dragOffsetLeft'] || 0,
              right: variables['dragOffsetRight'] || 0,
              top: variables['dragOffsetTop'] || 0,
              bottom: variables['dragOffsetBottom'] || 0
            };
            const max = {
              left: -boundingClientRect.left - offset.left,
              right: windowSize.width - boundingClientRect.right + offset.right,
              top: -boundingClientRect.top - offset.top,
              bottom: windowSize.height - boundingClientRect.bottom + offset.bottom
            };

            if (moveX >= 0 && moveX > max.right) moveX = max.right;
            if (moveX < 0 && moveX < max.left) moveX = max.left;
            if (moveY >= 0 && moveY > max.bottom) moveY = max.bottom;
            if (moveY < 0 && moveY < max.top) moveY = max.top;
          }

          await vivocha.pageRequest('move', {
            top: moveY,
            left: moveX
          });

          // this.dragged = await vivocha.pageRequest('getBoundingClientRect');
          this.dragged = await vivocha.pageRequest('getPosition');
        },
        // TODO this methods are never called
        err => {
          console.error('drag$', err);
        },
        async () => {
          console.log('drag$ complete');
          this.store.dispatch(new NewEvent({
            type: 'dragComplete',
            data: await vivocha.pageRequest('getBoundingClientRect')
          }));
        }
      );
    } else {
      console.log('drag not enabled. dragEnabledVar:', dragEnabledVar, 'draggableSelectorVar:', draggableSelectorVar, 'node:', node, 'isMobile:', context.isMobile);
    }
  }
  minimize(minimize: boolean, isFullScreen?: boolean, positionObject?: any, sizeObject?: any) {
    this.contactService.minimize(minimize, isFullScreen, positionObject, sizeObject);
  }
  maximizeWidget(isFullScreen: boolean, dim: Dimension) {
    if (!isFullScreen) {
      const variables = this.getVariables();
      if (variables['restorePositionAfterDrag'] && this.dragged) {
        dim.position = 'fixed';
        dim.top = this.dragged.top;
        dim.left = this.dragged.left;
        dim.bottom = this.dragged.bottom;
        dim.right = this.dragged.right;
      }
    }
    this.contactService.maximizeWidget(isFullScreen, dim);
    if (!isFullScreen) setTimeout(() => this.listenForDrag(), 1000);
  }
  minimizeMedia() {
    this.contactService.minimizeMedia();
  }
  minimizeWidget(dim: Dimension) {
    this.contactService.minimizeWidget(dim);
  }
  muteToggle(muted) {
    this.contactService.muteToggle(muted);
  }
  openAttachment(url, click?: boolean) {
    this.contactService.openAttachment(url, click);
  }
  processQuickReply(reply) {
    this.track('process quick reply');

    this.contactService.processQuickReply(reply);
  }
  private registerChangeLangService() {
    this.vivocha.bus.registerService('vvcApp', {
      changeLang: (lang) => this.changeLang(lang),
      closeContact: (dim?: Dimension) => this.closeContact(dim),
      closeAndRemove: (dim?: Dimension) => {
        this.closeContact(dim);
        this.closeApp();
      }
    });
  }
  registerCustomAction(action): Observable<any> {
    return this.contactService.registerCustomAction(action);
  }
  rejectAgentRequest(requestId) {
    this.contactService.rejectAgentRequest(requestId);
  }
  rejectOffer() {
    this.contactService.rejectOffer();
  }
  sendAttachment(upload) {
    this.contactService.sendAttachment(upload);
  }
  sendIsWriting() {
    this.contactService.sendIsWriting();
  }
  sendPostBack(action) {
    this.track('visitor send post back');
    this.contactService.sendPostBack(action);
  }
  sendRequest(requestId, requestData) {
    this.track('visitor send request');
    return this.contactService.sendRequest(requestId, requestData);
  }
  sendText(text) {
    this.track('visitor send text');
    this.contactService.sendText(text);
  }
  setDimensions(dim) {
    this.contactService.setDimension(dim);
  }
  setFullScreen() {
    this.contactService.setFullScreen();
  }
  setNormalScreen() {
    const variables = this.getVariables();
    let dim: any = {};
    if (variables['restorePositionAfterDrag'] && this.dragged) {
      dim.position = 'fixed';
      dim.top = this.dragged.top;
      dim.left = this.dragged.left;
      dim.bottom = this.dragged.bottom;
      dim.right = this.dragged.right;
    }
    this.contactService.setNormalScreen(dim);
  }
  setTopBar(avatarUrl: string, title: string, subtitle: string) {
    this.contactService.setTopBar(avatarUrl, title, subtitle);
  }
  setTopBarAvatar(avatarUrl: string) {
    this.contactService.setTopBarAvatar(avatarUrl);
  }
  setTopBarSubtitle(subtitle: string) {
    this.contactService.setTopBarSubtitle(subtitle);
  }
  setTopBarTitle(title: string) {
    this.contactService.setTopBarTitle(title);
  }
  showCloseModal() {
    this.contactService.showCloseModal(true);
  }
  showUploadPanel() {
    this.contactService.showUploadPanel();
  }
  showSurvey() {
    this.contactService.showSurvey();
  }
  submitDataCollection(dc) {
    this.contactService.submitDataCollection(dc);
  }
  submitSurvey(dc) {
    this.contactService.submitSurvey(dc);
  }
  toggleCamera() {
    this.contactService.toggleCamera();
  }
  toggleEmojiPanel() {
    this.contactService.toggleEmojiPanel();
  }
  toggleVideo(show) {
    this.contactService.toggleVideo(show);
  }
  track(id: string, obj?: any) {
    this.contactService.track(id, obj);
  }
  updateLeftScrollOffset(o: LeftScrollOffset) {
    this.contactService.updateLeftScrollOffset(o);
  }
  upgradeCbnToChat() {
    this.contactService.upgradeCbnToChat();
  }
}
