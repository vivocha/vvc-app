import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, VvcWidgetState, VvcOffer} from './core.interfaces';
import {VvcDataCollectionService} from './dc.service';

@Injectable()
export class VvcContactService {

    vivocha;
    agentInfo;
    contact;
    isWritingTimer;
    isWritingTimeout = 30000;
    mediaCallback;
    incomingOffer: VvcOffer;
    incomingId;
    callStartedWith;
    voiceStart = new EventEmitter();
    widgetState: VvcWidgetState;


    constructor( private store: Store<AppState>,
                 private zone: NgZone,
                 private dcserv: VvcDataCollectionService) {
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
    askForUpgrade(media, startedWith) {
        this.callStartedWith = startedWith;
        this.dispatch({
            type: 'MEDIA_OFFERING',
            payload: true
        });
        if (media === startedWith) {
            this.incomingId = new Date().getTime();
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: this.incomingId,
                    media: this.callStartedWith,
                    state: 'loading',
                    type: 'incoming-request'
                }
            });
        }
        return this.contact.getMediaOffer().then(offer => {
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
            return this.contact.offerMedia(offer).then(() => {
                this.dispatch({ type: 'MEDIA_OFFERING', payload: false });
            }, (err) => {
                let reason = 'REJECTED';
                if (err === 'bad_state') {
                    reason = 'FAILED';
                }
                this.dispatch({ type: 'MEDIA_OFFERING', payload: false });
                this.dispatch({ type: 'REM_MESSAGE', payload: { id: this.incomingId } });
                this.dispatch({
                    type: 'NEW_MESSAGE',
                    payload: {
                        id: new Date().getTime(),
                        type: 'incoming-request',
                        media: this.callStartedWith,
                        state: 'closed',
                        extraClass: 'rejected',
                        text: 'MESSAGES.REMOTE_' + this.callStartedWith + '_' + reason
                    }
                });
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
    collectInitialData(conf) {
        this.dcserv.loadDataCollection(conf.opts.dataCollection.dataToCollect).then( dc => {
            this.dispatch({type: 'INITIAL_DATA', payload: dc });
        });
    }
    createContact(conf) {
        this.callStartedWith = conf.type.toUpperCase();
        this.dispatch({type: 'INITIAL_OFFER', payload: { offer: conf.initial_offer, opts: conf.opts }});

        this.vivocha.getContact(conf).then( contact => {
            console.log('contact created, looking for the caps');
            contact.getLocalCapabilities().then( caps => {
                this.dispatch({type: 'LOCAL_CAPS', payload: caps });
            });
            contact.getRemoteCapabilities().then( caps => {
                this.dispatch({type: 'REMOTE_CAPS', payload: caps });
            });
            this.contact = contact;
            this.mapContact();
            if (conf.type !== 'chat') {
                this.voiceStart.emit();
            }
        }, (err) => {
            console.log('Failed to create contact', err);
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
    getUpgradeState(mediaObject) {
        for (const m in mediaObject) {
            mediaObject[m].rx = (mediaObject[m].rx !== 'off');
            mediaObject[m].tx = (mediaObject[m].tx !== 'off');
        }
        return mediaObject;
    }
    fetchDataCollection(id) {
        this.dcserv.loadDataCollection(id).then( dc => {
            this.dispatch({ type: 'ADD_DATA_COLLECTION', payload: dc });
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: 'DC',
                    state: 'open',
                    dataCollectionId: dc.id
                    // dataCollection: dc
                }
            });
        });
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
                // this.showDataCollection(args[0].id);
                this.fetchDataCollection(args[0].id);
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
        this.contact.on('left', obj => {
            console.log('LEFT', obj);
            if (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) {
                this.sendCloseMessage();
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
            this.dispatch({type: 'REDUCE_TOPBAR'});
            this.dispatch({type: 'NEW_MESSAGE', payload: {text: text, type: 'chat', isAgent: agent}});
            if (this.widgetState && this.widgetState.minimized) {
                this.dispatch({type: 'INCREMENT_NOT_READ'});
            }
            this.playAudioNotification();
            this.clearIsWriting();
        });
        this.contact.on('transferred', (transferred_to) => {
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: 'TRANSFER',
                    state: 'closed',
                    extraClass: 'rejected',
                    text: 'MESSAGES.TRANSFERRED'
                }
            });
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
    playAudioNotification() {
        const notif = new Audio();
        notif.src = 'assets/beep.mp3';
        notif.load();
        notif.play();
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
    sendCloseMessage() {
        this.dispatch({
            type: 'NEW_MESSAGE',
            payload: {
                id: new Date().getTime(),
                type: 'incoming-request',
                media: 'AGENTCLOSE',
                state: 'closed',
                extraClass: 'rejected',
                text: 'MESSAGES.REMOTE_CLOSE'
            }
        });
        this.dispatch({
            type: 'CLOSE_CONTACT',
            payload: true
        });
    }
    sendData(initialConf) {
        setTimeout( () => {
            console.log('sending data');
            this.dispatch({ type: 'INITIAL_DATA_SENT' });
            this.createContact(initialConf);
        }, 1000);
    }
    sendDataCollection(obj) {
        const dc = obj.dataCollection;
        const message = obj.msg;

        this.dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                id: message.id,
                state: 'closed'
            }
        });
        this.dispatch({
            type: 'MERGE_DATA_COLLECTION',
            payload: dc
        });
    }
    sendText(text: string) {
        this.contact.sendText(text);
    }
    setIsWriting() {
        clearTimeout(this.isWritingTimer);
        this.dispatch({type: 'AGENT_IS_WRITING', payload: true });
        this.dispatch({type: 'NEW_MESSAGE', payload: { type: 'chat', state: 'iswriting', isAgent: true}});
        this.isWritingTimer = setTimeout( () => {
            this.dispatch({type: 'REM_IS_WRITING'});
            this.dispatch({type: 'AGENT_IS_WRITING', payload: false });
        }, this.isWritingTimeout);
    }
    showSurvey(surveyId, askForTranscript) {
        this.dcserv.loadSurvey(surveyId, askForTranscript).then( (dc) => {
            this.dispatch({ type: 'SHOW_SURVEY', payload: dc});
        });

    }
    syncDataCollection(dataCollection) {
        this.dispatch({
            type: 'MERGE_DATA_COLLECTION',
            payload: dataCollection
        });
    }
    upgradeMedia(upgradeState) {
        this.contact.mergeMedia(this.getUpgradeState(upgradeState)).then( (mergedMedia) => {
            if (this.mediaCallback) {
                this.mediaCallback(null, mergedMedia);
            }
        });
    }
}
