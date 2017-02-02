import {TestBed, async, inject} from '@angular/core/testing';
import {MockContactService} from './mock-contact.service';
import {CoreModule} from './core.module';

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [CoreModule],
        providers: [MockContactService]
    });
});

it('should init with a contact', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    expect(service.contact).toBeDefined();
})));

it('should call onAgentJoin if joined with a user is emitted', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    const spy = spyOn(service, 'onAgentJoin');
    service.contact.emit('joined', [{ user: 'Marchitos'}]);
    expect(spy).toHaveBeenCalled();
})));

it('should call onLocalJoin if joined with no user is emitted', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    const spy = spyOn(service, 'onLocalJoin');
    service.contact.emit('joined', [{}]);
    expect(spy).toHaveBeenCalled();
})));

it('should call showDataCollection if action with action_code="DataCollection" is emitted', async(
    inject([MockContactService], (service: MockContactService) => {
        service.init({});

        const spy = spyOn(service, 'showDataCollection');
        service.contact.emit('action', ['DataCollection', [{id: 'someId'}]]);

        expect(spy).toHaveBeenCalled();
})));

it('should define a timeout when iswriting emitted', async(inject([MockContactService], (service: MockContactService) => {
    service.isWritingTimeout = 300;
    service.init({});
    service.contact.emit('iswriting', ['id', 'nick', true]);
    expect(service.isWritingTimer).toBeDefined();

})));

it('should dispatch a message when transferred emitted', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    const spy = spyOn(service, 'dispatch');
    service.contact.emit('transferred', ['id']);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {
        text: 'CHAT.TRANSFER', type: 'AGENT-INFO'}});

})));

it('should dispatch a message when text emitted', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    const spy = spyOn(service, 'dispatch');
    service.contact.emit('text', ['ciao', 'id', 'nick', true]);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'AGENT'}});

    service.contact.emit('text', ['ciao', 'id', 'nick', false]);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'CUSTOMER'}});

    service.contact.emit('localtext', ['ciao']);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'CUSTOMER'}});

})));

it('should dispatch messages on attachment, mediachange, mediaoffer', async(inject([MockContactService], (service: MockContactService) => {
    service.init({});
    const spy = spyOn(service, 'dispatch');
    service.contact.emit('attachment', ['url', {desc: 'desc'}, 'id', 'nick', true]);
    expect(spy).toHaveBeenCalled();
    service.contact.emit('attachment', ['url', {desc: 'desc', originalUrl: 'ourl'}, 'id', 'nick', false]);
    expect(spy).toHaveBeenCalled();

    service.contact.emit('mediachange', []);
    expect(spy).toHaveBeenCalled();

    service.contact.emit('mediaoffer', []);
    expect(spy).toHaveBeenCalled();
})));

