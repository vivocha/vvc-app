import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class VvcDataCollectionService {

    private initialDataCollection = {
        saveButton : 'DC.D1.SUBMIT',
        data: [
            { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'},
            { id: 'surname', name: 'DC.D1.SURNAME', type: 'text', required: true, placeholder: 'DC.D1.SURNAME_PH'},
            { id: 'email', name: 'DC.D1.EMAIL', type: 'email', placeholder: 'DC.D1.EMAIL_PH'},
        ]
    }
    private survey = {
        saveButton : 'DC.S1.SUBMIT',
        data: [
            { id: 'rating', type: 'rating-bar', required: true, name: 'DC.S1.RATING' },
            { id: 'email', type: 'email', name: 'DC.S1.EMAIL', placeholder: 'DC.S1.EMAIL_PH'}
        ]
    }
    private blockDataCollection = {
        mode: 'block',
        data: [

        ]
    }
    private inlineDataCollection = {
        mode: 'inline',
        data: [

        ]
    }
    constructor() {

    }

    loadDataCollection(dcId) {
        let dc;
        switch (dcId) {
            case 'dc#inline' :
                dc = this.inlineDataCollection;
                break;
            case 'dc#block'  :
                dc = this.blockDataCollection;
                break;
            case 'schema#data-id':
                dc = this.initialDataCollection;
                break;
            case 'schema#survey-id' :
                dc = this.survey;
                break;
        }
        dc['id'] = dcId;
        return Observable.of(dc).delay(1000).toPromise();
    }
    loadSurvey(dcId, askForTranscript) {
        const dc = {
            id: dcId,
            type: 'block',
            data: [
                { type: 'rating-bar', id: 'gradimento', label: 'SURVEY.TITLE' }
            ]
        };
        if (askForTranscript) {
            dc.data.push({ type: 'email', id: 'email', label: 'SURVEY.TRANSCRIPT_EMAIL'})
        }
        return Observable.of(dc).delay(1000).toPromise();
    }
}
