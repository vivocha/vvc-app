import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {NgxAutoScroll} from 'ngx-auto-scroll';

@Component({
  selector: 'vvc-chat',
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {

  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;

  _context;
  msgCounter;

  @Input()
  set context(context){
    this._context = context;
    if (this._context.messages && this._context.messages.length && this._context.messages.length != this.msgCounter){
      this.msgCounter = this._context.messages.length;
      this.forceScrollDown();
    }

  };
  get context(){
    return this._context;
  }

  public forceScrollDown(): void {
    setTimeout( () => {
      this.ngxAutoScroll.forceScrollDown();
    }, 100);

  }
}
