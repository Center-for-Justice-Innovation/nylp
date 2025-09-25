import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectContext } from './select.context';

@Component({
  selector: 'app-select-value',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="block truncate" [class.text-muted-foreground]="!hasValue()">
      {{ hasValue() ? label() : placeholder() }}
    </span>
  `,
})
export class SelectValueComponent {
  private ctx = inject(SelectContext);
  label = () => this.ctx.label$.value;
  placeholder = () => this.ctx.placeholder;
  hasValue = () => !!this.ctx.value$.value;
}