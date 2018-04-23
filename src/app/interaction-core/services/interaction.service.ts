import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {getUiState} from '../store/selectors/widget.selectors';
import {AppState} from '../store/reducers/main.reducer';
import {VvcContextService} from './context.service';
import {ContextState, UiState} from '../store/models.interface';
import {VvcContactWrap} from './contact-wrap.service';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class VvcInteractionService {

  private vivocha;
  private context: ContextState;

  agentRequestCallback;

  constructor(
    private store: Store<AppState>,
    private contextService: VvcContextService,
    private contactService: VvcContactWrap
  ){

  }

  /**** PUBLIC METHOD ****/
  acceptAgentRequest(requestId){
    this.contactService.acceptAgentRequest(requestId);
  }
  acceptOffer(){
    this.contactService.acceptOffer();
  }
  addChatToFullScreen(show){
    this.contactService.addChatToFullScreen(show);
  }
  askForVideoUpgrade(){
    this.contactService.askForUpgrade('Video');
  }
  askForVoiceUpgrade(){
    this.contactService.askForUpgrade('Voice');
  }
  closeApp(){
    this.contextService.closeApp();
  }
  closeContact(){
    this.contactService.closeContact();
  }
  closeUploadPanel(){
    this.contactService.closeUploadPanel();
  }
  dismissCloseModal(){
    this.contactService.showCloseModal(false);
  }
  getState():Observable<UiState>{
    this.store.select(getUiState).subscribe(uistate => console.log('UISTATE', uistate));
    return this.store.select(getUiState);
  }
  hangUp(){
    this.contactService.hangUp();
  }
  hideChat(){
    this.contactService.hideChat();
  }
  init(){
    this.contextService.ready().subscribe( (context:ContextState) => {
      if (context.loaded) {
        this.vivocha = this.contextService.getVivocha();
        this.context = context;

        this.contactService.initializeContact(this.vivocha, this.context);
      }
    })
  }
  minimize(minimize: boolean){
    this.contactService.minimize(minimize);
  }
  minimizeMedia(){
    this.contactService.minimizeMedia();
  }
  muteToggle(muted){
    this.contactService.muteToggle(muted);
  }
  openAttachment(url){
    this.contactService.openAttachment(url);
  }
  processQuickReply(reply){
    this.contactService.processQuickReply(reply);
  }
  rejectAgentRequest(requestId){
    this.contactService.rejectAgentRequest(requestId);
  }
  rejectOffer(){
    this.contactService.rejectOffer();
  }
  sendAttachment(upload){
    this.contactService.sendAttachment(upload);
  }
  sendIsWriting(){
    this.contactService.sendIsWriting();
  }
  sendPostBack(action){
    this.contactService.sendPostBack(action);
  }
  sendText(text){
    this.contactService.sendText(text);
  }
  setFullScreen(){
    this.contactService.setFullScreen();
  }
  setNormalScreen(){
    this.contactService.setNormalScreen();
  }
  showCloseModal(){
    this.contactService.showCloseModal(true);
  }
  showUploadPanel(){
    this.contactService.showUploadPanel();
  }
  showSurvey(){
    this.contactService.showSurvey();
  }
  submitDataCollection(dc){
    this.contactService.submitDataCollection(dc);
  }
  submitSurvey(dc){
    this.contactService.submitSurvey(dc);
  }
  toggleEmojiPanel(){
    this.contactService.toggleEmojiPanel();
  }
  toggleVideo(show){
    this.contactService.toggleVideo(show);
  }
}