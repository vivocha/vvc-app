import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, VvcWidgetState, VvcOffer, DataCollectionState} from './core.interfaces';

const dc2: DataCollectionState = {
    state: 'visible',
    dataCollection: {
        key: 'DC.USER.TITLE',
        type: 'dc',
        inline: false,
        name: 'data_collection',
        desc: 'Initial Data Collection',
        data: [
            {
                key: 'DC.USER.NICKNAME',
                controlType: 'vvc-input',
                name: 'codiceUtente',
                desc: 'identificativo utente',
                type: 'nickname',
                config: {
                    required: true,
                    min: 5
                },
                visible: true
            },
            {
                key: 'DC.USER.USERID',
                controlType: 'vvc-input',
                name: 'polizzaUtente',
                desc: 'codice polizza utente',
                type: 'text',
                config: {
                    required: true,
                    min: 3,
                    max: 3
                },
                visible: true
            },
            {
                key: 'DC.USER.USERID',
                controlType: 'vvc-input',
                name: 'polizzaUtente2',
                desc: 'codice polizza utente2',
                type: 'text',
                config: {
                    required: true,
                    min: 3,
                    max: 3
                },
                visible: true
            },
            {
                key: 'DC.USER.PRIVACY.LABEL',
                controlType: 'vvc-privacy',
                name: 'privacy',
                desc: 'accetta privacy',
                type: 'privacy',
                config: {
                    required: true,
                },
                policy: {
                    key: 'DC.USER.PRIVACY.POLICY',
                    linkLabel: 'DC.USER.PRIVACY.LINK'

                }
            }
        ]
    }
};

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
    callStartedWith;
    private widgetState: VvcWidgetState;


    constructor( private store: Store<AppState>,
                 private zone: NgZone) {
       store.subscribe( state => {
           this.widgetState = <VvcWidgetState> state.widgetState;
       });
    }
    acceptOffer(opts) {
        const diffOffer = this.incomingOffer;
        this.callStartedWith = 'VOICE';
        if (opts === 'voice-only' && diffOffer.Video) {
            diffOffer.Video.tx = 'off';
            this.callStartedWith = 'VIDEO';
        }
        if (opts === 'video-full' && diffOffer.Video) {
            diffOffer.Video.tx = 'required'; // TODO CHECK FOR CAPS
            this.callStartedWith = 'VIDEO';
        }
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
        if (transcript && transcript.length > 0) {
            this.dispatch({type: 'REDUCE_TOPBAR'});
        }
        for (const m in transcript) {
            const msg = transcript[m];
            switch (msg.type) {
                case 'text':
                    this.dispatch({type: 'NEW_MESSAGE', payload: {text: msg.body, type: 'chat', isAgent: msg.agent}});
                    break;
                case 'attachment':
                    this.dispatch({type: 'NEW_MESSAGE', payload: {
                        text: msg.meta.desc || msg.meta.originalName,
                        type: 'chat',
                        isAgent: msg.agent,
                        meta: msg.meta,
                        url: (msg.meta.originalUrl) ? msg.meta.originalUrl : msg.url,
                        from_nick: msg.from_nick,
                        from_id: msg.from_id
                    }});
                    break;
            }
        }
    }
    clearIsWriting() {
        clearTimeout(this.isWritingTimer);
        this.dispatch({type: 'REM_IS_WRITING'});
        this.dispatch({type: 'AGENT_IS_WRITING', payload: false });
    }
    closeContact() {
        this.contact.leave();
    }
    createContact(conf) {
        this.dispatch({type: 'INITIAL_OFFER', payload: { offer: conf.initial_offer, opts: conf.opts }});

        this.vivocha.getContact(conf).then( contact => {
            contact.getLocalCapabilities().then( caps => {
                this.dispatch({type: 'LOCAL_CAPS', payload: caps });
            });
            contact.getRemoteCapabilities().then( caps => {
                this.dispatch({type: 'REMOTE_CAPS', payload: caps });
            });
            this.contact = contact;
            this.mapContact();
        });

    }
    denyOffer(media) {
        this.mediaCallback('error', {});
        this.dispatch({
            type: 'REM_MESSAGE',
            payload: {
                id: this.incomingId

            }
        });
        this.dispatch({
            type: 'NEW_MESSAGE',
            payload: {
                id: new Date().getTime(),
                type: 'incoming-request',
                media: media,
                state: 'closed',
                extraClass: 'rejected',
                text: 'MESSAGES.' + media + '_REJECTED'
            }
        });
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
        const hasVoice = !!(newMedia['Voice'] &&
                          newMedia['Voice']['data'] &&
                          newMedia['Voice']['data']['tx_stream'] &&
                          newMedia['Voice']['data']['rx_stream']);

        if (!this.widgetState.voice && hasVoice) {
            this.dispatch({ type: 'REM_MESSAGE', payload: { id: this.incomingId }});
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: this.callStartedWith,
                    state: 'closed',
                    extraClass: 'accepted',
                    text: 'MESSAGES.' + this.callStartedWith + '_STARTED'
                }
            });
        }
        if (this.widgetState.voice && !hasVoice) {
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: this.callStartedWith,
                    state: 'closed',
                    extraClass: 'accepted',
                    text: 'MESSAGES.' + this.callStartedWith + '_ENDED'
                }
            });
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
            resp.media = 'VOICE';
        }
        if (resp.offer['Video']) {
            resp.media = 'VIDEO';
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
            this.dispatch({type: 'NEW_MESSAGE', payload: {
                text: meta.desc || meta.originalName,
                type: 'chat',
                isAgent: isAgent,
                meta: meta,
                url: (meta.originalUrl) ? meta.originalUrl : url,
                from_nick: fromNick,
                from_id: fromId
            }});

        });
        this.contact.on('capabilities', caps => {
            this.dispatch({type: 'REMOTE_CAPS', payload: caps });
        });
        this.contact.on('iswriting', (from_id, from_nick, agent) => {
            if (agent) {
                this.setIsWriting();
            }
        });
        this.contact.on('joined', (c) => {
            if (c.user) {
                this.onAgentJoin(c);
            } else {
                this.onLocalJoin(c);
            }
        });
        this.contact.on('localcapabilities', caps => {
            this.dispatch({type: 'LOCAL_CAPS', payload: caps });
        });
        this.contact.on('localtext', (text) => {
            this.dispatch({type: 'NEW_MESSAGE', payload: {text: text, type: 'chat', isAgent: false}});
        });
        this.contact.on('mediachange', (media, changed) => {
            this.dispatchConnectionMessages(media);
            this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
        });
        this.contact.on('mediaoffer', (offer, cb) => {
            this.onMediaOffer(offer, cb);
        });
        this.contact.on('text', (text, from_id, from_nick, agent ) => {
            // this.dispatch({type: 'ADD_TEXT', payload: {text: text, type: 'CHAT_TEXT', isAgent: agent}});
            this.dispatch({type: 'REDUCE_TOPBAR'});
            this.dispatch({type: 'NEW_MESSAGE', payload: {text: text, type: 'chat', isAgent: agent}});
            this.clearIsWriting();
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
        this.dispatch({ type: 'MUTE_IN_PROGRESS', payload: true });
        this.contact.getMediaEngine('WebRTC').then( engine => {
            if (muted) {
                engine.muteLocalAudio();
            } else {
                engine.unmuteLocalAudio();
            }
            this.dispatch({ type: 'MUTE_IN_PROGRESS', payload: false });
            this.dispatch({ type: 'MUTE', payload: muted });
        });
    }
    onAgentJoin(join) {
        this.contact.getMedia().then( (media) => {
            const agent = { user: join.user, nick: join.nick, avatar: join.avatar};
            this.agentInfo = agent;
            this.dispatch({ type: 'JOINED', payload: agent });
            this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
        });
    }
    onLocalJoin(join) {
        if (join.reason && join.reason === 'resume') {
            this.contact.getMedia().then((media) => {
                const agent = this.contact.contact.agentInfo;
                this.dispatch({ type: 'JOINED', payload: agent });
                this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
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
                    type: 'incoming-request',
                    text: 'MESSAGES.' + confirmation.media + '_REQUEST'
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
            this.dispatch({type: 'REM_MESSAGE', payload: {id: ref}});
        }, () => {
            this.dispatch({type: 'REM_MESSAGE', payload: {id: ref}});
            /*
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'CHAT.FILE_TRANSFER_FAILED',
                type: 'AGENT-INFO'
            } });
            */
        });
        this.dispatch({type: 'NEW_MESSAGE', payload: {id: ref, state: 'uploading', type: 'chat', isAgent: false}});
    }
    sendText(text: string) {
        this.contact.sendText(text);
    }
    setIsWriting() {
        clearTimeout(this.isWritingTimer);
        this.dispatch({type: 'AGENT_IS_WRITING', payload: true });
        this.dispatch({type: 'NEW_MESSAGE', payload: { type: 'chat', state: 'iswriting', isAgent: true}})
        this.isWritingTimer = setTimeout( () => {
            //this.dispatch({type: 'REM_TEXT', payload: { type: 'AGENT-WRITING' }});
            this.dispatch({type: 'REM_IS_WRITING'});
            this.dispatch({type: 'AGENT_IS_WRITING', payload: false });
        }, this.isWritingTimeout);
    }
    showDataCollection(dataId) {
        switch (dataId) {
            case 'user':
                this.dispatch({ type: 'NEW_MESSAGE', payload: {
                    dataCollection: dc2.dataCollection,
                    type: 'incoming-request',
                    id: new Date().getTime(),
                    state: 'open',
                    text: 'The agent has sent you a form to compile'
                }});
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
