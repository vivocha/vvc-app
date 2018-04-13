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
  WidgetNewMessage
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
    /*
    this.extendAndDispatch(this.currentState, {
      isChatVisible: false,
      media_is_minimized: false,
      not_read: 0
    })
    */
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
    /*
    if (this.currentState.isMinimized || this.currentState.isChatVisible === false){
      this.extendAndDispatch(this.currentState, {
        not_read: this.currentState.not_read + 1,

        lastAction: 'newMessageReceived'
      });
    }*/
  }
  selectDataCollection(dc){
    this.store.dispatch(new DataCollectionSelected(dc));
  }
  setAgent(agent){
    this.store.dispatch(new WidgetSetAgent(agent))
    /*
    const agentProps = this.flatObj('agent', agent);
    this.extendAndDispatch(this.currentState, {
      ...agentProps,

      isInQueue: false,
      canRemoveApp: false,
      canMaximize: true,

      isChatVisible: this.currentState.requestedMedia === 'chat',
      isMediaVisible: this.currentState.requestedMedia === 'voice' || this.currentState.requestedMedia === 'video',
      isSendAreaDisabled: false,
      isSendAreaVisible: true,


      topbar_title: agent.nick,
      topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED',
      topbar_avatar: agent.avatar,

      lastAction: 'setAgent'
    });
    */
  }
  setClosedByAgent(){
    this.store.dispatch(new WidgetClosedByAgent());
    /*
    this.extendAndDispatch(this.currentState, {
      closedByAgent: true,
      isSendAreaVisible: false,
      canRemoveApp: true,
      isFullScreen: false,
      topbar_title: '',
      topbar_subtitle: '',
      topbar_avatar: '',

      lastAction: 'setClosedByAgent'

    })
    */
  }
  setClosedByVisitor(){
    this.store.dispatch(new WidgetClosedByVisitor());
    /*
    this.extendAndDispatch(this.currentState, {
      closedByVisitor: true,
      showCloseModal: false,
      isSendAreaVisible: false,
      canRemoveApp: true,
      isFullScreen: false,
      topbar_title: '',
      topbar_subtitle: '',
      topbar_avatar: '',

      lastAction: 'setClosedByVisitor'
    });
    */
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
    /*
    this.extendAndDispatch(this.currentState, {
      showChatOnFullScreen: show,
      isChatVisible: show,
      not_read: 0
    });
    */
  }
  setFullScreen(){
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: true,
      showChatOnFullScreen: false
    });
    */
  }
  setHangUpState(){
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: false,
      showChatOnFullScreen: false
    });
    */
  }
  setNormalScreen(){
    this.store.dispatch(new WidgetSetNormal());
    /*
    this.extendAndDispatch(this.currentState, {
      isFullScreen: false,
      showChatOnFullScreen: false
    });
    */
  }
  setIncomingMedia(media){
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
    /*
    const o = {
      isOffering: true,
      isMediaVisible: (media === 'Voice' || media === 'Video'),
      isChatVisible: !(media === 'Voice' || media === 'Video')
    };
    console.log('settingIsOffering', media, o);

    this.extendAndDispatch(this.currentState, o);
    */
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
  setMediaState(media) {

    /*
    const o = {};

    if (media.Chat) o['chat_tx'] = media.Chat.tx;
    if (media.Chat) o['chat_rx'] = media.Chat.rx;

    if (media.Voice) o['voice_tx'] = media.Voice.tx;
    if (media.Voice) o['voice_rx'] = media.Voice.rx;
    if (
      media.Voice && media.Voice.data
      && media.Voice.data.tx_stream && media.Voice.data.tx_stream.url
    ) o['voice_tx_stream'] = media.Voice.data.tx_stream.url;
    if (
      media.Voice && media.Voice.data
      && media.Voice.data.rx_stream && media.Voice.data.rx_stream.url
    ) o['voice_rx_stream'] = media.Voice.data.rx_stream.url;

    if (media.Video) o['video_tx'] = media.Video.tx;
    if (media.Video) o['video_rx'] = media.Video.rx;
    if (
      media.Video && media.Video.data
      && media.Video.data.tx_stream && media.Video.data.tx_stream.url
    ) o['video_tx_stream'] = media.Video.data.tx_stream.url;
    if (
      media.Video && media.Video.data
      && media.Video.data.rx_stream && media.Video.data.rx_stream.url
    ) o['video_rx_stream'] = media.Video.data.rx_stream.url;

    o['isOffering'] = false;
    if (
      o['voice_tx'] === false &&
      o['voice_rx'] === false &&
      o['video_tx'] === false &&
      o['video_rx'] === false &&
      !this.currentState.closedByVisitor &&
      !this.currentState.closedByAgent
    ){
      o['isMediaVisible'] = false;
      if (o['chat_tx'] && o['chat_rx']) {
        o['isChatVisible'] = true;
      }
    }
    console.log('MERGING MEDIA STATE', o);
    this.extendAndDispatch(this.currentState, o);
    */
  }
  setMinimizedState(){
    this.store.dispatch(new WidgetSetMinimized());
    /*
    this.extendAndDispatch(this.currentState, {
      isMinimized: true,
      lastAction: 'setMinimized'
    });
    */
  }
  setMinimizedMedia(){
    /*
    this.extendAndDispatch(this.currentState, {
      media_is_minimized: true,
      isChatVisible: true,
      lastAction: 'setMinimizedMedia'
    });
    */
  }
  setMuted(muted){
    /*
    this.extendAndDispatch(this.currentState, {
      is_muted: muted,
      is_muted_in_progress: false,
      lastAction: 'setMuted'
    });
    */
  }
  setMuteInProgress(){
    /*
    this.extendAndDispatch(this.currentState, {
      is_muted_in_progress: true,
      lastAction: 'muteInProgress'
    });
    */
  }
  setNormalState(){
    this.store.dispatch(new WidgetSetNormal());
    this.store.dispatch(new WidgetMarkAsRead());
    /*
    this.extendAndDispatch(this.currentState, {
      isMinimized: false,
      not_read: 0,

      lastAction: 'setNormalState'
    });
    */
  }
  setOfferRejected(){
    /*
    this.extendAndDispatch(this.currentState, {
      isChatVisible : true,
      isMediaVisible: false,
      isOffering: false
    });
    */
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
    /*
    this.extendAndDispatch(this.currentState, {
      isUploading: true
    });
    */
  }
  setUploaded(){
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