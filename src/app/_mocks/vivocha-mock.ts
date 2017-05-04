import {Observable} from 'rxjs/Observable';

class VvcContact {
    callbacks = {};
    media = 'chat';
    emit(eventId, args) {
        this.callbacks[eventId](...args);
    }
    getLocalCapabilities() {
        return Promise.resolve({ WebRTC : { AudioCapture : true, VideoCapture: true } });
    }
    getMedia() {
        return Promise.resolve(this.media);
    }
    getRemoteCapabilities() {
        return Promise.resolve({
            WebRTC : { AudioCapture: true, VideoCapture: true },
            MediaAvailability : { Video: true }
        });
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
