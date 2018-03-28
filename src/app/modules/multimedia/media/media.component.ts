import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vvc-media',
  templateUrl: './media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent implements OnInit {

  @Input() context;
  constructor() { }

  ngOnInit() {
  }

}
