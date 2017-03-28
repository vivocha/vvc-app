import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-file-uploader',
  templateUrl: './file-uploader.component.html'
})
export class FileUploaderComponent implements OnInit {
  uploadFile: File;

  @Output() upload = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  doUpload(inputFileDescr) {
    if (this.uploadFile) {
      console.log('emitting upload from uploader');
      this.upload.emit({ text: inputFileDescr.value, file: this.uploadFile });
      inputFileDescr.value = '';
      this.uploadFile = undefined;
    }
  }
  onUploading(evt) {
    if (evt.srcElement.files[0]) {
      this.uploadFile = evt.srcElement.files[0];
    }
  }
  removeUpload() {
    this.uploadFile = undefined;
  }

}
