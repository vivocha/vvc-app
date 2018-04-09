import {Injectable} from '@angular/core';
import {AppState} from '../store/reducers/main.reducer';
import {getDataCollectionCompleted} from '../store/selectors/data-collection.selectors';
import {DataCollectionCompleted,DataCollectionSelected,DataCollectionLoaded} from '../store/actions/dataCollection.actions';
import {getSurveyCompleted} from '../store/selectors/survey.selectors';
import {SurveyLoaded,SurveySelected} from '../store/actions/survey.actions';
import {Store} from '@ngrx/store';
import {VvcUiService} from './ui.service';
import {objectToDataCollection} from '@vivocha/global-entities/dist/wrappers/data_collection';
import {Observable} from 'rxjs/Observable';
import {DataCollectionState, SurveyState} from '../store/models.interface';

@Injectable()
export class VvcDataCollectionService {
  private context;

  contactOptions = { data : [] };
  selectedIdx = 0;
  constructor(private store: Store<AppState>, private uiService: VvcUiService){

  }
  onDataCollectionCompleted(context):Observable<DataCollectionState>{
    this.context = context;
    return this.store.select(getDataCollectionCompleted);
  }
  onSurveyCompleted():Observable<SurveyState>{
    return this.store.select(getSurveyCompleted);
  }
  processDataCollections(){
    if (!this.hasDataCollection()) {
      this.store.dispatch(new DataCollectionCompleted({}));
      this.uiService.setDataCollectionCompleted();
    } else {
      this.processDcByIdx(0);
    }
  }
  processDcByIdx(idx){
    this.selectedIdx = idx;
    this.store.dispatch(new DataCollectionSelected(this.context.dataCollections[idx]));
    if (this.hasVisibleFields(this.context.dataCollections[idx])) {
      this.uiService.setDataCollectionPanel(true, this.context.dataCollections[idx].labelId);
    }
    else {
      this.submitHiddenDataCollection(this.context.dataCollections[idx]);
    }
  }

  hasDataCollection(){
    if (this.context.dataCollections && this.context.dataCollections.length > 0) {
      this.store.dispatch(new DataCollectionLoaded(this.context.dataCollections));
      return true;
    }
    return false;
  }
  hasSurvey(){
    return (this.context.survey);
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
    /*
    for (let i = 0; i < dataCollection.fields.length; i++) {
      if (dataCollection.fields[i].format === 'nickname' && data[dataCollection.fields[i].id]) {
        this.contactOptions.nick = data[dataCollection.fields[i].id];
        break;
      }
    }*/
    this.contactOptions.data.push(objectToDataCollection(data, dataCollection.id, dataCollection));
    if (this.context.dataCollections[this.selectedIdx+1]) this.processDcByIdx(this.selectedIdx+1);
    else {
      this.store.dispatch(new DataCollectionCompleted(this.contactOptions));
      this.uiService.setDataCollectionCompleted();
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
   this.store.dispatch(new SurveyLoaded(survey));
   this.uiService.setSurveyCompleted();
  }
/*
  collectDc(context){
    console.log('found', context.dataCollections[0]);
  }
  dcAlreadyFilled(){

  }
  showDcWithRecall(){

  }
  showRecall(){

  }
  */
  /*
  showDataCollections(vivocha, dataCollections){
    this.vivocha = vivocha;
    this.store.dispatch(new WidgetShowDc(dataCollections));
    this.store.dispatch(new InitializeDataCollections(dataCollections));
    this.store.dispatch(new ShowDataCollection(0));
  }

  sendDataCollections(dataCollections: any[], contactOptions){
    const opts = Object.assign(contactOptions);
    dataCollections.forEach( dc => {
      dc.fields.forEach( f => {
        if (f.format === 'nickname' && f.id) opts['nick'] = f.id;
      })
    });
    this.vivocha.pageRequest('interactionCreation', opts, (opts: ClientContactCreationOptions) => {
      console.log('pre-routing callback', opts);
      //this.createContact(contactOptions);
    });
  }
  submitDataCollection(dcId: string, dataCollection: any){
    //this.store.dispatch(new WidgetDataCollectionFilled({ id: dcId, dc: dataCollection }));
  }
  */
}