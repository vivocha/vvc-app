/** https://www.npmjs.com/package/angular2-auto-scroll */
import { Directive, ElementRef, HostListener, AfterContentInit, Input, OnDestroy } from "@angular/core";

@Directive({
  selector: '[angular2-auto-scroll]'
})
export class Angular2AutoScroll implements AfterContentInit, OnDestroy {
  @Input('lock-y-offset') lockYOffset = 10;
  @Input('observe-attributes') observeAttributes: string = "false";

  private nativeElement: HTMLElement;
  private isLocked = false;
  private mutationObserver: MutationObserver;

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  private scrollDown(): void {
    this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
  }

  @HostListener('scroll')
  private scrollHandler() {
    const scrollFromBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
    this.isLocked = scrollFromBottom > this.lockYOffset;
  }

  getObserveAttributes(): boolean {
    return this.observeAttributes !== '' && this.observeAttributes.toLowerCase() !== 'false';
  }

  ngAfterContentInit(): void {
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isLocked) {
        this.scrollDown();
      }
    });
    this.mutationObserver.observe(this.nativeElement, {
      childList: true,
      subtree: true,
      attributes: this.getObserveAttributes()
    });
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }

  public forceScrollDown(): void {
    this.scrollDown();
  }
}
