import {Observable} from 'rxjs/Observable';

class VvcContact {
    offer;
    callbacks = {};
    contact = {
        agentInfo: {
            user: 'Marco Amadori',
            nick: 'Marchitos',
            avatar: '//s3.amazonaws.com/vivocha/u/ma/marchitos/1242260695996.0361?_=1460456503407'
        }
    };
    media = 'chat';
    emit(eventId, args) {
        this.callbacks[eventId](...args);
        if (eventId === 'mediaoffer') {
            this.offer = args[0];
        }
    }
    getLocalCapabilities() {
        return Promise.resolve({ WebRTC : { AudioCapture : true, VideoCapture: true } });
    }
    getMedia() {
        return Promise.resolve(this.media);
    }
    getMediaEngine(engine){
        if (engine === 'WebRTC') {
            return Promise.resolve({
                muteLocalAudio: () => {},
                unmuteLocalAudio: () => {}
            });
        } else {
            return Promise.reject({ error: 'invalid engine'});
        }
    }
    getMediaOffer() {
        return Promise.resolve({});
    }
    getRemoteCapabilities() {
        return Promise.resolve({
            WebRTC : { AudioCapture: true, VideoCapture: true },
            MediaAvailability : { Video: true }
        });
    }
    leave() { }
    mergeMedia(diffOffer) {
        return Promise.resolve(diffOffer);
    }
    offerMedia(offer) {
        return Promise.resolve(offer);
    }
    on(eventId, callback) {
        this.callbacks[eventId] = callback;
    }
    sendText(text) {
        this.emit('localtext', [text, 'id', 'nick', false]);
    }
}

export class vivocha {
    contact;

    constructor() {

    }

    getContact(conf) {
        this.contact = new VvcContact();
        return Promise.resolve(this.contact);
    }
}
