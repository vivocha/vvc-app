import {Injectable, EventEmitter} from '@angular/core';
import {WindowRef} from './window.service';
import {VvcContactService} from './contact.service';

@Injectable()
export class VvcService {

  private ready$: EventEmitter<any> = new EventEmitter();
  private serv_id: string;
  private lang: string;
  private window;

  constructor(private wref: WindowRef, protected contactService: VvcContactService) {
      this.window = wref.nativeWindow;
      this.parseIframeUrl();
  }
  checkForVivocha() {
      if (this.window['vivocha'] && this.window['vivocha'].getContact) {
          this.ready$.emit({ serv_id: this.serv_id, lang: this.lang });
      } else {
          setTimeout( () => this.checkForVivocha(), 500);
      }
  }
  init() {
      this.checkForVivocha();
  }
  initContact(confObj) {
      return new Promise((resolve) => {
          this.window['vivocha'].getContact(confObj).then( contact => {
              this.contactService.init(contact);
              resolve(contact);
          });
      });
  }
  parseIframeUrl() {
      const hash = this.window.location.hash;
      if (hash.indexOf(';') !== -1) {
          const hashParts = this.window.location.hash.substr(2).split(';');
          this.serv_id = hashParts[0];
          this.lang = hashParts[1].split('=')[1];
      }
  }
  ready() { return this.ready$; }

}
