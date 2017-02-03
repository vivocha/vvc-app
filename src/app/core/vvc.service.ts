import {Injectable, EventEmitter, Inject} from '@angular/core';
import {WindowService} from './core.opaque-tokens';
import {VvcContactService} from './contact.service';



@Injectable()
export class VvcService {

  private ready$: EventEmitter<any> = new EventEmitter();
  private serv_id: string;
  private lang: string;

  constructor(@Inject(WindowService) private window: Window, private contactService: VvcContactService) {
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
      this.window['vivocha'].getContact(confObj).then( contact => {
        this.contactService.init(contact);
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
