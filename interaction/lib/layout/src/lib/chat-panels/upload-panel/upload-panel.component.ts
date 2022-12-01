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
  tooBig;
  isImage;
  previewTipe;
  uploadFile: File;
  fileFormRef;

  constructor(private cdr: ChangeDetectorRef){}

  doUpload(inputFileDescr) {
    if (this.uploadFile) {
      this.upload.emit({ text: inputFileDescr.value, file: this.uploadFile });
      inputFileDescr.value = '';
    }
  }
  onUploading(evt, formRef){
    this.tooBig = false;
    const el = evt.srcElement || evt.target;
    if (el.files && el.files[0]) {
      this.fileFormRef = evt.target.files[0];

      this.uploadFile = this.fileFormRef;
      this.isImage = this.fileFormRef.type.indexOf('image/') !== -1;
      this.previewTipe = "preview_" + this.fileFormRef.type.split("/")[0];
      const fr = new FileReader();

      if(this.fileFormRef.size < (parseInt(this.context.variables.maxFileSize)*1024*1000 + 500)) { // check file size
        if(this.isImage){ // image preview
          fr.onload = (e) => {
            this.dataFile = e.target['result'];
            formRef.reset();
            this.cdr.detectChanges();
          };
          fr.readAsDataURL(this.fileFormRef);
        } else {
          this.dataFile = true;
          formRef.reset();
          this.cdr.detectChanges();
        }
      } else {
        this.tooBig = true;
        formRef.reset();
        this.cdr.detectChanges();
      }
    }
  }

}
