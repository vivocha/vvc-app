import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class VvcDataCollectionService {
    constructor() {

    }

    loadDataCollection(dcId) {
        const dc = {
            id: dcId
        };
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
