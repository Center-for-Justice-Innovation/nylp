import { Component, Input } from '@angular/core';
@Component({ selector: 'ui-badge', standalone: true, template: `<span [class]="classes"><ng-content /></span>` })
export class UIBadgeComponent {
  @Input() variant: 'default'|'secondary'|'outline'|'success' = 'default';
  get classes() {
    const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';
    const map = { default: 'bg-primary text-primary-foreground border-transparent', secondary: 'bg-secondary text-secondary-foreground border-transparent', outline: 'text-foreground', success: 'bg-success text-secondary-forground border-transparent' };
    return `${base} ${map[this.variant]}`;
  }
}