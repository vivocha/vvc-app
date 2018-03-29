import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import { WidgetState } from '../store/models.interface';
import * as fromStore from '../store';

@Injectable()
export class VvcUiService {

  currentState: WidgetState;
  constructor(private store: Store<fromStore.AppState>){
    this.store.select(fromStore.getWidgetState).subscribe( state => {
      console.log(state.lastAction, Object.assign({}, state));
      this.currentState = state
    });
  }
  dispatchNewState(state){
    this.store.dispatch(new fromStore.WidgetNewState(state));
  }
  extend(objectToExtend, propObj){
    return Object.assign({}, objectToExtend, propObj);
  }
  extendAndDispatch(objectToExtend, propObj){
    const state = this.extend(objectToExtend, propObj);
    this.dispatchNewState(state);
  }
  flatObj(prefix, obj){
    const varsObj = {};
    Object.keys(obj || []).forEach( elem => {
      varsObj[prefix+'_'+elem] = obj[elem];
    });
    return varsObj;
  }
  initializeUi(context){
    const varsObj = this.flatObj('var',context.variables);
    varsObj['requestedMedia'] = context.requestedMedia;

    this.extendAndDispatch(this.currentState, {
      ...varsObj,
      isMobile: context.isMobile,
      hasSurvey: !!context.survey,
      isLoading: false,
      isInQueue: true,
      //isChatVisible: context.requestedMedia === 'chat',
      //isSendAreaDisabled: true,
      //isSendAreaVisible: true,
      canRemoveApp: true,
      canMinimize: true,
      canMaximize: false,
      canStartAudio: false,
      canStartVideo: false,
      showSendButton: true,

      //topbar_title: 'STRINGS.QUEUE.TOPBAR.TITLE',
      //topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.SUBTITLE',
      queue_message: 'STRINGS.QUEUE.CONNECTING',
      voice_connected: 'STRINGS.VOICE.WELCOME_MESSAGE',
      lastAction: 'initializeUi'
    });
  }
  newMessageReceived(){
    if (this.currentState.isMinimized || this.currentState.isChatVisible === false){
      this.extendAndDispatch(this.currentState, {
        not_read: this.currentState.not_read + 1,

        lastAction: 'newMessageReceived'
      });
    }
  }
  setAgent(agent){
    const agentProps = this.flatObj('agent', agent);
    this.extendAndDispatch(this.currentState, {
      ...agentProps,

      isInQueue: false,
      canRemoveApp: false,


      isChatVisible: this.currentState.requestedMedia === 'chat',
      isVoiceVisible: this.currentState.requestedMedia === 'voice',
      isSendAreaDisabled: false,
      isSendAreaVisible: true,


      topbar_title: agent.nick,
      topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.CONNECTED',
      topbar_avatar: agent.avatar,

      lastAction: 'setAgent'
    });
  }
  setClosedByAgent(){
    this.extendAndDispatch(this.currentState, {
      closedByAgent: true,
      isSendAreaVisible: false,
      canRemoveApp: true,

      topbar_title: '',
      topbar_subtitle: '',
      topbar_avatar: '',

      lastAction: 'setClosedByAgent'

    })
  }
  setClosedByVisitor(){
    this.extendAndDispatch(this.currentState, {
      closedByVisitor: true,
      showCloseModal: false,
      isSendAreaVisible: false,
      canRemoveApp: true,

      topbar_title: '',
      topbar_subtitle: '',
      topbar_avatar: '',

      lastAction: 'setClosedByVisitor'
    });
  }
  setCloseModal(show: boolean){
    this.extendAndDispatch(this.currentState, {
      showCloseModal: show,

      lastAction: show ? 'showCloseModal' : 'hideCloseModal'
    });
  }
  setDataCollectionCompleted(){
    this.extendAndDispatch(this.currentState, {
      isLoading: false,
      isInQueue: true,
      isChatVisible: this.currentState.requestedMedia === 'chat',
      showDataCollectionPanel: false,
      //topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.SUBTITLE',
      lastAction: 'setDataCollectionCompleted'
    });
  }
  setDataCollectionPanel(show: boolean, topBarTitle: string){
    this.extendAndDispatch(this.currentState, {
      isLoading: false,
      isInQueue: false,
      isChatVisible: false,
      showDataCollectionPanel: show,
      topbar_subtitle: topBarTitle,
      lastAction: show ? 'showDataCollectionPanel' : 'hideDataCollectionPanel'
    });
  }
  setIncomingMedia(media){
    this.extendAndDispatch(this.currentState, {
      media_incoming: true,
      media_is_minimized: false,
      media_incoming_message: 'STRINGS.MEDIA.INCOMING_' + media.toUpperCase(),
      isChatVisible: false,
      isMediaVisible: true
    });
  }
  setIsOffering(){
    this.extendAndDispatch(this.currentState, {
      isOffering: true,
    });
  }
  setIsWriting(isWriting: boolean){
    this.extendAndDispatch(this.currentState, {
      isWriting: isWriting,

      lastAction: isWriting ? 'setIsWriting' : 'removeIsWriting'
    });
  }
  setMediaState(media) {
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
    ) o['video_tx_stream'] = media.Voice.data.tx_stream.url;
    if (
      media.Video && media.Video.data
      && media.Video.data.rx_stream && media.Video.data.rx_stream.url
    ) o['video_rx_stream'] = media.Video.data.rx_stream.url;

    o['isOffering'] = false;
    console.log('MERGING MEDIA STATE', o);
    this.extendAndDispatch(this.currentState, o);
  }
  setMinimizedState(){
    this.extendAndDispatch(this.currentState, {
      isMinimized: true,
      lastAction: 'setMinimized'
    });
  }
  setMinimizedMedia(){
    this.extendAndDispatch(this.currentState, {
      media_is_minimized: true,
      isChatVisible: true,
      lastAction: 'setMinimizedMedia'
    });
  }
  setMuted(muted){
    this.extendAndDispatch(this.currentState, {
      is_muted: muted,
      is_muted_in_progress: false,
      lastAction: 'setMuted'
    });
  }
  setMuteInProgress(){
    this.extendAndDispatch(this.currentState, {
      is_muted_in_progress: true,
      lastAction: 'muteInProgress'
    });
  }
  setNormalState(){
    this.extendAndDispatch(this.currentState, {
      isMinimized: false,
      not_read: 0,

      lastAction: 'setNormalState'
    });
  }
  setRemovedVoice(){
    if (!this.currentState.closedByAgent && !this.currentState.closedByAgent){
      this.extendAndDispatch(this.currentState, {
        isVoiceVisible: false,
        isChatVisible: true
      })
    }
  }
  setSurveyCompleted(){
    this.extendAndDispatch(this.currentState, {
      surveyCompleted : true
    })
  }
  setSurveyPanel(){
    this.extendAndDispatch(this.currentState, {
      showSurveyPanel: true,
      isSendAreaVisible: false,
      isChatVisible: false,

      topbar_title: 'STRINGS.SURVEY.TITLE',
      topbar_subtitle: 'STRINGS.SURVEY.SUBTITLE'
    })
  }
  setUploadPanel(show: boolean){
    this.extendAndDispatch(this.currentState, {
      showUploadPanel: show,
      isSendAreaVisible: !show,
      lastAction: show ? 'showUploadPanel' : 'hideUploadPanel'
    });
  }
  setUploading(){
    this.extendAndDispatch(this.currentState, {
      isUploading: true
    });
  }
  setUploaded(){
    this.extendAndDispatch(this.currentState, {
      isUploading: false,
      showUploadPanel: false,
      isSendAreaVisible: true
    });
  }
  setVoiceAccepted(){
    this.extendAndDispatch(this.currentState, {
      media_incoming: false
    });
  }
  toggleEmojiPanel(){
    this.extendAndDispatch(this.currentState, {
      showEmojiPanel: !this.currentState.showEmojiPanel,

      lastAction: 'toggleEmojiPanel'
    });
  }
}