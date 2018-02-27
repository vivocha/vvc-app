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
    return (this.state.agent &&
    this.state.agent.avatar &&
    this.state.agent.avatar.images &&
    this.state.agent.avatar.images[0] &&
    this.state.agent.avatar.images[0].file &&
    this.state.agent.avatar.base_url) ? this.state.agent.avatar.base_url + this.state.agent.avatar.images[0].file
        : this.variables.companyLogoUrl || 'assets/static/acct-img.png';
  }
}
