import {VvcContactService} from './contact.service';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppState} from './core.interfaces';
import {Store} from '@ngrx/store';
import {CoreModule} from './core.module';
import {vivocha} from '../_mocks/vivocha-mock';

fdescribe('ContactService', () => {

   let service: VvcContactService;
   let store: Store<AppState>;

   const chatInitialConf = {
      serv_id: 'SERVID',
      type: 'chat',
      nick: 'Marcolino',
      initial_offer: {
         Chat: { rx: 'required', tx: 'required' },
         Sharing: { rx: 'required', tx: 'required' }
      },
      opts: {
         media: { Video: 'visitor', Voice: 'visitor' },
         survey: { dataToCollect: 'schema#survey-id', sendTranscript: 'ask' }
         /*,
          dataCollection: { dataToCollect: 'schema#data-id' }
          */
      }
   };
   const mockAgent = {
      user: 'Marco Amadori',
      nick: 'Marchitos',
      avatar: '//s3.amazonaws.com/vivocha/u/ma/marchitos/1242260695996.0361?_=1460456503407'
   };

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [CoreModule],
         providers: [
             VvcContactService
         ]
      });
      service = TestBed.get(VvcContactService);
      service.init(new vivocha());
      store = TestBed.get(Store);
   }));

   /***/
   function simpleChat() {
      service.createContact(chatInitialConf);
      tick(1000);
      service.contact.emit('joined', [mockAgent]);
      tick(1000);
      service.setIsWriting();
      tick(1000);
      service.contact.emit('text', [{text: 'ciao', from_id: 'marchitos', from_nick: 'marchitos', agent: true }]);
      tick(1000);
      service.sendText('ciao');
      tick(1000);
   }
   function createIncomingRequest(media){
      
   }
   it('should create a simple chat with agent close', fakeAsync(() => {
      let msgNumber = 0;
      store.subscribe( state => msgNumber = state.messages.length);
      simpleChat();
      // TODO simulate a left

      expect(service.contact).toBeTruthy();
      expect(service.widgetState.agent.nick).toEqual(mockAgent.nick);
      expect(msgNumber).toEqual(2);
   }));

   it('should create a simple chat with a resume and client close', fakeAsync(() => {
      // simple chat
      // resume
      // close
   }));

   it('should create a simple chat with voice incoming request', fakeAsync(() => {
      // accept voice
      // mute / unmute
      // hangup
   }));

   it('should create a simple chat with video close', fakeAsync(() => {
      // accept video
      // add/remove video
      // minimize/maximize
   }));

   it('should create a simple chat with incoming request and rejection', fakeAsync(() => {
      // incoming request
      // reject
   }));


});
