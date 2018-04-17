import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {AppState} from '../store/reducers/main.reducer';
import {NewMessage,RemoveMessage,UpdateMessage} from '../store/actions/messages.actions';
import {SystemMessage, ChatMessage} from '../store/models.interface';

@Injectable()
export class VvcMessageService {

  constructor(
    private store: Store<AppState>
  ){}

  addChatMessage(message, agent?){
    const id = new Date().getTime().toString();
    const msg:ChatMessage = {
      id: id,
      text: message.body,
      type: 'chat',
      isAgent: agent,
      time: this.getChatTimestamp(message.ts)
    };
    if (agent) msg.agent = agent;
    if (message.meta) msg.meta = message.meta;
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addLocalMessage(text){
    const id = new Date().getTime().toString();
    const msg: ChatMessage = {
      id: id,
      text:text,
      type: 'chat',
      isAgent: false,
      time: this.getChatTimestamp()
    };
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addQuickRepliesMessage(message){
    console.log('QUICK_REPLY', message);
    const id = new Date().getTime().toString();
    const quick = {
      id: id,
      code: "message",
      type: "quick-replies",
      body: message.body,
      quick_replies: message.quick_replies
    };
    this.store.dispatch(new NewMessage(quick));
    return id;
  }
  addTemplateMessage(message){
    console.log('TEMPLATE', message);
    const id = new Date().getTime().toString();
    const template = {
      id: id,
      type: 'template',
      template: message.template.type,
      elements: message.template.elements
    };
    this.store.dispatch(new NewMessage(template));
    return id;
  }
  getChatTimestamp(tsString?: string){
    let t;
    if (tsString) t = new Date(tsString);
    else t = new Date();
    const h = (parseInt(t.getHours()) > 9) ? t.getHours() : "0"+t.getHours();
    const m = (parseInt(t.getMinutes()) > 9) ? t.getMinutes() : "0"+t.getMinutes();
    return h + ":" + m;
  }
  removeMessage(messageId: string){
    this.store.dispatch(new RemoveMessage(messageId));
  }
  sendSystemMessage(messageNameId: string, context?: any){
    const id = new Date().getTime().toString();
    let message: SystemMessage = {
      id: id,
      type: 'system',
      text: messageNameId
    };
    if (context){
      message.context = context;
    }
    this.store.dispatch(new NewMessage(message));
    return id;
  }
  updateQuickReply(messageId){
    this.store.dispatch(new UpdateMessage({ id: messageId, patch: { replied : true }}))
  }
}