import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class VvcDataCollectionService {

    private initialDataCollection = {
        saveButton : 'DC.D1.SUBMIT',
        dataTitle: 'DC.D1.DATA_TITLE',
        dataDescr: 'DC.D1.DATA_DESCRIPTION',
        data: [
            { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'},
            { id: 'surname', name: 'DC.D1.SURNAME', type: 'text', required: true, placeholder: 'DC.D1.SURNAME_PH'},
            { id: 'email', name: 'DC.D1.EMAIL', type: 'email', required: true, placeholder: 'DC.D1.EMAIL_PH'},
        ]
    };
    private survey = {
        saveButton : 'SURVEY.SUBMIT',
        dataTitle: 'SURVEY.TITLE',
        data: [
            { id: 'rating', type: 'rating-bar', required: true, name: 'SURVEY.RATING' },
            { id: 'email', type: 'email', name: 'SURVEY.EMAIL', placeholder: 'SURVEY.EMAIL_PH'}
        ]
    };
    private blockDataCollection = {
        mode: 'block',
        saveButton : 'DC.D1.SUBMIT',
        dataTitle: 'DC.D1.DATA_TITLE',
        dataDescr: 'DC.D1.DATA_DESCRIPTION',
        data: [
            { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'},
            { id: 'surname', name: 'DC.D1.SURNAME', type: 'text', required: true, placeholder: 'DC.D1.SURNAME_PH'},
            { id: 'email', name: 'DC.D1.EMAIL', type: 'email', required: true, placeholder: 'DC.D1.EMAIL_PH'},
        ]
    };
    private inlineDataCollection = {
        mode: 'inline',
        saveButton : 'DC.D1.SUBMIT',
        dataTitle: 'DC.D1.DATA_TITLE',
        data: [
            { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'}
        ]
    };
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
        let dc;
        dc = this.survey;
        dc['id'] = dcId;
        return Observable.of(dc).delay(1000).toPromise();
    }
}
