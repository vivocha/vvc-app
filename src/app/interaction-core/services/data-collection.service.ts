import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {VvcUiService} from './ui.service';
import {objectToDataCollection} from '@vivocha/global-entities/dist/wrappers/data_collection';

@Injectable()
export class VvcDataCollectionService {
  private vivocha;
  private context;

  contactOptions = { data : [] };
  selectedIdx = 0;
  constructor(private store: Store<fromStore.AppState>, private uiService: VvcUiService){

  }
  onDataCollectionCompleted(context){
    this.context = context;
    return this.store.select(fromStore.getDataCollectionCompleted);
  }
  processDataCollections(){
    if (!this.hasDataCollection()) {
      this.store.dispatch(new fromStore.DataCollectionCompleted({}));
      this.uiService.setDataCollectionCompleted();
    } else {
      this.processDcByIdx(0);
    }
  }
  processDcByIdx(idx){
    this.selectedIdx = idx;
    this.store.dispatch(new fromStore.DataCollectionSelected(this.context.dataCollections[idx]));
    this.uiService.setDataCollectionPanel(true, this.context.dataCollections[idx].labelId);
  }

  hasDataCollection(){
    if (this.context.dataCollections && this.context.dataCollections.length > 0) {
      this.store.dispatch(new fromStore.DataCollectionLoaded(this.context.dataCollections));
      return true;
    }
    return false;
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
      this.store.dispatch(new fromStore.DataCollectionCompleted(this.contactOptions));
      this.uiService.setDataCollectionCompleted();
    }
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
    this.store.dispatch(new fromStore.InitializeDataCollections(dataCollections));
    this.store.dispatch(new fromStore.ShowDataCollection(0));
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
    //this.store.dispatch(new fromStore.WidgetDataCollectionFilled({ id: dcId, dc: dataCollection }));
  }
  */
}