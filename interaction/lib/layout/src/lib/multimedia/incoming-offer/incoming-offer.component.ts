import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-incoming-offer',
  templateUrl: './incoming-offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomingOfferComponent {

  @Input() context;
  @Output() onAccept = new EventEmitter();
  @Output() onReject = new EventEmitter();

  acceptOffer() {
    this.onAccept.emit();
  }
  rejectIncomingOffer() {
    this.onReject.emit();
  }
}
