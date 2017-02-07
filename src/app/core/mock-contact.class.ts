export class MockContact {

    isAgent = false;
    failOnAttach = false;
    callbacks = {};
    contact = { transcript: [] };
    constructor() {

    }
    attach(file, text) {
        if (!this.failOnAttach) {
            return Promise.resolve(true);
        } else {
            return Promise.reject('error');
        }
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

}
