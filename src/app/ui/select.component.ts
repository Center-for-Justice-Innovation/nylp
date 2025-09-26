import { Component, ElementRef, HostListener, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption { label: string; value: string; disabled?: boolean }

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UISelectComponent), multi: true }
  ],
  template: `
  <div class="relative" [class]="class">
    <!-- Trigger (shadcn/react-style) -->
    <button type="button"
      class="w-full inline-flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      [class.opacity-50]="disabled"
      [attr.aria-haspopup]="'listbox'" [attr.aria-expanded]="isOpen"
      [disabled]="disabled"
      (click)="toggle()" (keydown)="onTriggerKeydown($event)">
      <span class="truncate" [class.text-muted-foreground]="!selectedLabel">{{ selectedLabel || placeholder }}</span>
      <svg class="ml-2 size-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/></svg>
    </button>

    <!-- Popover -->
    <div *ngIf="isOpen" class="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
      <ul role="listbox" tabindex="0" class="max-h-60 overflow-auto py-1 outline-none" (keydown)="onListKeydown($event)">
        <li *ngFor="let opt of options; let i = index"
            role="option"
            [attr.aria-selected]="value === opt.value"
            (click)="select(opt)"
            (mouseenter)="highlightedIndex = i"
            [class]="optionClass(i, opt)">
          <span class="truncate">{{ opt.label }}</span>
          <svg *ngIf="value === opt.value" class="ml-auto size-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.408 0l-3.5-3.5a1 1 0 111.408-1.42l2.796 2.797 6.796-6.797a1 1 0 011.408 0z" clip-rule="evenodd"/></svg>
        </li>
      </ul>
    </div>
  </div>
  `
})
export class UISelectComponent implements ControlValueAccessor {
  constructor(private host: ElementRef<HTMLElement>) {}

  // Inputs
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select…';
  @Input() disabled = false;
  @Input() class = '';

  // CVA hooks
  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(val: any): void { this.value = val ?? null; }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  // State
  isOpen = false;
  value: string | null = null;
  highlightedIndex = -1;

  get selectedLabel(): string {
    const m = this.options.find(o => o.value === this.value);
    return m ? m.label : '';
  }

  // Behaviors
  toggle() { if (!this.disabled) { this.isOpen = !this.isOpen; if (this.isOpen) this.syncHighlightToValue(); } }
  close() { if (this.isOpen) { this.isOpen = false; this._onTouched(); } }
  select(opt: SelectOption) {
    if (opt.disabled) return;
    this.value = opt.value;
    this._onChange(opt.value);
    this.close();
  }
  syncHighlightToValue() {
    const idx = this.options.findIndex(o => o.value === this.value);
    this.highlightedIndex = idx >= 0 ? idx : 0;
  }

  optionClass(i: number, opt: SelectOption) {
    return [
      'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none',
      opt.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground',
      this.highlightedIndex === i ? 'bg-accent text-accent-foreground' : '',
      this.value === opt.value ? 'font-medium' : 'font-normal'
    ].join(' ');
  }

  // Keyboard on trigger
  onTriggerKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    const key = e.key;

    // Open & navigate
    if (key === 'ArrowDown') {
      e.preventDefault();
      if (!this.isOpen) { this.isOpen = true; this.syncHighlightToValue(); }
      else { this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.options.length - 1); }
      return;
    }
    if (key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen) { this.isOpen = true; this.highlightedIndex = Math.max(0, this.options.length - 1); }
      else { this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0); }
      return;
    }

    // Commit or open
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (!this.isOpen) { this.isOpen = true; this.syncHighlightToValue(); }
      else {
        const i = this.highlightedIndex;
        if (i >= 0) this.select(this.options[i]);
      }
      return;
    }

    // Close
    if (key === 'Escape') { e.preventDefault(); this.close(); return; }
    if (key === 'Tab') { this.close(); return; }

    // Jump to first/last
    if (key === 'Home') { e.preventDefault(); if (!this.isOpen) this.isOpen = true; this.highlightedIndex = 0; return; }
    if (key === 'End')  { e.preventDefault(); if (!this.isOpen) this.isOpen = true; this.highlightedIndex = Math.max(0, this.options.length - 1); return; }
  }

  // Keyboard in list
  onListKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'Escape' || key === 'Tab') { e.preventDefault(); this.close(); return; }
    if (key === 'Home') { e.preventDefault(); this.highlightedIndex = 0; return; }
    if (key === 'End') { e.preventDefault(); this.highlightedIndex = Math.max(0, this.options.length - 1); return; }
    if (key === 'ArrowDown') { e.preventDefault(); this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.options.length - 1); return; }
    if (key === 'ArrowUp') { e.preventDefault(); this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0); return; }
    if (key === 'Enter') { e.preventDefault(); const i = this.highlightedIndex; if (i >= 0) this.select(this.options[i]); return; }
  }

  // Close on outside click
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.isOpen) return;
    const el = this.host.nativeElement;
    if (el && !el.contains(ev.target as Node)) this.close();
  }
}