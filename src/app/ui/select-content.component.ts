import {
  Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, ViewChild,
  inject, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedPosition, OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SelectContext } from './select.context';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-content',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="ctx.triggerOrigin as origin">
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="isOpen"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayWidth]="triggerWidth"
        [cdkConnectedOverlayHasBackdrop]="true"
        [cdkConnectedOverlayOffsetY]="6"
        (attach)="onAttach()"
        (backdropClick)="ctx.setOpen(false)"
        (detach)="ctx.setOpen(false)"
      >
        <div #panel
             [id]="panelId"
             role="listbox"
             class="z-50 max-h-64 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none"
             data-slot="select-content">
          <ng-content></ng-content>
        </div>
      </ng-template>
    </ng-container>
  `,
})
export class SelectContentComponent implements OnDestroy {
  ctx = inject(SelectContext);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('panel', { static: false }) panel!: ElementRef<HTMLElement>;

  @Input() align: 'start' | 'end' = 'start';

  isOpen = false;
  triggerWidth = 0;
  positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  panelId = `app-select-panel-${Math.random().toString(36).slice(2,8)}`;
  private sub = new Subscription();

  constructor() {
    this.ctx.panelId = this.panelId;
    this.sub.add(this.ctx.open$.subscribe(open => {
      this.isOpen = open;
      if (open) this.ctx.setActiveByValue(this.ctx.value$.value ?? '');
      this.cdr.markForCheck();
    }));
  }

  onAttach() {
    const originEl = (this.ctx.triggerOrigin as CdkOverlayOrigin | undefined)?.elementRef.nativeElement;
    const w = originEl?.getBoundingClientRect().width
           || this.ctx.triggerEl?.nativeElement?.getBoundingClientRect().width
           || 0;
    // Fallback: if width is 0, let CDK auto-size by not forcing width
    this.triggerWidth = w > 0 ? Math.ceil(w) : 0;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  @HostBinding('attr.data-slot') slot = 'select-portal';
  @HostListener('keydown', ['$event']) onKey(e: KeyboardEvent) {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); this.ctx.moveActive(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); this.ctx.moveActive(-1); }
    else if (k === 'Home') { e.preventDefault(); this.ctx.activeIndex$.next(0); }
    else if (k === 'End')  { e.preventDefault(); const n = this.ctx.items$.value.filter(i=>!i.disabled).length; this.ctx.activeIndex$.next(n-1); }
    else if (k === 'Enter'){ e.preventDefault(); this.ctx.selectActive(); }
    else if (k === 'Escape'){ e.preventDefault(); this.ctx.setOpen(false); }
    else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) this.ctx.onTypeahead(k);
  }
}
