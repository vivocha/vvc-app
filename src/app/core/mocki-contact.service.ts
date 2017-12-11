import {Injectable} from '@angular/core';
import {VvcContactService} from './contact.service';
import {MockContact} from './mock-contact.class';

const mockAgent = {
    user: 'Marco Amadori',
    nick: 'Marchitos',
    avatar: '//s3.amazonaws.com/vivocha/u/ma/marchitos/1242260695996.0361?_=1460456503407'
};

@Injectable()
export class VvcMockContactService extends VvcContactService {

    createContact(conf) {
        console.log('creating contact from mock service');
        this.dispatch({type: 'INITIAL_OFFER', payload: conf.initial_offer});
        setTimeout( () => {
            this.contact = new MockContact(conf) as any;
            this.mapContact();

            this.contact.emit('joined', [mockAgent]);
        }, 1000);
    }
}
