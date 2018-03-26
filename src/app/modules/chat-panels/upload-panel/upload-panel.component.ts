import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-upload-panel',
  templateUrl: './upload-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadPanelComponent {

  @Input()
  set context(context){
    if (this._context && this._context.showUploadPanel === false){
      this.uploadFile = undefined;
      this.dataFile = undefined;
      this.isImage = undefined;
    }
    this._context = Object.assign({}, context);
  };
  get context(){
    return this._context;
  }
  _context;
  @Output() close = new EventEmitter();
  @Output() upload = new EventEmitter();

  dataFile;
  isImage;
  uploadFile: File;

  constructor(private cdr: ChangeDetectorRef){}

  doUpload(inputFileDescr) {
    if (this.uploadFile) {
      this.upload.emit({ text: inputFileDescr.value, file: this.uploadFile });
      console.log('UPLOADING THAT STUFF', this.uploadFile);
      inputFileDescr.value = '';
    }
  }
  onUploading(evt){
    if (evt.srcElement.files[0]) {
      const file = evt.target.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        this.dataFile = e.target['result'];
        this.uploadFile = file;
        this.isImage = file.type.indexOf('image/') !== -1;
        this.cdr.detectChanges();
      };
      fr.readAsDataURL(file);
    }
    /*
    const file = evt.target.files[0];
    this.upload = { loading: true };
    const fr = new FileReader();
    fr.onload = (e) => {
      this.upload = {
        loading: true,
        id: fileId,
        fileName: file.name,
        dataFile: e.target['result'],
        fileObj: file
      }
      this.uploader.uploadFile(this.campaignId, 'vvc-app', file).toPromise().then( res => {
        this.upload.loading = false;
        this.fileChanged.emit(res);
      })
    };
    fr.readAsDataURL(file);
     */
  }
}
