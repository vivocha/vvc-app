import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import { WidgetState } from '../store/models.interface';
import {AppState, getWidgetState} from '../store/reducers/main.reducer';
import {LoadContextSuccess} from '../store/actions/context.actions';
import {
  WidgetClosedByAgent,
  WidgetClosedByVisitor,
  WidgetContactCreationFailed,
  WidgetInitContext,
  WidgetInitProtocol,
  WidgetSetAgent,
  WidgetInitChat,
  WidgetInitializeMultimedia,
  WidgetShowClosePanel,
  WidgetToggleEmoji,
  WidgetShowUploadPanel,
  WidgetIsWriting,
  WidgetSetAutoChat,
  WidgetSetMinimized,
  WidgetSetNormal,
  WidgetMarkAsRead,
  WidgetNewMessage,
  WidgetIsUploading,
  WidgetUploadCompleted,
  WidgetSetTopBar,
  WidgetMediaChange,
  WidgetMediaOffer,
  WidgetIncomingMedia,
  WidgetOfferRejected,
  WidgetMuteSuccess,
  WidgetMuteInProgress,
  WidgetSetMinimizedMedia,
  WidgetIsOffering,
  WidgetOfferAccepted,
  WidgetSetFullScreen,
  WidgetShowChatOnFullScreen,
  WidgetShowQueuePanel,
  WidgetSetVideoTransit,
  WidgetSetError,
  WidgetSetDialogUi, WidgetWebleadSent, WidgetUiReady, WidgetHideQueueForChat, WidgetSetCbnMode, WidgetSetCbnState
} from '../store/actions/widget.actions';
import {DataCollectionSelected} from '../store/actions/dataCollection.actions';

@Injectable()
export class VvcUiService {

  currentState: WidgetState;
  constructor(private store: Store<AppState>) {
    this.store.select(getWidgetState).subscribe( state => {
      this.currentState = state;
    });
  }
  setCbnMode() {
    this.store.dispatch(new WidgetSetCbnMode(true));
  }
  hideChat() {
    this.store.dispatch(new WidgetSetMinimizedMedia(false));
  }
  hideQueueForChat() {
    this.store.dispatch(new WidgetHideQueueForChat());
  }
  initializeChat(media) {
    this.store.dispatch(new WidgetInitChat(media));
  }
  initializeContext(context) {
    this.store.dispatch(new LoadContextSuccess(context));
    this.store.dispatch(new WidgetInitContext(context));

  }
  initializeMedia(media) {
    this.initializeChat(media);
    this.initializeMultimedia(media);
    this.setMediaState(media);
  }
  initializeMultimedia(media) {
    this.store.dispatch(new WidgetInitializeMultimedia(media));
  }
  initializeProtocol(context, conf) {
    this.store.dispatch(new WidgetInitProtocol({
      mediaPreset: context.mediaPreset,
      canStartAudio: context.media.voice === 'both' || context.media.voice === 'visitor',
      canStartVideo: context.media.video === 'both' || context.media.video === 'visitor',
      initialOffer: conf.initialOffer,
      contactStarted: true
    }));
  }
  loadDataCollections(dcList) {
    // this.store.dispatch(new DataCollectionLoaded(dcList));
  }
  newMessageReceived() {
    this.store.dispatch(new WidgetNewMessage());
  }
  resetTopBar() {
    this.store.dispatch(new WidgetSetTopBar({title: '', subtitle: '', avatar: ''}));
  }
  selectDataCollection(dc) {
    this.store.dispatch(new DataCollectionSelected(dc));
    this.store.dispatch(new WidgetSetTopBar({title: 'STRINGS.QUEUE.TOPBAR.TITLE', subtitle: dc.labelId, avatar: ''}));
  }
  setOfferAccepted() {
    this.store.dispatch(new WidgetOfferAccepted());
  }
  setAgent(agent) {
    this.store.dispatch(new WidgetSetAgent(agent));
    // this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
  }
  setAutoChat() {
    this.store.dispatch(new WidgetSetAutoChat());
  }
  setCbnState(state) {
    this.store.dispatch(new WidgetSetCbnState(state));
  }
  setClosedByAgent() {
    this.store.dispatch(new WidgetClosedByAgent());
  }
  setClosedByVisitor() {
    this.store.dispatch(new WidgetClosedByVisitor());
  }
  setCloseModal(show: boolean) {
    this.store.dispatch(new WidgetShowClosePanel(show));
  }
  setCreationFailed() {
    this.store.dispatch(new WidgetContactCreationFailed());
  }
  setDataCollectionCompleted(opt, dcType: string) {
    // this.store.dispatch(new DataCollectionCompleted(opt))
  }
  setDialogUi() {
    this.store.dispatch(new WidgetSetDialogUi());
  }
  setDissuasion() {
    this.store.dispatch(new WidgetSetError());
  }
  setFullScreenChat(show) {
    this.store.dispatch(new WidgetShowChatOnFullScreen(show));
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setFullScreen() {
    this.store.dispatch(new WidgetSetFullScreen());
  }
  setHangUpState() {
    this.store.dispatch(new WidgetSetNormal());
  }
  setNormalScreen() {
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetShowChatOnFullScreen(false));
  }
  setIncomingMedia(media) {
    this.store.dispatch(new WidgetIncomingMedia(media));
  }
  setInTransit(transit) {
    this.store.dispatch(new WidgetSetVideoTransit(transit));
  }
  setIsOffering(media) {
    this.store.dispatch(new WidgetIsOffering(media));
  }
  setIsWriting(isWriting: boolean) {
    this.store.dispatch(new WidgetIsWriting(isWriting));
  }
  setMediaOffer(offer) {
    this.store.dispatch(new WidgetMediaOffer(offer));
  }
  setMediaState(media) {
    this.store.dispatch(new WidgetMediaChange(media));
  }
  setMinimizedState() {
    this.store.dispatch(new WidgetSetMinimized());
  }
  setMinimizedMedia() {
    this.store.dispatch(new WidgetSetMinimizedMedia(true));
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setMuted(muted) {
    this.store.dispatch(new WidgetMuteSuccess(muted));
  }
  setMuteInProgress() {
    this.store.dispatch(new WidgetMuteInProgress());
  }
  setNormalState() {
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setOfferRejected() {
    this.store.dispatch(new WidgetOfferRejected());
  }
  setTopBar(topBarObject) {
    this.store.dispatch(new WidgetSetTopBar({title: topBarObject.title, subtitle: topBarObject.subtitle}));
  }
  setTopBarAvatar(avatarUrl: string) {
    this.store.dispatch(new WidgetSetTopBar({avatar: avatarUrl}));
  }
  setTopBarSubtitle(subtitle: string) {
    this.store.dispatch(new WidgetSetTopBar({subtitle: subtitle}));
  }
  setTopBarTitle(title: string) {
    this.store.dispatch(new WidgetSetTopBar({title: title}));
  }
  setTopBarWithAvatar(avatarUrl: string, title: string, subtitle: string) {
    this.store.dispatch(new WidgetSetTopBar({title: title, subtitle: subtitle, avatar: avatarUrl}));
  }
  setTopBarWithAgentInfo(agent) {
    this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
  }
  setSurveyPanel() {
    this.store.dispatch(new WidgetSetTopBar({title: 'STRINGS.SURVEY.TITLE', subtitle: 'STRINGS.SURVEY.SUBTITLE'}));
  }
  setUiReady() {
    this.store.dispatch(new WidgetUiReady());
  }
  setUploadPanel(show: boolean) {
    this.store.dispatch(new WidgetShowUploadPanel(show));
  }
  setUploading() {
    this.store.dispatch(new WidgetIsUploading());
  }
  setUploaded() {
    this.store.dispatch(new WidgetUploadCompleted());
  }
  setWebleadSent() {
    this.store.dispatch(new WidgetWebleadSent());
  }
  showQueuePanel() {
    this.store.dispatch(new WidgetShowQueuePanel());
  }
  toggleEmojiPanel() {
    this.store.dispatch(new WidgetToggleEmoji());
  }
}
