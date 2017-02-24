import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, VvcWidgetState, VvcOffer} from './core.interfaces';
import {WidgetStateTypes, WidgetState} from '../oldstuff/core/core.interfaces';

const dc2 = {};

@Injectable()
export class VvcContactService {

    vivocha;
    agentInfo;
    contact;
    isWritingTimer;
    isWritingTimeout = 30000;
    statusMessageUpdate = 3000;
    mediaCallback;
    incomingOffer: VvcOffer;
    incomingId;
    private widgetState: VvcWidgetState;


    constructor( private store: Store<AppState>,
                 private zone: NgZone) {
       store.subscribe( state => {
           this.widgetState = <VvcWidgetState> state.widgetState;
       });
    }
    acceptOffer() {
        const diffOffer = this.incomingOffer;
        this.mergeOffer(diffOffer);
        this.dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                id: this.incomingId,
                state: 'loading'
            }
        });
    }
    addLocalVideo() {
        this.contact.getMediaOffer().then(mediaOffer => {
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'required';
            }
            this.contact.offerMedia(mediaOffer);
        });
    }
    askForUpgrade(media) {
        this.store.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'OREQUEST'} });
        this.contact.getMediaOffer().then(offer => {
            if (media === 'VIDEO') {
                offer.Video = {
                    tx: 'required',
                    rx: 'required',
                    via: 'net',
                    engine: 'WebRTC'
                };
            }
            if (media === 'VIDEO' || media === 'VOICE') {
                offer.Voice = {
                    tx: 'required',
                    rx: 'required',
                    via: 'net',
                    engine: 'WebRTC'
                };
            }
            this.contact.offerMedia(offer).then(() => {
                this.store.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'READY'} });
                this.dispatch({ type: 'ADD_TEXT', payload: {
                    text: 'CHAT.MEDIA_ACCEPTED',
                    type: 'AGENT-INFO',
                    isEmph: true
                }});
            }, (err) => {
                let reason = 'REJECTED';
                if (err === 'bad_state') {
                    reason = 'FAILED';
                }
                this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'OREQUEST', error: reason }});
                this.dispatch({ type: 'ADD_TEXT', payload: {
                    text: 'SMARTBAR.MEDIA_' + reason,
                    type: 'AGENT-INFO',
                    isError: true
                }});
                setTimeout( () => {
                    this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'READY' }});
                }, this.statusMessageUpdate);
            });
        });
    }
    checkForTranscript() {
        const transcript = this.contact.contact.transcript;
        for (const m in transcript) {
            const msg = transcript[m];
            switch (msg.type) {
                case 'text':
                    this.dispatch({type: 'ADD_TEXT', payload: {text: msg.body, type: 'CHAT_TEXT', isAgent: msg.agent }});
                    break;
                case 'attachment':
                    this.dispatch({
                        type: 'ADD_TEXT',
                        payload: {
                            text: msg.meta.desc,
                            agent: msg.agent ? Object.assign({}, this.agentInfo) : {},
                            type: msg.agent ? 'AGENT-ATTACHMENT' : 'CUSTOMER-ATTACHMENT',
                            meta: msg.meta,
                            url: msg.url,
                            from_nick: msg.from_nick,
                            from_id: msg.from_id
                        }
                    });
                    break;
            }
        }
    }
    createContact(conf) {
        this.dispatch({type: 'INITIAL_OFFER', payload: conf.initial_offer});
        this.vivocha.getContact(conf).then( contact => {
            this.contact = contact;
            this.mapContact();
        });

    }
    denyOffer() {
        this.mediaCallback('error', {});
    }
    /*
    diffOffer(currentOffer, incomingOffer, flat?) {
        let hasAdded = false;
        let hasChanged = false;
        let hasRemoved = false;

        let diff = { added: {}, changed: {}, removed: {} };
        let flatDiff = { added: [], changed: [], removed: [] };
        for (let m in incomingOffer){
            if (currentOffer[m]){
                let changed = false;
                if (currentOffer[m].rx !== incomingOffer[m].rx) changed = true;
                if (currentOffer[m].tx !== incomingOffer[m].tx) changed = true;
                if (currentOffer[m].engine !== incomingOffer[m].engine) changed = true;
                if (currentOffer[m].via !== incomingOffer[m].via) changed = true;
                if (changed){
                    hasChanged = true;
                    diff.changed[m] = incomingOffer[m];
                    flatDiff.changed.push(m);
                }
            }
            else {
                if(incomingOffer[m].rx !== "off") {
                    hasAdded = true;
                    diff.added[m] = incomingOffer[m];
                    flatDiff.added.push(m);
                }
            }
        }
        for (let c in currentOffer){
            if (!incomingOffer[c]){
                hasRemoved = true;
                diff.removed[c] = currentOffer[c];
                flatDiff.removed.push(c);
            }
        }
        if (!hasAdded) delete diff.added;
        if (!hasChanged) delete diff.changed;
        if (!hasRemoved) delete diff.removed;
        return (flat) ? flatDiff : diff;
    }
    */
    dispatch(action) {
        this.zone.run( () => {
            this.store.dispatch(action);
        });
    }
    dispatchConnectionMessages(newMedia) {
        const hasVideo = (newMedia['Video'] &&
                          newMedia['Video']['data'] &&
                          newMedia['Video']['data']['rx_stream']);
                          // (newMedia['Video']['data']['tx_stream'] || newMedia['Video']['data']['rx_stream']));
        const hasVoice = (newMedia['Voice'] &&
                          newMedia['Voice']['data'] &&
                          newMedia['Voice']['data']['tx_stream'] &&
                          newMedia['Voice']['data']['rx_stream']);
        if (!this.widgetState.voice && hasVoice && !hasVideo) {
            console.log('dispatch voice connection');
            this.dispatch({
                type: 'UPDATE_MESSAGE',
                payload: {
                    id: this.incomingId,
                    state: 'closed',
                    text: 'connected'
                }
            });
        }
        if (!this.widgetState.video && !this.widgetState.voice && hasVideo) {
            console.log('dispatch video connection');
            this.dispatch({
                type: 'UPDATE_MESSAGE',
                payload: {
                    id: this.incomingId,
                    media: 'video',
                    state: 'closed',
                    text: 'connected'
                }
            });
            console.log('dispatch video connection 2');
        }
        if (this.widgetState.voice && !hasVoice) {
            console.log('dispatch voice disconnection');
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    media: 'voice',
                    state: 'closed',
                    type: 'incoming-request',
                    text: 'disconnected'
                }
            });
        }
        if (this.widgetState.video && !hasVideo) {
            console.log('dispatch video disconnection');
        }
    }
    downgrade(media) {
        if (media === 'VOICE') {
            this.contact.getMediaOffer().then(mediaOffer => {
                if (mediaOffer['Voice']) {
                    mediaOffer['Voice'].tx = 'off';
                    mediaOffer['Voice'].rx = 'off';
                }
                if (mediaOffer['Video']) {
                    mediaOffer['Video'].tx = 'off';
                    mediaOffer['Video'].rx = 'off';
                }
                this.contact.offerMedia(mediaOffer);
            });
        }
        if (media === 'VIDEO') {
            this.contact.getMediaOffer().then(mediaOffer => {
                if (mediaOffer['Video']) {
                    mediaOffer['Video'].tx = 'off';
                    mediaOffer['Video'].rx = 'off';
                }
                this.contact.offerMedia(mediaOffer);
            });
        }
    }
    getUpgradeState(mediaObject) {
        for (const m in mediaObject) {
            mediaObject[m].rx = (mediaObject[m].rx !== 'off');
            mediaObject[m].tx = (mediaObject[m].tx !== 'off');
        }
        return mediaObject;
    }
    hangup() {
        this.contact.getMediaOffer().then(mediaOffer => {
            if (mediaOffer['Voice']) {
                mediaOffer['Voice'].tx = 'off';
                mediaOffer['Voice'].rx = 'off';
            }
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
                mediaOffer['Video'].rx = 'off';
            }
            this.contact.offerMedia(mediaOffer);
        });
    }
    init(vivocha) {
        this.vivocha = vivocha;
    }
    isIncomingRequest(offer): { askForConfirmation: boolean, offer: VvcOffer, media: string} {
        const resp = { askForConfirmation : false, offer: {}, media: '' };
        for (const i in offer) {
            switch (i) {
                case 'Chat':
                case 'Sharing':
                case 'Voice':
                    if (!this.widgetState[i.toLowerCase()]
                        && offer[i]['tx'] !== 'off'
                        && offer[i]['rx'] !== 'off') {
                        resp.askForConfirmation = true;
                        resp.offer[i] = offer[i];
                    }
                    break;
                case 'Video':
                    if (!this.widgetState[i.toLowerCase()]
                        && ( offer[i]['tx'] !== 'off' || offer[i]['rx'] !== 'off')) {
                        if (!this.widgetState['voice']) {
                            resp.askForConfirmation = true;
                        }
                        resp.offer[i] = offer[i];
                    }
                    break;
            }
        }
        if (resp.offer['Voice']) {
            resp.media = 'voice';
        }
        if (resp.offer['Video']) {
            resp.media = 'video';
        }
        return resp;
    }
    mapContact() {
        console.log('mapping stuff on the contact');
        this.contact.on('action', (action_code, args) => {
            if (action_code === 'DataCollection') {
                this.showDataCollection(args[0].id);
            }
        });
        this.contact.on('attachment', (url, meta, fromId, fromNick, isAgent) => {
            const attachment = {url, meta, fromId, fromNick, isAgent};
            this.dispatch({
                type: 'ADD_TEXT',
                payload: {
                    text: meta.desc,
                    agent: isAgent ? Object.assign({}, this.agentInfo) : {},
                    type: isAgent ? 'AGENT-ATTACHMENT' : 'CUSTOMER-ATTACHMENT',
                    meta: meta,
                    url: (meta.originalUrl) ? meta.originalUrl : url,
                    from_nick: fromNick,
                    from_id: fromId
                }
            });

        });
        this.contact.on('capabilities', function(){
            // console.log('remote capabilities', arguments);
        });
        this.contact.on('iswriting', (from_id, from_nick, agent) => {
            if (agent) {
                clearTimeout(this.isWritingTimer);
                this.dispatch({type: 'ADD_TEXT', payload: { type: 'AGENT-WRITING' }});
                this.isWritingTimer = setTimeout( () => {
                    this.dispatch({type: 'REM_TEXT', payload: { type: 'AGENT-WRITING' }});
                }, this.isWritingTimeout);
            }
        });
        this.contact.on('joined', (c) => {
            if (c.user) {
                this.onAgentJoin(c);
            } else {
                this.onLocalJoin(c);
            }
        });
        this.contact.on('localcapabilities', function(){
            // console.log('localcapabilities', arguments);
        });
        this.contact.on('localtext', (text) => {
            // this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'CHAT_TEXT', isAgent: false}});
            this.dispatch({type: 'NEW_MESSAGE', payload: {text: text, type: 'chat', isAgent: false}});
        });
        this.contact.on('mediachange', (media, changed) => {
            console.log('MEDIACHANGE', media);
            this.dispatchConnectionMessages(media);
            this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
        });
        this.contact.on('mediaoffer', (offer, cb) => {
            console.log('OFFER', offer);
            this.onMediaOffer(offer, cb);
        });
        this.contact.on('text', (text, from_id, from_nick, agent ) => {
            // this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'CHAT_TEXT', isAgent: agent}});
            this.dispatch({type: 'NEW_MESSAGE', payload: {text: text, type: 'chat', isAgent: agent}});
        });
        this.contact.on('transferred', (transferred_to) => {
            this.dispatch({type: 'ADD_TEXT', payload: {
                text: 'CHAT.TRANSFER', type: 'AGENT-INFO'}});
        });
    }
    mergeOffer (diffOffer) {
        for (const m in diffOffer) {
            if (m === 'Video' && diffOffer[m].tx === 'optional') {
                diffOffer[m].tx = 'off';
            }
            diffOffer[m].rx = (diffOffer[m].rx !== 'off');
            diffOffer[m].tx = (diffOffer[m].tx !== 'off');
        }
        this.contact.mergeMedia(diffOffer).then(mergedMedia => {
            this.mediaCallback(undefined, mergedMedia);
        });
    }
    muteAudio(muted) {
        this.contact.getMediaEngine('WebRTC').then( engine => {
            if (muted) {
                engine.muteLocalAudio();
            } else {
                engine.unmuteLocalAudio();
            }
        });
    }
    onAgentJoin(join) {

        this.contact.getMedia().then( (media) => {
            const agent = { user: join.user, nick: join.nick, avatar: join.avatar}
            this.agentInfo = agent;
            this.dispatch({ type: 'JOINED', payload: agent });
            this.dispatch({ type: 'MEDIA_CHANGE', payload: media });

            /*
            this.dispatch({ type: 'WIDGET_STATUS', payload: { state: 'READY' }});
            this.dispatch({ type: 'ADD_AGENT', payload: agent});
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'CHAT.WELCOME',
                type: 'AGENT-INFO', agent: Object.assign({}, this.agentInfo)
            }});
            */
        });
        /*
        const agent = { user: join.user, nick: join.nick, avatar: join.avatar}
        this.agentInfo = agent;
        this.dispatch({ type: 'JOINED', payload: agent });
        */

    }
    onLocalJoin(join) {
        if (join.reason && join.reason == 'resume') {
            this.contact.getMedia().then((media) => {
                this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
                this.dispatch({ type: 'WIDGET_STATUS', payload: {state: 'READY'}});
                this.agentInfo = this.contact.contact.agentInfo;
                this.dispatch({type: 'ADD_AGENT', payload: this.agentInfo});
                this.dispatch({
                    type: 'ADD_TEXT', payload: {
                        text: 'CHAT.WELCOME',
                        type: 'AGENT-INFO', agent: Object.assign({}, this.agentInfo)
                    }
                });
                this.checkForTranscript();
            });
        }
    }
    onMediaOffer(offer, cb) {

        this.mediaCallback = cb;
        const confirmation = this.isIncomingRequest(offer);
        if (confirmation.askForConfirmation) {
            this.incomingId = new Date().getTime();
            this.incomingOffer = confirmation.offer;
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: this.incomingId,
                    media: confirmation.media,
                    state: 'open',
                    text: 'media-requesting',
                    type: 'incoming-request'
                }
            });
        } else {
            this.mergeOffer(offer);
        }
    }
    removeLocalVideo() {
        this.contact.getMediaOffer().then(mediaOffer => {
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
            }
            this.contact.offerMedia(mediaOffer);
        });
    }
    sendAttachment(msg) {
        const ref = new Date().getTime();
        this.contact.attach(msg.file, msg.text).then( () => {
            this.dispatch({ type: 'REM_BY_REF', payload: ref });
        }, () => {
            this.dispatch({ type: 'REM_BY_REF', payload: ref });
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'CHAT.FILE_TRANSFER_FAILED',
                type: 'AGENT-INFO'
            } });
        });
        this.dispatch({
            type: 'ADD_TEXT', payload: {
                text: 'CHAT.FILE_TRANSFER',
                type: 'AGENT-INFO',
                ref: ref
            }
        });
    }
    sendText(text: string) {
        this.contact.sendText(text);
    }
    showDataCollection(dataId) {
        switch (dataId) {
            case 'user':
                this.dispatch({ type: 'NEW_DC', payload: dc2});
                break;
            default: break;
        }
    }
    upgradeMedia(upgradeState) {
        this.contact.mergeMedia(this.getUpgradeState(upgradeState)).then( (mergedMedia) => {
            if (this.mediaCallback) {
                this.mediaCallback(null, mergedMedia);
            }
        });
    }
}
