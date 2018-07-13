import {Component, OnInit, ViewChild} from '@angular/core';
import {VvcInteractionService} from '@vivocha/client-interaction-core';
import {ChatAreaComponent} from '@vivocha/client-interaction-layout';
import {Observable} from 'rxjs';

@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild(ChatAreaComponent) chat: ChatAreaComponent;

  public messages: Array<any>;

  public appState$:Observable<any>;

  public closeModalVisible = false;
  public surveyVisible = false;

  constructor(private interactionService: VvcInteractionService) {}
  ngOnInit() {
    this.appState$ = this.interactionService.getState();
    this.interactionService.init();
    //this.interactionService.getState().subscribe( state => console.log(JSON.stringify(state, null, 2)));
  }
  acceptAgentRequest(requestId){
    this.interactionService.acceptAgentRequest(requestId);
  }
  acceptOffer(){
    this.interactionService.acceptOffer();
  }
  addChatToFullScreen(show){
    this.interactionService.addChatToFullScreen(show);
  }
  appendText(text){
    this.chat.appendText(text);
  }
  askForVideoUpgrade(){
    this.interactionService.askForVideoUpgrade()
  }
  askForVoiceUpgrade(){
    this.interactionService.askForVoiceUpgrade()
  }
  closeApp(){
    this.interactionService.closeApp();
  }
  closeContact(context){
    const step = this.getCloseStep(context);
    console.log('CLOSE CONTACT', step, context.variables, context);

    switch(step){
      case 'remove-app':
        this.closeApp();
        break;
      case 'show-survey':
        this.surveyVisible = true;
        this.interactionService.showSurvey();
        break;
      case 'close-and-survey':
        this.surveyVisible = true;
        this.interactionService.closeContact();
        this.interactionService.showSurvey();
        break;
      case 'show-close-modal':
        this.closeModalVisible = true;
        this.interactionService.showCloseModal();
        break;
      case 'close-and-stay':
        this.dismissCloseModal();
        this.closeModalVisible = true;
        this.interactionService.closeContact();
        break;
      case 'close-and-remove':
        this.interactionService.closeContact();
        this.closeApp();
        break;
    }
  }
  closeUploadPanel(){
    this.interactionService.closeUploadPanel();
  }
  dismissCloseModal(){
    this.closeModalVisible = false;
    this.interactionService.dismissCloseModal()
  }
  doUpload(upload){
    this.interactionService.sendAttachment(upload);
  }
  exitFromFullScreen(){
    this.interactionService.setNormalScreen();
  }
  expandWidget(isFullScreen){
    this.interactionService.minimize(false, isFullScreen);
  }
  getCloseStep(context){
    if (!context.contactStarted) return 'remove-app';
    if (context.isClosed){
      if (context.hasSurvey && !context.canRemoveApp){
        if (this.surveyVisible) return 'remove-app';
        else return 'show-survey';
      }
      else return 'remove-app';
    }
    else {
      if (context.variables.askCloseConfirm){
        if (this.closeModalVisible){
          if (context.variables.stayInAppAfterClose) return 'close-and-stay';
          else {
            if (context.hasSurvey){
              if (this.surveyVisible) return 'remove-app';
              else return 'close-and-survey';
            }
            else return 'close-and-remove';
          }
        }
        else {
          return 'show-close-modal';
        }
      }
      else {
        if (context.variables.stayInAppAfterClose) return 'close-and-stay';
        else {
          if (context.hasSurvey){
            if (this.surveyVisible) return 'remove-app';
            else return 'close-and-survey';
          }
          else return 'close-and-remove';
        }
      }
    }
  }
  hangUpCall(){
    this.interactionService.hangUp();
  }
  hasToStayInApp(context){
    return (context.isClosed && context.variables.stayInAppAfterClose);
  }
  hideChat(){
    this.interactionService.hideChat();
  }
  minimizeWidget(){
    this.interactionService.minimize(true);
  }
  minimizeMedia(){
    this.interactionService.minimizeMedia();
  }
  muteToggle(muted){
    this.interactionService.muteToggle(muted);
  }
  openAttachment(url: string, click?: boolean){
    this.interactionService.openAttachment(url, click);
  }
  processAction(action){
    this.interactionService.sendPostBack(action);
  }
  processQuickReply(reply){
    this.interactionService.processQuickReply(reply);
  }
  rejectAgentRequest(requestId){
    this.interactionService.rejectAgentRequest(requestId);
  }
  rejectOffer(){
    this.interactionService.rejectOffer();
  }
  sendIsWriting(){
    this.interactionService.sendIsWriting();
  }
  sendText(value, isEmojiPanelVisible){
    if (isEmojiPanelVisible) this.toggleEmojiPanel();
    this.interactionService.sendText(value);
  }
  setFullScreen(){
    this.interactionService.setFullScreen();
  }
  showCloseDialog(context){
    return (context && !context.isCLosed && context.variables && context.variables.askCloseConfirm && !this.closeModalVisible);
  }
  showCloseModal(closeOpt){
    if (closeOpt.forceClose) {
      this.interactionService.closeContact();
      if (!closeOpt.stayInAppAfterClose && !closeOpt.hasSurvey) this.closeApp();
      else if (closeOpt.hasSurvey && !closeOpt.stayInAppAfterClose){
        this.showSurvey();
      }
    } else {
      this.interactionService.showCloseModal();
    }
  }
  showUploadPanel(){
    this.interactionService.showUploadPanel();
  }
  showSurvey(){
    this.interactionService.showSurvey();
  }
  submitDataCollection(dc){
    this.interactionService.submitDataCollection(dc);
  }
  /*
  submitRecontact(recontact){
    this.interactionService.submitRecontactData(recontact);
  }
  submitSurvey(survey){
    this.interactionService.submitSurvey(survey);
  }*/
  toggleEmojiPanel() {
    this.interactionService.toggleEmojiPanel();
  }
  updateLeftScrollOffset(scrollObject: { scrollLeft: number, messageId: string}){
    console.log('should update left scroll', scrollObject);
    this.interactionService.updateLeftScrollOffset(scrollObject);
  }
  videoToggle(show){
    this.interactionService.toggleVideo(show)
  }
}
