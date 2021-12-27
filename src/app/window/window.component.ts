import { CdkDragMove, DragAxis } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})
export class WindowComponent implements OnInit {
  @ViewChild('resizeBox') resizeBox!: ElementRef;
  @ViewChild('dragHandleCorner') dragHandleCorner!: ElementRef;
  @ViewChild('dragHandleRight') dragHandleRight!: ElementRef;
  @ViewChild('dragHandleLeft') dragHandleLeft!: ElementRef;
  @ViewChild('dragHandleBottom') dragHandleBottom!: ElementRef;
  @ViewChild('dragHandleTop') dragHandleTop!: ElementRef;
  @Input() width!: number;
  @Input() height!: number;
  public lockAxis!: DragAxis;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  get resizeBoxElement(): HTMLElement {
    return this.resizeBox.nativeElement;
  }

  get dragHandleCornerElement(): HTMLElement {
    return this.dragHandleCorner.nativeElement;
  }

  get dragHandleRightElement(): HTMLElement {
    return this.dragHandleRight.nativeElement;
  }

  get dragHandleLeftElement(): HTMLElement {
    return this.dragHandleLeft.nativeElement;
  }

  get dragHandleBottomElement(): HTMLElement {
    return this.dragHandleBottom.nativeElement;
  }

  get dragHandleTopElement(): HTMLElement {
    return this.dragHandleTop.nativeElement;
  }

  ngAfterViewInit() {
    this.setAllHandleTransform();
  }

  setAllHandleTransform() {
    const rect = this.resizeBoxElement.getBoundingClientRect();
    this.setHandleTransform(this.dragHandleCornerElement, rect, [
      'right',
      'bottom',
    ]);
    this.setHandleTransform(this.dragHandleRightElement, rect, ['right']);
    this.setHandleTransform(this.dragHandleBottomElement, rect, ['bottom']);
  }

  setHandleTransform(
    dragHandle: HTMLElement,
    targetRect: DOMRect,
    position: ('left' | 'right' | 'top' | 'bottom')[]
  ) {
    const dragRect = dragHandle.getBoundingClientRect();
    const translateX = position.includes('left')
      ? 0
      : targetRect.width - dragRect.width;
    const translateY = position.includes('top')
      ? 0
      : targetRect.height - dragRect.height;

    dragHandle.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  }

  dragMove(dragHandle: HTMLElement, $event: CdkDragMove<any>) {
    this.ngZone.runOutsideAngular(() => {
      this.resize(dragHandle, this.resizeBoxElement);
    });
  }

  resize(dragHandle: HTMLElement, target: HTMLElement) {
    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (dragHandle.className.includes('left')) {
      console.log('moveLeft');
      target.style.left = dragRect.left + 'px';
      target.style.width =
        targetRect.right - dragRect.right + dragRect.width + 'px';
    } else {
      console.log('moveRight');
      target.style.width =
        dragRect.left - targetRect.left + dragRect.width + 'px';
    }

    const height = dragHandle.className.includes('top')
      ? dragRect.top - targetRect.top + dragRect.height
      : dragRect.top - targetRect.top + dragRect.height;

    target.style.height = height + 'px';

    // this.setAllHandleTransform();
  }
}
