import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {getUiState} from '../store/selectors/widget.selectors';
import {AppState} from '../store/reducers/main.reducer';
import {VvcContextService} from './context.service';
import {ContextState, UiState} from '../store/models.interface';
import {VvcContactWrap} from './contact-wrap.service';
import {Observable} from 'rxjs';


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
    this.contactService.closeApp();
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
    //this.store.select(getUiState).subscribe(uistate => console.log('UISTATE', JSON.stringify(uistate, null, 2)));
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
  minimize(minimize: boolean, isFullScreen?: boolean, positionObject?: any, sizeObject?: any){
    this.contactService.minimize(minimize, isFullScreen, positionObject, sizeObject);
  }
  minimizeMedia(){
    this.contactService.minimizeMedia();
  }
  muteToggle(muted){
    this.contactService.muteToggle(muted);
  }
  openAttachment(url, click?: boolean){
    this.contactService.openAttachment(url, click);
  }
  processQuickReply(reply){
    this.contactService.processQuickReply(reply);
  }
  registerCustomAction(action):Observable<any>{
    return this.contactService.registerCustomAction(action);
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
  sendRequest(requestId, requestData){
    return this.contactService.sendRequest(requestId, requestData);
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
  setTopBar(avatarUrl: string, title: string, subtitle: string){
    this.contactService.setTopBar(avatarUrl, title, subtitle);
  }
  setTopBarAvatar(avatarUrl: string){
    this.contactService.setTopBarAvatar(avatarUrl);
  }
  setTopBarSubtitle(subtitle: string){
    this.contactService.setTopBarSubtitle(subtitle);
  }
  setTopBarTitle(title: string){
    this.contactService.setTopBarTitle(title);
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
  /*
  submitRecontactData(recontact){
    this.contactService.submitRecontactData(recontact);
  }*/
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