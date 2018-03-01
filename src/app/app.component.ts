import { Component, OnInit } from '@angular/core';
import { InteractionContext } from '@vivocha/client-visitor-core/dist/widget.d';
import { WidgetState } from './interaction-core/store/models.interface';
import {VvcInteractionService} from './interaction-core/services';

@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private closeModal = false;
  private closeToDestroy = false;

  callTimerInterval;
  callTimer = 0;
  wasFullScreen = false;

  public widgetState: WidgetState;
  public messages: Array<any>;

  constructor(private interactionService: VvcInteractionService) {}
  ngOnInit() {
    this.interactionService.init();
    /*
    this.bindStores();
    this.initResizeListeners();
    this.cserv.voiceStart.subscribe( () => {
      this.startTimer();
    });
    */
  }
  abandon() {
    // TODO show message
    //this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    this.closeInteraction();
  }
  acceptIncomingRequest(evt, msg) {
    /*
    if (msg.type === 'incoming-request') {
      this.cserv.acceptRequest(evt, msg);
    } else {
      this.cserv.acceptOffer(evt);
      this.startTimer();
    }
    */
  }
  addLocalVideo() {
    //this.cserv.addLocalVideo();
  }
  bindStores() {
    /*
    this.store.subscribe( state => {
      console.log('STORE', state);
      this.widgetState = <WidgetState> state.widgetState;
      this.messages = state.messages.messages;
      if (this.wasFullScreen && this.widgetState.video === false) {
        this.setNormalScreen();
      }
    });
    */
  }
  closeContact() {
    /*
    this.cserv.closeContact();
    if (this.widgetState.hasSurvey) {
      this.zone.run( () => {
        this.store.dispatch(new fromStore.ShowSurvey(this.context.survey));
      });
    } else {
      // TODO hide modal if present
      // TODO show message
      this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    }
    this.closeInteraction();
    */
  }
  closeInteraction() {
    if (!this.closeToDestroy) {
      //this.vivocha.pageRequest('interactionClosed', 'close');
      this.closeToDestroy = true;
    } else {
      //this.vivocha.pageRequest('interactionClosed', 'destroy');
    }
  }
  closeOnSurvey(data) {
    /*
    const survey = objectToDataCollection(data, this.context.survey.id, this.context.survey);
    this.cserv.contact.storeSurvey(survey, (err, res) => {
      // TODO show message
      this.closeInteraction();
    });
    */
  }
  denyIncomingRequest(evt, msg) {
    /*
    if (msg.type === 'incoming-request') {
      this.cserv.denyRequest(evt, msg);
    } else {
      this.cserv.denyOffer(evt);
    }
    */
  }
  dismissCloseModal() {
    this.closeModal = false;
  }
  download(url) {
    //this.window.open(url, '_blank');
  }

  hangup() {
    /*
    this.stopTimer();
    this.cserv.hangup();
    */
  }
  hideDataCollectionPanel() {
    //this.store.dispatch(new fromStore.ShowDataCollection(false));
  }
  initResizeListeners() {
    const supportedModes = ['top', 'left', 'bottom', 'right', 'top-right', 'top-left', 'bottom-right', 'bottom-left'];
    //supportedModes.forEach(m => this.resizeWindow(m));
  }
  leave() {
    //this.cserv.closeContact();
    // TODO show message
    //this.vivocha.pageRequest('interactionClosed', 'close'); this.closeToDestroy = true; // TODO remove once the message is placed
    this.closeInteraction();
  }
  minimize(state) {
    /*
    this.store.dispatch(new fromStore.Minimize(state));
    if (state) {
      this.vivocha.minimize(
        {
          bottom: "10px",
          right: "10px"
        },
        {
          width: '70px',
          height: '70px'
        })
    } else {
      this.vivocha.maximize();
    }
    */
  }
  processAction(action: any){
    //this.cserv.sendPostBack(action);
  }
  removeLocalVideo() {
    //this.cserv.removeLocalVideo();
  }
  /*resizeWindow(mode: string) {
    let node: HTMLElement;
    switch (mode) {
      case 'top':
        node = document.getElementById('n-resize');
        break;
      case 'left':
        node = document.getElementById('w-resize');
        break;
      case 'right':
        node = document.getElementById('e-resize');
        break;
      case 'bottom':
        node = document.getElementById('s-resize');
        break;
      case 'top-right':
        node = document.getElementById('nw-resize');
        break;
      case 'top-left':
        node = document.getElementById('ne-resize');
        break;
      case 'bottom-right':
        node = document.getElementById('sw-resize');
        break;
      case 'bottom-left':
        node = document.getElementById('se-resize');
        break;
    }
    const mouseDown$ = Observable.fromEvent(node, 'mousedown');
    const mouseMove$ = Observable.fromEvent(document, 'mousemove');
    const mouseUp$ = Observable.fromEvent(document, 'mouseup');

    mouseDown$
      .switchMap(() => mouseMove$)
      .takeUntil(mouseUp$)
      .subscribe(evt => {
        if (!this.widgetState.minimized && this.context.campaign.channels.web.interaction.variables.canBeResized) { // is not minimized && can be resized
          switch (mode) {
            case 'top':
              this.vivocha.resize({
                width: 0,
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: 0
              });
              break;
            case 'left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: 0
              });
              this.vivocha.move({
                top: 0,
                left: evt['movementX']
              });
              break;
            case 'right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: 0
              });
              break;
            case 'bottom':
              this.vivocha.resize({
                width: 0,
                height: evt['movementY']
              });
              break;

            case 'top-right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: 0
              });
              break;

            case 'top-left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: -evt['movementY']
              });
              this.vivocha.move({
                top: evt['movementY'],
                left: evt['movementX']
              });
              break;

            case 'bottom-right':
              this.vivocha.resize({
                width: evt['movementX'],
                height: evt['movementY']
              });
              break;

            case 'bottom-left':
              this.vivocha.resize({
                width: -evt['movementX'],
                height: evt['movementY']
              });
              this.vivocha.move({
                top: 0,
                left: evt['movementX']
              });
              break;
          }
        } else {
          // do nothing;
        }
      }, err => { }, () => {
        this.resizeWindow(mode);
      });
  }*/
  resumeContactCreationOptions(context: InteractionContext) {
    //this.cserv.resumeContact(context);
  }
  sendAttachment(evt) {
    console.log('sending attachment', evt.text, evt.file);
    if (evt.file) {
      //this.cserv.sendAttachment({ file: evt.file, text: evt.text});
    }
  }
  sendChatMessage(text) {
    if (text !== '') {
      //this.cserv.sendText(text);
    }
  }
  sendDataCollection(obj) {
    //this.cserv.sendDataCollection(obj);
  }
  setChatVisibility(visibility: boolean) {
    //this.store.dispatch(new fromStore.ChatVisibility(visibility));
    if(visibility) {
      //this.store.dispatch(new fromStore.ResetNotRead());
    }
  }
  setFullScreen() {
    this.wasFullScreen = true;
    //this.store.dispatch(new fromStore.Fullscreen(true));
    //this.vivocha.setFullScreen();
  }
  setMute(mute: boolean) {
    //this.cserv.muteAudio(mute);
  }
  setNormalScreen() {
    this.wasFullScreen = false;
    //this.store.dispatch(new fromStore.Fullscreen(false));
    //this.vivocha.setNormalScreen();
    /*
    if(this.autoScroll) {
      setTimeout(() => this.autoScroll.forceScrollDown(), 50);
    } else {
      console.warn('Missing reference to autoScroll, cannot scroll down the message list');
    }
    */
  }
  showCloseModal(isContactClosed) {
    if (isContactClosed) {
      this.closeContact();
    } else {
      this.closeModal = true;
    }
  }
  showDataCollection(message) {
    //this.selectedDataMessage = message;
  }
  startTimer() {
    this.stopTimer();
    this.callTimerInterval = setInterval( () => {
      this.callTimer++;
      /*
      if (this.mediaTools) {
        this.mediaTools.setTime(this.callTimer);
      }
      */
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.callTimerInterval);
    this.callTimer = 0;
  }
  submitInitialData(id, dataCollection) {
    //this.waitingInitialDataCollections[id].call(this, dataCollection);
  }
  syncDataCollection(obj) {
    const dc = obj.dataCollection;
    //this.cserv.syncDataCollection(dc);
  }
  upgradeMedia(media: string) {
    const startedWith = (this.widgetState.voice) ? 'voice' : media;
   /*
    this.cserv.askForUpgrade(media, startedWith.toUpperCase()).then( () => {
      this.startTimer();
    });
    */
  }
}
