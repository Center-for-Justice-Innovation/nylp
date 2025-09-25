import { Component, EventEmitter, OnDestroy, OnInit, forwardRef, HostBinding, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectContext } from './select.context';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ],
  template: `<ng-content></ng-content>`,
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private ctx = inject(SelectContext);
  private sub = new Subscription();

  @Input() placeholder = 'Select…';
  @Input() disabled = false;
  @Input() value: string | null = null; // controlled
  @Output() valueChange = new EventEmitter<string | null>();

  @HostBinding('attr.data-state') get state() { return this.ctx.open$.value ? 'open' : 'closed'; }

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ctx.placeholder = this.placeholder;
    this.ctx.disabled = this.disabled;
    if (this.value != null) this.ctx.setValue(this.value);

    this.sub.add(this.ctx.value$.subscribe(v => {
      this.valueChange.emit(v);
      this.onChange(v);
    }));
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  // CVA
  writeValue(obj: any): void { this.ctx.setValue(obj ?? null); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; this.ctx.disabled = isDisabled; }
}