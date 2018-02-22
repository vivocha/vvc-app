import { Directive, Input, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[vvcDraggable]'
})
export class DraggableDirective implements OnInit {

  private topStart: number;
  private leftStart: number;
  private md: boolean;
  private _handle: HTMLElement;

  constructor(public element: ElementRef) {
  }


  ngOnInit() {
    this.element.nativeElement.className += ' cursor-draggable';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 2 || (this._handle !== undefined && event.target !== this._handle)) {
      return; // prevents right click drag, remove his if you don't want it
    }
    this.md = true;
    this.topStart = event.y - 40;
    this.leftStart = event.x - 40;
  }

  @HostListener('document:mouseup', [ '$event' ])
  onMouseUp(event: MouseEvent) {
    this.md = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if ( this.md ) {
      this.element.nativeElement.style.top = (event.clientY - 40) + 'px';
      this.element.nativeElement.style.left = (event.clientX - 40) + 'px';
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.md = false;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.md = true;
    this.topStart = event.changedTouches[0].clientY - 40;
    this.leftStart = event.changedTouches[0].clientX - 40;
    event.stopPropagation();
  }

  @HostListener('document:touchend', [ '$event' ])
  onTouchEnd() {
    this.md = false;
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.md) {
      this.element.nativeElement.style.top = ( event.changedTouches[0].clientY - 40 ) + 'px';
      this.element.nativeElement.style.left = ( event.changedTouches[0].clientX - 40 ) + 'px';
    }
    event.stopPropagation();
  }

  @Input()
  set vvcDraggableHandle(handle: HTMLElement){
    this._handle = handle;
  }
}
