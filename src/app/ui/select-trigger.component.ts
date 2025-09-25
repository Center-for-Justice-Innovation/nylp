// select-trigger.component.ts
import {
  Component, ElementRef, HostBinding, Input, AfterViewInit, ViewChild,
  inject, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SelectContext } from './select.context';

@Component({
  selector: 'app-select-trigger',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      cdkOverlayOrigin
      type="button"
      class="focus-visible:border-ring focus-visible:ring-ring/50 inline-flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-12 text-base"
      [attr.data-state]="open ? 'open' : 'closed'"
      [attr.aria-expanded]="open"
      aria-haspopup="listbox"
      [attr.aria-controls]="ctx.panelId || null"
      [disabled]="disabled"
      (click)="onClick()"
      (keydown)="onKeydown($event)"
    >
      <span class="truncate text-left"><ng-content select="app-select-value"></ng-content></span>
      <svg class="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
           [style.transform]="open ? 'rotate(180deg)' : null" xmlns="http://www.w3.org/2000/svg"
           width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
})
export class SelectTriggerComponent implements AfterViewInit {
  readonly ctx = inject(SelectContext);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(CdkOverlayOrigin, { static: false }) origin!: CdkOverlayOrigin;
  @Input() disabled = false;

  @HostBinding('class') hostClass = 'w-full';
  get open() { return this.ctx.open$.value; }

  ngAfterViewInit() {
    // Avoid ExpressionChanged errors and ensure the origin exists before content binds.
    queueMicrotask(() => {
      this.ctx.triggerOrigin = this.origin;
      this.ctx.triggerEl = this.el;
      this.cdr.markForCheck();
    });
  }

  onClick() { if (!this.disabled) this.ctx.toggle(); }
  onKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); this.ctx.setOpen(true); this.ctx.moveActive(1); return; }
    if (k === 'ArrowUp')   { e.preventDefault(); this.ctx.setOpen(true); this.ctx.moveActive(-1); return; }
    if (k === 'Home')      { e.preventDefault(); this.ctx.activeIndex$.next(0); return; }
    if (k === 'End')       { e.preventDefault(); const n = this.ctx.items$.value.filter(i=>!i.disabled).length; this.ctx.activeIndex$.next(n-1); return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); if (!this.open) this.ctx.setOpen(true); else this.ctx.selectActive(); return; }
    if (k === 'Escape') { if (this.open) { e.preventDefault(); this.ctx.setOpen(false); } return; }
    if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) this.ctx.onTypeahead(k);
  }
}
