// select-value.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectContext } from './select.context';

@Component({
  selector: 'app-select-value',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block truncate" [class.text-muted-foreground]="!hasValue">
      {{ hasValue ? label : placeholder }}
    </span>
  `,
})
export class SelectValueComponent {
  private readonly ctx: SelectContext = inject(SelectContext) as SelectContext;
  get label(): string { return this.ctx.label$.value ?? ''; }
  get placeholder(): string { return this.ctx.placeholder ?? 'Select…'; }
  get hasValue(): boolean { return this.ctx.value$.value != null; }
}
