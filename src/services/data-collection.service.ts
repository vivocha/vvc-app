import {Injectable} from '@angular/core';
import {AppState, getDataCollectionState, getSurveyState} from '../store/reducers/main.reducer';
import {SurveyCompleted,SurveySelected} from '../store/actions/survey.actions';
import {Store} from '@ngrx/store';
import {VvcUiService} from './ui.service';
import {objectToDataCollection} from '@vivocha/global-entities/dist/wrappers/data_collection';
import {Observable} from 'rxjs/Observable';
import {DataCollectionState, SurveyState} from '../store/models.interface';

@Injectable()
export class VvcDataCollectionService {
  private context;

  contactOptions: any = { data : [] };
  selectedIdx = 0;
  constructor(private store: Store<AppState>, private uiService: VvcUiService){

  }
  setInitialContext(context){
    this.context = context;
  }
  onDataCollectionCompleted():Observable<DataCollectionState>{
    return this.store.select(getDataCollectionState);
  }
  onSurveyCompleted():Observable<SurveyState>{
    return this.store.select(getSurveyState);
  }
  processDataCollections(){
    if (!this.hasDataCollection()) {
      this.uiService.setDataCollectionCompleted({});
    } else {
      this.processDcByIdx(0);
    }
  }
  processDcByIdx(idx){
    this.selectedIdx = idx;
    if (this.hasVisibleFields(this.context.dataCollections[idx])) {
      this.uiService.selectDataCollection(this.context.dataCollections[idx]);
    }
    else {
      this.submitHiddenDataCollection(this.context.dataCollections[idx]);
    }
  }
  hasDataCollection(){
    if (this.context.dataCollections && this.context.dataCollections.length > 0) {
      this.uiService.loadDataCollections(this.context.dataCollections);
      return true;
    }
    return false;
  }
  hasSurvey(){
    return this.context && !!this.context.survey;
  }
  hasVisibleFields(dc){
    let visibleFields = false;
    if (dc.fields){
      dc.fields.forEach( elem => {
        const hasDefault = typeof elem.defaultConstant !== 'undefined';
        if ((['visitor','both'].indexOf(elem.hidden) === -1 && (!hasDefault || (hasDefault && elem.editIfDefault)))) {
          visibleFields = true;
        }
      });
    }
    return visibleFields;
  }
  showSurvey(){
    if (this.hasSurvey()) {
      this.store.dispatch(new SurveySelected(this.context.survey));
      this.uiService.setSurveyPanel();
    }
  }
  submitDataCollection(dc){
    const dataCollection = dc.dcDefinition;
    const data = dc.dcData;
    for (let i = 0; i < dataCollection.fields.length; i++) {
      if (dataCollection.fields[i].format === 'nickname' && data[dataCollection.fields[i].id]) {
        this.contactOptions.nick = data[dataCollection.fields[i].id];
        break;
      }
    }
    this.contactOptions.data.push(objectToDataCollection(data, dataCollection.id, dataCollection));
    if (this.context.dataCollections[this.selectedIdx+1]) this.processDcByIdx(this.selectedIdx+1);
    else {
      this.uiService.setDataCollectionCompleted(this.contactOptions);
    }
  }
  submitHiddenDataCollection(dc){
    let data = {};
    if (dc.fields){
      dc.fields.forEach( elem => {
        const hasDefault = typeof elem.defaultConstant !== 'undefined';
        data[elem.id] = hasDefault ? elem.defaultConstant.toString() : elem.defaultConstant;
      });
    }
    const dataCollection = {
      dcDefinition : dc,
      dcData: data
    };
    this.submitDataCollection(dataCollection);
  }
  submitSurvey(survey){
   this.store.dispatch(new SurveyCompleted(survey));
  }
}