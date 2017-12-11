export class MockContact {
    ready = Promise.resolve(this);
    callbacks = {};
    contact = { transcript: [] };
    failOnAttach = false;
    isAgent = false;
    media = {};
    constructor(conf) {
        const m = {};
        if (conf.initial_offer &&
            conf.initial_offer['Chat'] &&
            conf.initial_offer['Chat'].rx &&
            conf.initial_offer['Chat'].tx) {

            m['Chat'] = { rx: true, tx: true, via: 'net', engine: 'Native' };
        }
        if (conf.initial_offer &&
            conf.initial_offer['Sharing'] &&
            conf.initial_offer['Sharing'].rx &&
            conf.initial_offer['Sharing'].tx) {

            m['Sharing'] = { rx: true, tx: true, via: 'net', engine: 'Native' };
        }
        this.setMedia(m);
    }
    attach(file, text) {
        if (!this.failOnAttach) {
            return Promise.resolve(true);
        } else {
            return Promise.reject('error');
        }
    }
    getMedia() {
        return Promise.resolve(this.media);
    }
    getMediaOffer() {
        return Promise.resolve({});
    }
    emit(eventId, args) {
        this.callbacks[eventId](...args);
    }
    mergeMedia(mediaState) {
        return Promise.resolve({});
    }
    offerMedia(media) {
        return Promise.resolve({});
    }
    on(eventId, callback) {
        this.callbacks[eventId] = callback;
    }
    sendText(text) {
        this.isAgent = !this.isAgent;
        this.emit('text', [text, 'id', 'nick', this.isAgent]);
    }
    setMedia(media){
        this.media = media;
    }
}
