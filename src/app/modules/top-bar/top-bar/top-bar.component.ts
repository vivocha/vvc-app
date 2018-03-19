import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-top-bar',
  templateUrl: './top-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent{

  @Input() context;
  @Output() onMinimize = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  isMenuVisible = false;

  constructor(){}

  closeMenu(){
    this.isMenuVisible = false;
  }
  hasMenu(){
    return (this.context && (this.context.canMaximize || this.context.canStartAudio || this.context.canStarVideo));
  }
  showMenu(){
    this.isMenuVisible = true;
  }
}
