import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import { WidgetState } from '../store/models.interface';
import {AppState, getWidgetState} from '../store/reducers/main.reducer';
import {LoadContextSuccess} from '../store/actions/context.actions';
import {
  WidgetClosedByAgent,
  WidgetClosedByVisitor,
  WidgetInitContext,
  WidgetInitProtocol,
  WidgetSetAgent,
  WidgetInitChat,
  WidgetInitializeMultimedia,
  WidgetShowClosePanel,
  WidgetToggleEmoji,
  WidgetShowUploadPanel,
  WidgetIsWriting,
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
  WidgetShowChatOnFullScreen
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
    this.store.dispatch(new WidgetInitChat(media));
  }
  initializeContext(context){
    this.store.dispatch(new WidgetInitContext(context));
    this.store.dispatch(new LoadContextSuccess(context));
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
      initialOffer: conf.initialOffer
    }));
    /*
    const varsObj = this.flatObj('var',context.variables);
    varsObj['requestedMedia'] = context.requestedMedia;
    varsObj['canStartAudio'] = context.media.voice === 'both' || context.media.voice === 'visitor';
    varsObj['canStartVideo'] = context.media.video === 'both' || context.media.video === 'visitor';
    this.extendAndDispatch(this.currentState, {
      ...varsObj,
      isMobile: context.isMobile,
      hasSurvey: !!context.survey,
      isLoading: false,
      isInQueue: true,

      canRemoveApp: true,
      canMinimize: true,
      canMaximize: false,
      showSendButton: true,

      queue_message: 'STRINGS.QUEUE.CONNECTING',
      voice_connected: 'STRINGS.VOICE.WELCOME_MESSAGE',
      lastAction: 'initializeUi'
    });
    */
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
  }
  setOfferAccepted(){
    this.store.dispatch(new WidgetOfferAccepted());
  }
  setAgent(agent){
    this.store.dispatch(new WidgetSetAgent(agent));
    this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
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
  setDataCollectionCompleted(opt){
    this.store.dispatch(new DataCollectionCompleted(opt))
  }
  setDataCollectionPanel(show: boolean, topBarTitle: string){
    /*
    this.extendAndDispatch(this.currentState, {
      isLoading: false,
      isInQueue: false,
      isChatVisible: false,
      isMediaVisible: false,
      showDataCollectionPanel: show,
      topbar_subtitle: topBarTitle,
      lastAction: show ? 'showDataCollectionPanel' : 'hideDataCollectionPanel'
    });
    */
  }
  setFullScreenChat(show){
    this.store.dispatch(new WidgetShowChatOnFullScreen(show));
    this.store.dispatch(new WidgetMarkAsRead());
    /*
    this.extendAndDispatch(this.currentState, {
      showChatOnFullScreen: show,
      isChatVisible: show,
      not_read: 0
    });
    */
  }
  setFullScreen(){
    this.store.dispatch(new WidgetSetFullScreen());
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: true,
      showChatOnFullScreen: false
    });
    */
  }
  setHangUpState(){
    this.store.dispatch(new WidgetSetNormal());
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: false,
      showChatOnFullScreen: false
    });
    */
  }
  setNormalScreen(){
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetShowChatOnFullScreen(false));
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: false,
      showChatOnFullScreen: false
    });
    */
  }
  setIncomingMedia(media){
    this.store.dispatch(new WidgetIncomingMedia(media));
    /*
    this.extendAndDispatch(this.currentState, {
      media_incoming: true,
      media_is_minimized: false,
      media_incoming_message: 'STRINGS.MEDIA.INCOMING_' + media.toUpperCase(),
      isChatVisible: false,
      isMediaVisible: true
    });
    */
  }
  setInTransit(transit){
    /*
    this.extendAndDispatch(this.currentState, {
      in_transit: transit
    });
    */
  }
  setIsOffering(media){
    this.store.dispatch(new WidgetIsOffering(media));
  }
  setIsWriting(isWriting: boolean){
    this.store.dispatch(new WidgetIsWriting(isWriting));
    /*
    this.extendAndDispatch(this.currentState, {
      isWriting: isWriting,

      lastAction: isWriting ? 'setIsWriting' : 'removeIsWriting'
    });
    */
  }
  setMediaOffer(offer){
    this.store.dispatch(new WidgetMediaOffer(offer));
  }
  setMediaState(media) {
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
  setTopBarWithAgentInfo(agent){
    this.store.dispatch(new WidgetSetTopBar({title: agent.nick, subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED', avatar: agent.avatar}));
  }
  setSurveyCompleted(){
    /*
    this.extendAndDispatch(this.currentState, {
      surveyCompleted : true
    })
    */
  }
  setSurveyPanel(){
    /*
    this.extendAndDispatch(this.currentState, {
      showSurveyPanel: true,
      isSendAreaVisible: false,
      isChatVisible: false,
      isMediaVisible: false,

      topbar_title: 'STRINGS.SURVEY.TITLE',
      topbar_subtitle: 'STRINGS.SURVEY.SUBTITLE'
    })
    */
  }
  setUploadPanel(show: boolean){
    this.store.dispatch(new WidgetShowUploadPanel(show));
    /*
    this.extendAndDispatch(this.currentState, {
      showUploadPanel: show,
      isSendAreaVisible: !show,
      lastAction: show ? 'showUploadPanel' : 'hideUploadPanel'
    });
    */
  }
  setUploading(){
    this.store.dispatch(new WidgetIsUploading());
    /*
    this.extendAndDispatch(this.currentState, {
      isUploading: true
    });
    */
  }
  setUploaded(){
    this.store.dispatch(new WidgetUploadCompleted())
    /*
    this.extendAndDispatch(this.currentState, {
      isUploading: false,
      showUploadPanel: false,
      isSendAreaVisible: true
    });
    */
  }
  setVoiceAccepted(){
    /*
    this.extendAndDispatch(this.currentState, {
      media_incoming: false
    });
    */
  }
  toggleEmojiPanel(){
    this.store.dispatch(new WidgetToggleEmoji());
  }
}