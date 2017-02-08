import {VvcMediaState, VvcMediaOffer, VvcAgent, ChatMsg, WidgetState, DataCollectionState} from './core.interfaces';

export const widgetState = (state: WidgetState = {state: 'LOADING'}, {type, payload}) => {
    switch (type) {
        case 'WIDGET_STATUS':
            return payload;
        default: return state;
    }
};
export const mediaState = (state: VvcMediaState, {type, payload}) => {
    switch (type) {
        case 'MEDIA_CHANGE':
            state = Object.assign({}, payload);
            return state;
        default:
            return state;
    }
};
export const mediaOffer = (state: VvcMediaOffer, {type, payload}) => {
    switch (type) {
        case 'MEDIA_OFFER':
            return Object.assign({}, payload);
        default:
            return {};
    }
};
export const agent = (currentAgent: VvcAgent, {type, payload}) => {
    switch (type) {
        case 'ADD_AGENT':
            console.log('ADD_AGENT', payload);
            currentAgent = Object.assign({}, payload);
            return currentAgent;
        default:
            return currentAgent;
    }
};
export const chatMessages = (messages: Array<ChatMsg> = [], {type, payload}) => {
    switch (type) {
        case 'ADD_TEXT':
            const isWriting = messages.filter( msg => msg.type === 'AGENT-WRITING');
            if (isWriting.length > 0) {
                const payloads = [payload];
                if (payload.agent === false) {
                    payloads.push(isWriting[0]);
                }
                messages = messages.filter( msg => msg.type !== 'AGENT-WRITING').concat(...payloads);
            } else {
                messages = messages.concat(payload);
            }
            return messages;
        case 'REM_TEXT':
            if (payload.type === 'AGENT-WRITING') {
                messages = messages.filter(msg => msg.type !== 'AGENT-WRITING');
            }
            return messages;
        case 'REM_BY_REF':
            messages = messages.filter(msg => msg.ref === payload.ref);
            return messages;
        case 'UPDATE_BY_REF':
            return messages.map( msg => {
                return (msg.ref === payload.ref) ? Object.assign({}, msg, payload) : msg;
            });
        default:
            return messages;
    }
};
export const dataCollections = (dc: DataCollectionState = {state: 'hidden'}, {type, payload}) => {
    switch (type) {
        case 'NEW_DC':
            return payload;
        default:
            return dc;
    }
};
