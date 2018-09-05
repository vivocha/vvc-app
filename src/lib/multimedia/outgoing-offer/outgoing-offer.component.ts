import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'vvc-outgoing-offer',
  templateUrl: './outgoing-offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutgoingOfferComponent {

  @Input() context;

}
