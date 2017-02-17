import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-media-tools',
  templateUrl: './media-tools.component.html',
  styleUrls: ['./media-tools.component.scss']
})
export class MediaToolsComponent implements OnInit {

  @Output() emoji = new EventEmitter();
  selectedTools;
  constructor() { }

  ngOnInit() {
  }

  isPopupVisible(popId) {
    return (popId === this.selectedTools);
  }

  selectTool(toolId) {
    if (this.selectedTools === toolId) {
      toolId = '';
    }
    this.selectedTools = toolId;
  }
  logEm(em) {
    console.log('logging em', em);
    this.emoji.emit(em);
  }

}
