import {Injectable} from '@angular/core';
import {AppState} from '../store/reducers/main.reducer';
import {Store} from '@ngrx/store';
import {VvcUiService} from './ui.service';
import {objectToDataCollection} from '@vivocha/public-entities/dist/wrappers/data_collection';
import {Observable} from 'rxjs';
import {DataCollectionCompleted} from '../store/models.interface';
import {getDataCollectionCompleted} from '../store/selectors/widget.selectors';
import {
  DataCollectionAdded, DataCollectionEnd,
  DataCollectionInitialized, DataCollectionResolved,
  DataCollectionSelected, DataCollectionShowPanel
} from '../store/actions/dataCollection.actions';
import {VvcMessageService} from './messages.service';


@Injectable()
export class VvcDataCollectionService {
  private context;
  private vivocha;
  collectorAgent;
  contactOptions: any = { data : [] };
  selectedIdx = 0;
  collectorRef;
  dcType: 'dc' | 'recontact' | 'survey' = 'dc';
  dcRefs = [];
  constructor(
    private store: Store<AppState>,
    private uiService: VvcUiService,
    private messageService: VvcMessageService) {

  }
  setCollectorAgent() {
    this.collectorAgent = {
      avatar: this.context.variables.collectorDefaultAvatar,
      id: 'collector',
      nick: 'collector',
      is_agent: false,
      is_bot: true
    };
  }
  setInitialContext(context, vivocha) {
    this.context = context;
    this.vivocha = vivocha;
    this.setCollectorAgent();
    this.store.dispatch(new DataCollectionInitialized({
      dataCollectionIds: this.context.dataCollectionIds || [],
      surveyId: this.context.surveyId
    }));
  }
  onDataCollectionCompleted(): Observable<DataCollectionCompleted> {
    return this.store.select(getDataCollectionCompleted);
  }
  async processDataCollections() {
    if (!this.hasDataCollection()) {
      this.store.dispatch(new DataCollectionEnd({ type: 'dc' }));
    } else {
      // this.uiService.setUiReady();
      this.dcRefs = await this.vivocha.pageRequest('mergeDataCollections', this.context.dataCollectionIds);
      this.processDcByIdx(0);
    }
  }

  async processDcById(id, type) {
    const dcRef = await this.vivocha.pageRequest('prepareDataCollectionById', id);
    // console.log('processing dc', id, type, dcRef);
    this.processDcByRef(dcRef, type);
  }
  async processDcByIdx(idx) {
    this.selectedIdx = idx;
    const dcRef = this.dcRefs[this.selectedIdx];
    this.processDcByRef(dcRef);
  }
  async processDcByRef(dcRef, dcType?) {
    if (dcType) {
      this.dcType = dcType;
    }
    this.store.dispatch(new DataCollectionAdded(dcRef));
    if (dcRef.type === 'form') {
      const dc = await this.vivocha.pageRequest('prepareDataCollection', dcRef);
      if (this.hasVisibleFields(dc)) {
        this.uiService.setUiReady();
        this.store.dispatch(new DataCollectionSelected({ dc: dc, type: this.dcType }));
        this.store.dispatch(new DataCollectionShowPanel(true));
      } else {
        this.submitHiddenDataCollection(dc);
      }
    } else {
      this.uiService.setUiReady();
      this.store.dispatch(new DataCollectionSelected({ dc: dcRef, type: this.dcType}));
      this.store.dispatch(new DataCollectionShowPanel(false));
      this.collectorRef = await this.vivocha.pageRequest('createCollector', dcRef);
      this.uiService.setDialogUi();
      this.sendMessageViaCollector(false, '');
    }
  }
  processRecontact() {
    this.store.dispatch(new DataCollectionEnd({type: 'recontact', contactCreateOptions: this.contactOptions}));
  }
  hasDataCollection() {
    return (this.context.dataCollectionIds && this.context.dataCollectionIds.length > 0);
  }
  hasSurvey() {
    return this.context && !!this.context.surveyId;
  }
  hasVisibleFields(dc) {
    let visibleFields = false;
    if (dc.fields) {
      dc.fields.forEach( elem => {
        const hasDefault = (typeof elem.defaultConstant !== 'undefined') && elem.defaultConstant != null;
        if ((['visitor', 'both'].indexOf(elem.hidden) === -1 && (!hasDefault || (hasDefault && elem.editIfDefault)))) {
          visibleFields = true;
        }
      });
    }
    return visibleFields;
  }

  async sendMessageViaCollector(isTemplate, message, payload?) {
    if (this.collectorRef) {
      let resp;
      if (isTemplate) {
        resp = await this.collectorRef.onPostback(message, payload);
      } else {
        resp = await this.collectorRef.onText(message, payload);
      }
      resp.forEach( (m) => {
        this.messageService.addDialogMessage(m, this.collectorAgent);
      });
      if (await this.collectorRef.completed()) {
        const data = await this.vivocha.pageRequest(
          'spreadCollectedData',
          await this.collectorRef.data(),
          await this.collectorRef.definition()
        );
        if (this.dcType === 'dc' && this.dcRefs && this.dcRefs[this.selectedIdx + 1]) {
          this.contactOptions.data = [...this.contactOptions.data, ...data];
          this.processDcByIdx(this.selectedIdx + 1);
        } else {
          if (this.dcType === 'survey') {
            this.store.dispatch(new DataCollectionEnd({ type: this.dcType, dataCollection: data[0] }));
          } else {
            this.contactOptions.data = [...this.contactOptions.data, ...data];
            this.store.dispatch(new DataCollectionEnd({
              type: this.dcType,
              contactCreateOptions: this.contactOptions,
              lastCompletedType: 'dialog'
            }));
          }
        }
      }
    }
  }
  setResolved() {
    this.store.dispatch(new DataCollectionResolved());
    this.store.dispatch(new DataCollectionShowPanel(false));
  }
  async showSurvey() {
    this.processDcById(this.context.surveyId, 'survey');
  }
  async submitDataCollection(dc) {
    const dataCollection = dc.dcDefinition;
    const data = dc.dcData;
    for (let i = 0; i < dataCollection.fields.length; i++) {
      if (dataCollection.fields[i].format === 'nickname' && data[dataCollection.fields[i].id]) {
        this.contactOptions.nick = data[dataCollection.fields[i].id];
        break;
      }
    }
    const dcData = await this.vivocha.pageRequest('spreadCollectedData', dc.dcData, dc.dcDefinition);
    if (this.dcType === 'dc') {
      if (this.dcRefs[this.selectedIdx + 1]) {
        this.contactOptions.data = [...this.contactOptions.data, ...dcData];
        this.processDcByIdx(this.selectedIdx + 1);
      } else {
        this.contactOptions.data = [...this.contactOptions.data, ...dcData];
        this.store.dispatch(new DataCollectionEnd({type: 'dc', contactCreateOptions: this.contactOptions, lastCompletedType: 'form'}));
      }
    } else {
      if (this.dcType === 'survey') {
        const surveyToStore = objectToDataCollection(dc.dcData, dc.dcDefinition.id, dc.dcDefinition);
        this.store.dispatch(new DataCollectionEnd({type: this.dcType, dataCollection: surveyToStore}));
      } else {
        this.contactOptions.data = [...this.contactOptions.data, ...dcData];
        this.store.dispatch(new DataCollectionEnd({
          type: this.dcType,
          contactCreateOptions: this.contactOptions,
          lastCompletedType: 'form'
        }));
      }
    }
  }
  submitHiddenDataCollection(dc) {
    const data = {};
    if (dc.fields) {
      dc.fields.forEach( elem => {
        const hasDefault = (typeof elem.defaultConstant !== 'undefined') && elem.defaultConstant != null;
        data[elem.id] = hasDefault ? elem.defaultConstant.toString() : elem.defaultConstant;
      });
    }
    const dataCollection = {
      dcDefinition : dc,
      dcData: data
    };
    // console.log('submitting hidden dc', dataCollection);
    this.submitDataCollection(dataCollection);
  }
  submitSurvey(survey) {
    this.store.dispatch(new DataCollectionEnd({ type: 'survey', dataCollection: survey }));
  }
}
