import {TestBed, async, inject} from '@angular/core/testing';
import {VvcContactService} from './contact.service';
import {CoreModule} from './core.module';
import {MockContact} from './mock-contact.class';


let contact;
beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [CoreModule],
        providers: [VvcContactService]
    });
    contact = new MockContact();
});
it('should init with a contact', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    expect(service.contact).toBeDefined();
})));
it('should call onAgentJoin if joined with a user is emitted', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(service, 'onAgentJoin');
    service.contact.emit('joined', [{ user: 'Marchitos'}]);
    expect(spy).toHaveBeenCalled();
})));
it('should call onLocalJoin if joined with no user is emitted', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(service, 'onLocalJoin');
    service.contact.emit('joined', [{}]);
    expect(spy).toHaveBeenCalled();
})));
it('should call showDataCollection if action with action_code="DataCollection" is emitted', async(
    inject([VvcContactService], (service: VvcContactService) => {
        service.init(contact);

        const spy = spyOn(service, 'showDataCollection');
        service.contact.emit('action', ['DataCollection', [{id: 'user'}]]);

        expect(spy).toHaveBeenCalledWith('user');

})));
it('should define a timeout when iswriting emitted', async(inject([VvcContactService], (service: VvcContactService) => {
    service.isWritingTimeout = 300;
    service.init(contact);
    service.contact.emit('iswriting', ['id', 'nick', true]);
    expect(service.isWritingTimer).toBeDefined();

})));
it('should dispatch a message when transferred emitted', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(service, 'dispatch');
    service.contact.emit('transferred', ['id']);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {
        text: 'CHAT.TRANSFER', type: 'AGENT-INFO'}});

})));
it('should dispatch a message when text emitted', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(service, 'dispatch');
    service.contact.emit('text', ['ciao', 'id', 'nick', true]);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'CHAT_TEXT', isAgent: true}});

    service.contact.emit('text', ['ciao', 'id', 'nick', false]);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'CHAT_TEXT', isAgent: false}});

    service.contact.emit('localtext', ['ciao']);
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'CUSTOMER'}});

})));
it('should dispatch messages on attachment, mediachange, mediaoffer', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
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
it('should call sendText on contact', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(contact, 'sendText');
    service.sendText('ciao');
    expect(spy).toHaveBeenCalledWith('ciao');
})));
it('should call attach on contact', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy = spyOn(service, 'dispatch');
    service.sendAttachment({ file: 'file', name: 'name'});
    expect(spy).toHaveBeenCalled();

    contact.failOnAttach = true;
    service.sendAttachment({ file: 'file', name: 'name'});
    expect(spy).toHaveBeenCalled();
})));
it('should call mergeMedia on contact', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    service.mediaCallback = function(a, b) {};
    const spy = spyOn(contact, 'mergeMedia').and.returnValue(Promise.resolve({}));
    service.upgradeMedia({ Voice: { rx: true, tx: false }});
    expect(spy).toHaveBeenCalled();
})));
it('should test askForUpgrade', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const spy1 = spyOn(contact, 'getMediaOffer').and.returnValue(Promise.resolve({}));
    service.askForUpgrade('VIDEO');
    expect(spy1).toHaveBeenCalled();
})));
it('should test diffOffer', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    const currentOffer = {
        Voice : { rx: 'required', tx: 'required', via: 'web', engine: 'WebRTC' }
    }
    const incomingOffer = {
        Voice : { rx: 'required', tx: 'required', via: 'web', engine: 'WebRTC' },
        Video : { rx: 'required', tx: 'required', via: 'web', engine: 'WebRTC' }
    }
    const expected = service.diffOffer(currentOffer, incomingOffer);
    expect(JSON.stringify(expected.added)).toContain('Video');


})));
it('should checkForTranscript with text message', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    contact.contact.transcript.push({
        type: 'text',
        body: 'ciao',
        agent: true
    });
    const spy = spyOn(service, 'dispatch');
    service.checkForTranscript();
    expect(spy).toHaveBeenCalledWith({type: 'ADD_TEXT', payload: {text: 'ciao', type: 'AGENT' }});
})));
it('should checkForTranscript with attachment', async(inject([VvcContactService], (service: VvcContactService) => {
    service.init(contact);
    contact.contact.transcript.push({
        type: 'attachment',
        meta: { desc: 'descr' },
        url: 'url',
        from_id: 'from_id',
        from_nick: 'from_nick',
        agent: false
    });
    const spy = spyOn(service, 'dispatch');
    service.checkForTranscript();
    expect(spy).toHaveBeenCalledWith({
        type: 'ADD_TEXT',
        payload: {
            text: 'descr',
            agent: {},
            type: 'CUSTOMER-ATTACHMENT',
            meta: { desc: 'descr' },
            url: 'url',
            from_nick: 'from_nick',
            from_id: 'from_id'
        }
    });
})));

