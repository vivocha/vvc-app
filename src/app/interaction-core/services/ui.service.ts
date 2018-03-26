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

      isLoading: false,
      isInQueue: true,
      isChatVisible: context.requestedMedia === 'chat',
      isSendAreaDisabled: true,
      isSendAreaVisible: true,
      canRemoveApp: true,
      canMinimize: true,
      canMaximize: false,
      canStartAudio: false,
      canStartVideo: false,
      showSendButton: true,

      topbar_title: 'STRINGS.QUEUE.TOPBAR.TITLE',
      topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.SUBTITLE',

      lastAction: 'initializeUi'
    });
  }
  newMessageReceived(){
    if (this.currentState.isMinimized){
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
      isSendAreaDisabled: false,
      canRemoveApp: false,

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

      lastAction: 'setClosedByAgent'
    })
  }
  setClosedByVisitor(){
    this.extendAndDispatch(this.currentState, {
      closedByVisitor: true,
      showCloseModal: false,
      isSendAreaVisible: false,
      canRemoveApp: true,

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
      isChatVisible: true,
      showDataCollectionPanel: false,
      topbar_subtitle: 'STRINGS.QUEUE.TOPBAR.SUBTITLE',
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
  setIsWriting(isWriting: boolean){
    this.extendAndDispatch(this.currentState, {
      isWriting: isWriting,

      lastAction: isWriting ? 'setIsWriting' : 'removeIsWriting'
    });
  }
  setMinimizedState(){
    this.extendAndDispatch(this.currentState, {
      isMinimized: true,

      lastAction: 'setMinimized'
    });
  }
  setNormalState(){
    this.extendAndDispatch(this.currentState, {
      isMinimized: false,
      not_read: 0,

      lastAction: 'setNormalState'
    });
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
  toggleEmojiPanel(){
    this.extendAndDispatch(this.currentState, {
      showEmojiPanel: !this.currentState.showEmojiPanel,

      lastAction: 'toggleEmojiPanel'
    });
  }
}