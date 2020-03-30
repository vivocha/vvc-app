import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vvc-inbound-fullscreen-messages',
  templateUrl: './inbound-fullscreen-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundFullscreenMessagesComponent implements OnInit {

  @Input() context;

  numtel;
  ngOnInit(): void {
    this.numtel = (
      this.context &&
      this.context.inboundState &&
      this.context.inboundState.extCode) ? 'tel:' + this.context.inboundState.dnis+","+this.context.inboundState.extCode
      : 'tel:' + this.context.inboundState.dnis;

  }

}
