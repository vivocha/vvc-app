import {VvcContactService} from './contact.service';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppState} from './core.interfaces';
import {Store} from '@ngrx/store';
import {CoreModule} from './core.module';
import {vivocha} from '../_mocks/vivocha-mock';

describe('ContactService', () => {

   let service: VvcContactService;
   let store: Store<AppState>;

   const chatInitialConf = {
      serv_id: 'SERVID',
      type: 'chat',
      nick: 'Customer',
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
   function getIncomingRequest(media) {
      let r;
      if (media === 'voice') {
         r = {
            Chat: { rx: 'required', tx: 'required' },
            Sharing: { rx: 'required', tx: 'required' },
            Voice: { rx: 'required', tx: 'required'}
         };
      }
      if (media === 'video') {
         r = {
            Chat: { rx: 'required', tx: 'required' },
            Sharing: { rx: 'required', tx: 'required' },
            Voice: { rx: 'required', tx: 'required'},
            Video: { rx: 'required', tx: 'required'}
         };
      }
      return r;
   }
   it('should create a simple chat with agent close', fakeAsync(() => {
      let msgNumber = 0;
      store.subscribe( state => msgNumber = state.messages.length);
      simpleChat();
      service.contact.emit('left', [{channels: { user: 0 }}]);
      tick(1000);
      expect(service.widgetState.closed).toBeTruthy();
      expect(service.contact).toBeTruthy();
      expect(service.widgetState.agent.nick).toEqual(mockAgent.nick);
      expect(msgNumber).toEqual(3);
   }));

   it('should create a simple chat with a resume and client close', fakeAsync(() => {
      simpleChat();
      const leave = spyOn(service.contact, 'leave');
      service.contact.emit('joined', [{ reason: 'resume' }]);
      service.closeContact();
      tick(1000);
      expect(leave).toHaveBeenCalled();

   }));

   it('should create a simple chat with voice incoming request', fakeAsync(() => {
      simpleChat();
      const r = getIncomingRequest('voice');
      service.contact.emit('mediaoffer', [r, (mediaOffer) => {

      }]);
      service.acceptOffer({});
      service.contact.emit('mediachange', [{
         Chat: { rx: true, tx: true},
         Sharing: { rx: true, tx: true},
         Voice: { rx: true, tx: true, data: {
            tx_stream: { url: 'txstreamurl'},
            rx_stream: { url: 'rxstreamurl'},
         }}
      }]);
      tick(1000);
      expect(service.widgetState.voice).toBeTruthy();
      service.muteAudio(true);
      tick(1000);
      expect(service.widgetState.mute).toBeTruthy();
      service.muteAudio(false);
      tick(1000);
      expect(service.widgetState.mute).toBeFalsy();
      service.hangup();
      service.contact.emit('mediachange', [{
         Chat: { rx: true, tx: true},
         Sharing: { rx: true, tx: true},
         Voice: { rx: false, tx: false }
      }]);
      tick(1000);
      expect(service.widgetState.voice).toBeFalsy();

   }));

   it('should create a simple chat with video close', fakeAsync(() => {
      simpleChat();
      const r = getIncomingRequest('video');
      service.contact.emit('mediaoffer', [r, (mediaOffer) => {}]);
      service.acceptOffer({});
      service.contact.emit('mediachange', [{
         Chat: { rx: true, tx: true},
         Sharing: { rx: true, tx: true},
         Voice: { rx: true, tx: true, data: {
            tx_stream: { url: 'txstreamurl'},
            rx_stream: { url: 'rxstreamurl'},
         }},
         Video: { rx: true, tx: true, data: {
            tx_stream: { url: 'txstreamurl'},
            rx_stream: { url: 'rxstreamurl'},
         }}
      }]);
      tick(1000);
      expect(service.widgetState.video).toBeTruthy();
      // add/remove video
      // minimize/maximize
   }));

   it('should create a simple chat with incoming request and rejection', fakeAsync(() => {
      // incoming request
      // reject
   }));


});
