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
  WidgetSetError
} from '../store/actions/widget.actions';
import {DataCollectionSelected, DataCollectionCompleted, DataCollectionLoaded} from '../store/actions/dataCollection.actions';

@Injectable()
export class VvcUiService {

  currentState: WidgetState;
  constructor(private store: Store<AppState>){
    this.store.select(getWidgetState).subscribe( state => {
      this.currentState = state
    });
  }
  hideChat(){
    this.store.dispatch(new WidgetSetMinimizedMedia(false));
  }
  initializeChat(media){
    console.log('initializing chat', media);
    this.store.dispatch(new WidgetInitChat(media));
  }
  initializeContext(context){
    this.store.dispatch(new LoadContextSuccess(context));
    this.store.dispatch(new WidgetInitContext(context));

  }
  initializeMedia(media){
    this.initializeChat(media);
    this.initializeMultimedia(media);
    this.setMediaState(media);
  }
  initializeMultimedia(media){
    this.store.dispatch(new WidgetInitializeMultimedia(media));
  }
  initializeProtocol(context, conf){
    this.store.dispatch(new WidgetInitProtocol({
      requestedMedia: context.requestedMedia,
      canStartAudio: context.media.voice === 'both' || context.media.voice === 'visitor',
      canStartVideo: context.media.video === 'both' || context.media.video === 'visitor',
      initialOffer: conf.initialOffer,
      contactStarted: true
    }));
  }
  loadDataCollections(dcList){
    this.store.dispatch(new DataCollectionLoaded(dcList));
  }
  newMessageReceived(){
    this.store.dispatch(new WidgetNewMessage());
  }
  resetTopBar(){
    this.store.dispatch(new WidgetSetTopBar({title: '', subtitle: '', avatar: ''}));
  }
  selectDataCollection(dc){
    this.store.dispatch(new DataCollectionSelected(dc));
    this.store.dispatch(new WidgetSetTopBar({title: 'STRINGS.QUEUE.TOPBAR.TITLE', subtitle: dc.labelId, avatar: ''}));
  }
  setOfferAccepted(){
    this.store.dispatch(new WidgetOfferAccepted());
  }
  setAgent(agent){
    this.store.dispatch(new WidgetSetAgent(agent));
    //this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
  }
  setAutoChat(){
    this.store.dispatch(new WidgetSetAutoChat());
    //this.store.dispatch(new WidgetSetTopBar({title: 'AutoChatNick', subtitle: 'AutoChatConnected'}));
  }
  setClosedByAgent(){
    this.store.dispatch(new WidgetClosedByAgent());
  }
  setClosedByVisitor(){
    this.store.dispatch(new WidgetClosedByVisitor());
  }
  setCloseModal(show: boolean){
    this.store.dispatch(new WidgetShowClosePanel(show));
  }
  setCreationFailed(){
    this.store.dispatch(new WidgetContactCreationFailed());
  }
  setDataCollectionCompleted(opt){
    this.store.dispatch(new DataCollectionCompleted(opt))
  }
  setDissuasion(){
    this.store.dispatch(new WidgetSetError());
  }
  setFullScreenChat(show){
    this.store.dispatch(new WidgetShowChatOnFullScreen(show));
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setFullScreen(){
    this.store.dispatch(new WidgetSetFullScreen());
  }
  setHangUpState(){
    this.store.dispatch(new WidgetSetNormal());
  }
  setNormalScreen(){
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetShowChatOnFullScreen(false));
  }
  setIncomingMedia(media){
    this.store.dispatch(new WidgetIncomingMedia(media));
  }
  setInTransit(transit){
    this.store.dispatch(new WidgetSetVideoTransit(transit));
  }
  setIsOffering(media){
    this.store.dispatch(new WidgetIsOffering(media));
  }
  setIsWriting(isWriting: boolean){
    this.store.dispatch(new WidgetIsWriting(isWriting));
  }
  setMediaOffer(offer){
    this.store.dispatch(new WidgetMediaOffer(offer));
  }
  setMediaState(media) {
    console.log('setting media state', media);
    this.store.dispatch(new WidgetMediaChange(media));
  }
  setMinimizedState(){
    this.store.dispatch(new WidgetSetMinimized());
  }
  setMinimizedMedia(){
    this.store.dispatch(new WidgetSetMinimizedMedia(true));
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setMuted(muted){
    this.store.dispatch(new WidgetMuteSuccess(muted));
  }
  setMuteInProgress(){
    this.store.dispatch(new WidgetMuteInProgress());
  }
  setNormalState(){
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetMarkAsRead());
  }
  setOfferRejected(){
    this.store.dispatch(new WidgetOfferRejected());
  }
  setTopBar(topBarObject){
    this.store.dispatch(new WidgetSetTopBar({title: topBarObject.title, subtitle: topBarObject.subtitle}));
  }
  setTopBarWithAgentInfo(agent){
    this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
  }
  setSurveyPanel(){
    this.store.dispatch(new WidgetSetTopBar({title: 'STRINGS.SURVEY.TITLE', subtitle: 'STRINGS.SURVEY.SUBTITLE'}));
  }
  setUploadPanel(show: boolean){
    this.store.dispatch(new WidgetShowUploadPanel(show));
  }
  setUploading(){
    this.store.dispatch(new WidgetIsUploading());
  }
  setUploaded(){
    this.store.dispatch(new WidgetUploadCompleted())
  }
  showQueuePanel(){
    this.store.dispatch(new WidgetShowQueuePanel());
  }
  toggleEmojiPanel(){
    this.store.dispatch(new WidgetToggleEmoji());
  }
}