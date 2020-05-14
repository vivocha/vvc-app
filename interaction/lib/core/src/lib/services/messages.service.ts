import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {AppState} from '../store/reducers/main.reducer';
import {NewMessage, RemoveMessage, UpdateMessage} from '../store/actions/messages.actions';
import {SystemMessage, ChatMessage, RequestMessage, LinkMessage, LeftScrollOffset} from '../store/models.interface';

@Injectable()
export class VvcMessageService {

  constructor(
    private store: Store<AppState>
  ) {}

  addChatMessage(message, agent?, visitorNick?) {
    const id = new Date().getTime().toString();
    const msg: ChatMessage = {
      id: message._id || id,
      text: message.body,
      type: 'chat',
      isAgent: agent,
      time: this.getChatTimestamp(message.ts),
      ts: message.ts || new Date()
    };
    if (agent) {
      msg.agent = agent;
    }
    if (message.meta) {
      msg.meta = message.meta;
    }
    if (visitorNick) {
      msg.visitorNick = visitorNick;
    }
    if (message.delivered) {
      msg.ack = message.delivered;
    }
    if (message.read) {
      msg.read = message.read;
    }
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addCustomMessage(message) {
    const id = new Date().getTime().toString();
    const m = {
      id: id,
      code: 'message',
      type: 'custom',
      body: { ...message }
    };
    this.store.dispatch(new NewMessage(m));
    return id;
  }
  addDialogMessage(message, agent?) {
    if (message.quick_replies) {
      this.addQuickRepliesMessage(message, agent);
    } else if (message.template) {
      this.addTemplateMessage(message, agent);
    } else {
      this.addChatMessage(message, agent);
    }
  }
  addLocalMessage(text, msgId?, failed?: boolean) {
    const id = new Date().getTime().toString();
    const msg: ChatMessage = {
      id: msgId || id,
      text: text,
      type: 'chat',
      isAgent: false,
      time: this.getChatTimestamp(),
      ts: new Date()
    };
    if (failed){
      msg.failed = true;
    }
    this.store.dispatch(new NewMessage(msg));

    return msg.id;
  }
  addLinkMessage(url: string, from_id: string, from_nick: string, desc?: string, agent?: boolean) {
    const id = new Date().getTime().toString();
    const msg: LinkMessage = {
      id: id,
      text: desc || url,
      url: url,
      from_id: from_id,
      from_nick: from_nick,
      type: 'link',
      time: this.getChatTimestamp(),
      ts: new Date()
    };
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addQuickRepliesMessage(message, agent?) {
    const id = new Date().getTime().toString();
    const quick: any = {
      id: id,
      code: 'message',
      type: 'quick-replies',
      body: message.body,
      quick_replies: message.quick_replies,
      quick_replies_orientation: message.quick_replies_orientation,
      scrollLeft: 0,
      time: this.getChatTimestamp(),
      ts: message.ts || new Date()
    };
    if (agent) {
      quick.agent = agent;
    }
    this.store.dispatch(new NewMessage(quick));
    return id;
  }
  addTemplateMessage(message, agent?) {
    const id = new Date().getTime().toString();
    const template: any = {
      id: id,
      type: 'template',
      template: message.template.type,
      elements: message.template.elements,
      buttons: message.template.buttons,
      body: message.body,
      original: message.template,
      scrollLeft: 0,
      time: this.getChatTimestamp(),
      ts: message.ts || new Date()
    };
    if (agent) {
      template.agent = agent;
    }
    this.store.dispatch(new NewMessage(template));
    return id;
  }
  getChatTimestamp(tsString?: string) {
    let t;
    if (tsString) {
      t = new Date(tsString);
    } else {
      t = new Date();
    }
    const h = (parseInt(t.getHours()) > 9) ? t.getHours() : '0' + t.getHours();
    const m = (parseInt(t.getMinutes()) > 9) ? t.getMinutes() : '0' + t.getMinutes();
    return h + ':' + m;
  }
  removeMessage(messageId: string) {
    this.store.dispatch(new RemoveMessage(messageId));
  }
  sendRequestMessage(message) {
    const id = new Date().getTime().toString();
    const m: RequestMessage = {
      id: id,
      type: 'request',
      text: message.toUpperCase(),
      ts: message.ts || new Date()
    };
    this.store.dispatch(new NewMessage(m));
    return id;
  }
  sendSystemMessage(messageNameId: string, context?: any) {
    const id = new Date().getTime().toString();
    const message: SystemMessage = {
      id: id,
      type: 'system',
      text: messageNameId,
      ts: new Date()
    };
    if (context) {
      message.context = context;
    }
    this.store.dispatch(new NewMessage(message));
    return id;
  }
  updateQuickReply(messageId) {
    this.store.dispatch(new UpdateMessage({ id: messageId, patch: { replied : true }}));
  }
  updateLeftScroll(o: LeftScrollOffset) {
    this.store.dispatch(new UpdateMessage( {id: o.messageId, patch: { scrollLeft: o.scrollLeft }}));
  }
  updateChatMessage(messageId, prop, value, tooltipData?) {
    const msg = { id: messageId, patch: { [prop]: value }}
    if (tooltipData){
      msg.patch['tooltipData'] = tooltipData;
    }
    this.store.dispatch(new UpdateMessage(msg));
  }
}
