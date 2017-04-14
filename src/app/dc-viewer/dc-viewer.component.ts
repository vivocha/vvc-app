import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'vvc-dc-viewer',
  templateUrl: './dc-viewer.component.html'
})
export class DcViewerComponent implements OnInit {

  @ViewChild('theForm') theForm;
  @Input() message;
  @Input() dc;
  @Output() submit = new EventEmitter();
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  closeViewer() {
    this.dc.dataValue = this.theForm.getForm().value;
    this.close.emit({ msg: this.message, dataCollection: this.dc });
  }
  onFormSubmit(formValue) {
    this.dc.dataValue = formValue;
    this.submit.emit({ msg: this.message, dataCollection: this.dc });
  }


}
