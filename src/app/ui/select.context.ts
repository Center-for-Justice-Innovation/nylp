import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { SelectContext } from './select-context.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-content',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="ctx.triggerEl"
      [cdkConnectedOverlayOpen]="ctx.open$.value"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayWidth]="triggerWidth"
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
  `,
})
export class SelectContentComponent implements OnDestroy {
  ctx = inject(SelectContext);
  @ViewChild('panel', { static: false }) panel!: ElementRef<HTMLElement>;

  @Input() align: 'start' | 'end' = 'start';

  triggerWidth = 0;
  positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  panelId = `app-select-panel-${Math.random().toString(36).slice(2,8)}`;

  private sub = new Subscription();

  constructor() {
    this.ctx.panelId = this.panelId; // for aria-controls
    this.sub.add(
      this.ctx.open$.subscribe(open => {
        if (open) {
          const w = this.ctx.triggerEl?.nativeElement?.getBoundingClientRect().width || 0;
          this.triggerWidth = Math.ceil(w);
          const v = this.ctx.value$.value ?? '';
          this.ctx.setActiveByValue(v);
        }
      })
    );
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  @HostBinding('attr.data-slot') slot = 'select-portal';
  @HostListener('keydown', ['$event']) onKey(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowDown') { e.preventDefault(); this.ctx.moveActive(1); }
    else if (key === 'ArrowUp') { e.preventDefault(); this.ctx.moveActive(-1); }
    else if (key === 'Home') { e.preventDefault(); this.ctx.activeIndex$.next(0); }
    else if (key === 'End') { e.preventDefault(); const count = this.ctx.items$.value.filter(i=>!i.disabled).length; this.ctx.activeIndex$.next(count-1); }
    else if (key === 'Enter') { e.preventDefault(); this.ctx.selectActive(); }
    else if (key === 'Escape') { e.preventDefault(); this.ctx.setOpen(false); }
    else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { this.ctx.onTypeahead(key); }
  }
}