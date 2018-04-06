import {Component, OnInit, ViewChild} from '@angular/core';
import { WidgetState } from './interaction-core/store/models.interface';
import {VvcInteractionService} from './interaction-core/services';

//import {ChatAreaComponent} from './modules/chat/chat-area/chat-area.component';
//import {TopBarComponent} from './modules/top-bar/top-bar/top-bar.component';
//import {ChatIsWritingComponent} from './modules/chat/chat-is-writing/chat-is-writing.component';
import {ChatAreaComponent, TopBarComponent, ChatIsWritingComponent} from '@vivocha/client-interaction-layout';


@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild(TopBarComponent) topBar: TopBarComponent;
  @ViewChild(ChatAreaComponent) chat: ChatAreaComponent;

  public widgetState: WidgetState;
  public messages: Array<any>;

  public appState$:any;

  constructor(private interactionService: VvcInteractionService) {}
  ngOnInit() {
    this.appState$ = this.interactionService.getState();
    this.interactionService.init();
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
  closeContact(){
    this.interactionService.closeContact();
  }
  closeUploadPanel(){
    this.interactionService.closeUploadPanel();
  }
  dismissCloseModal(){
    this.interactionService.dismissCloseModal()
  }
  doUpload(upload){
    this.interactionService.sendAttachment(upload);
  }
  exitFromFullScreen(){
    this.interactionService.setNormalScreen();
  }
  expandWidget(){
    this.interactionService.minimize(false);
  }
  hangUpCall(){
    this.interactionService.hangUp();
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
  openAttachment(url){
    this.interactionService.openAttachment(url);
  }
  processAction(action){
    this.interactionService.sendPostBack(action);
  }
  processQuickReply(reply){
    this.interactionService.processQuickReply(reply);
  }
  rejectOffer(){
    this.interactionService.rejectOffer();
  }
  sendText(value, isEmojiPanelVisible){
    if (isEmojiPanelVisible) this.toggleEmojiPanel();
    this.interactionService.sendText(value);
  }
  setFullScreen(){
    this.interactionService.setFullScreen();
  }
  showCloseModal(){
    this.interactionService.showCloseModal()
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
  submitSurvey(survey){
    this.interactionService.submitSurvey(survey);
  }
  toggleEmojiPanel() {
    this.interactionService.toggleEmojiPanel();
  }
  videoToggle(show){
    this.interactionService.toggleVideo(show)
  }
}
