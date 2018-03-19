import {Injectable} from '@angular/core';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import {ClientContactCreationOptions} from '@vivocha/global-entities/dist/contact';
import {VvcContextService} from './context.service';

@Injectable()
export class VvcDataCollectionService {
  private vivocha;

  constructor(private store: Store<fromStore.AppState>){
    /*
    this.store.select(fromStore.getPushedDataCollections).subscribe( data => {
      //if (data.filledDataCollections.length === data.availableDcLength) this.sendDataCollections(data.filledDataCollections);
    })
    */
  }

  collectDc(context){
    console.log('found', context.dataCollections[0]);
  }
  showDcWithRecall(){

  }
  showRecall(){

  }
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