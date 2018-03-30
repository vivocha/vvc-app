import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vvc-minimized',
  templateUrl: './minimized.component.html'
})
export class MinimizedComponent implements OnInit {

  @Input() state;
  @Input() variables;

  constructor() { }

  ngOnInit() {
  }
  getAvatar() {
    return this.state.agent && this.state.agent.avatar ? this.state.agent.avatar : this.variables.companyLogoUrl || 'assets/static/acct-img.png';
  }
}
