import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SelectContext } from './select.context';

@Component({
  selector: 'app-select-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer select-none"
         [class.bg-accent]="highlighted"
         [class.text-accent-foreground]="highlighted"
         [class.opacity-50]="disabled"
         role="option"
         [attr.aria-selected]="selected"
         [attr.aria-disabled]="disabled">
      <ng-content></ng-content>
    </div>
  `,
})
export class SelectItemComponent implements OnInit, OnDestroy {
  private ctx = inject(SelectContext);
  private el = inject(ElementRef<HTMLElement>);
  private sub = new Subscription();

  @Input() value!: string;
  @Input() disabled = false;
  @Input() label?: string; // if not provided, read textContent

  @HostBinding('attr.data-slot') slot = 'select-item';

  highlighted = false;
  selected = false;

  ngOnInit(): void {
    const label = (this.label ?? this.el.nativeElement.textContent ?? '').trim();
    this.ctx.registerItem({ value: this.value, label, disabled: this.disabled, el: this.el });

    this.sub.add(this.ctx.activeIndex$.subscribe(idx => {
      const items = this.ctx.items$.value.filter(i => !i.disabled);
      const myIdx = items.findIndex(i => i.value === this.value);
      this.highlighted = idx === myIdx;
    }));
    this.sub.add(this.ctx.value$.subscribe(v => this.selected = v === this.value));
  }

  ngOnDestroy(): void { this.ctx.unregisterItem(this.value); this.sub.unsubscribe(); }

  @HostListener('click') onClick() {
    if (!this.disabled) {
      this.ctx.choose({ value: this.value, label: this.label || (this.el.nativeElement.textContent||'').trim(), disabled: !!this.disabled, el: this.el });
    }
  }
  @HostListener('mouseenter') onEnter() {
    const items = this.ctx.items$.value.filter(i => !i.disabled);
    const myIdx = items.findIndex(i => i.value === this.value);
    this.ctx.activeIndex$.next(myIdx);
  }
}