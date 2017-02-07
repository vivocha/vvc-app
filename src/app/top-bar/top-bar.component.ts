import {Component, OnInit, Input} from '@angular/core';
import {VvcAgent} from '../core/core.interfaces';

@Component({
  selector: 'vvc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Input() agent: VvcAgent;

  constructor() { }

  ngOnInit() {
  }
  close() {

  }
  minimize() {

  }

}
