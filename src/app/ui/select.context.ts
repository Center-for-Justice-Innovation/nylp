import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

export interface SelectItemRef {
  value: string;
  label: string;
  disabled: boolean;
  el?: ElementRef<HTMLElement>;
}

@Injectable()
export class SelectContext {
  // state
  readonly open$ = new BehaviorSubject<boolean>(false);
  readonly value$ = new BehaviorSubject<string | null>(null);
  readonly label$ = new BehaviorSubject<string>('');
  readonly items$ = new BehaviorSubject<SelectItemRef[]>([]);
  readonly activeIndex$ = new BehaviorSubject<number>(-1);
  placeholder = 'Select…';
  disabled = false;

  // element refs & a11y id
  triggerOrigin?: CdkOverlayOrigin; // overlay origin (typed)
  triggerEl?: ElementRef<HTMLElement>; // for width measurement/focus
  panelId?: string; // set by content for aria-controls

  // typeahead
  private typeahead = '';
  private typeaheadTimer?: any;

  setOpen(v: boolean) { if (!this.disabled) this.open$.next(v); }
  toggle() { this.setOpen(!this.open$.value); }

  setValue(val: string | null, label?: string) {
    this.value$.next(val);
    this.label$.next(label ?? (this.items$.value.find(i => i.value === val)?.label || ''));
  }

  registerItem(item: SelectItemRef) { this.items$.next([...this.items$.value, item]); }
  unregisterItem(value: string) { this.items$.next(this.items$.value.filter(i => i.value !== value)); }

  moveActive(delta: number) {
    const items = this.items$.value.filter(i => !i.disabled);
    if (!items.length) return;
    let idx = this.activeIndex$.value;
    idx = (idx + delta + items.length) % items.length;
    this.activeIndex$.next(idx);
    items[idx].el?.nativeElement.scrollIntoView({ block: 'nearest' });
  }
  setActiveByValue(value: string) {
    const items = this.items$.value.filter(i => !i.disabled);
    const idx = items.findIndex(i => i.value === value);
    this.activeIndex$.next(idx);
  }

  selectActive() {
    const items = this.items$.value.filter(i => !i.disabled);
    const idx = this.activeIndex$.value;
    if (idx >= 0 && idx < items.length) this.choose(items[idx]);
  }

  choose(item: SelectItemRef) {
    if (item.disabled) return;
    this.setValue(item.value, item.label);
    this.setOpen(false);
    this.triggerEl?.nativeElement?.focus();
  }

  onTypeahead(char: string) {
    clearTimeout(this.typeaheadTimer);
    this.typeahead += char.toLowerCase();
    const items = this.items$.value.filter(i => !i.disabled);
    const idx = items.findIndex(i => i.label.toLowerCase().startsWith(this.typeahead));
    if (idx >= 0) {
      this.activeIndex$.next(idx);
      items[idx].el?.nativeElement.scrollIntoView({ block: 'nearest' });
    }
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ''), 600);
  }
}