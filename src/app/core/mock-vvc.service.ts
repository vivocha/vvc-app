import {Injectable} from '@angular/core';
import {VvcService} from './vvc.service';
import {MockContact} from './mock-contact.class';
@Injectable()
export class VvcMockService extends VvcService {
    initContact(confObj) {
        return new Promise((resolve) => {
            const contact = new MockContact();
            this.contactService.init(contact);
            resolve(contact);
        });
    }
}
