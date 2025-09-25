import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button [attr.type]="type" [disabled]="disabled" [class]="computedClass">
      <ng-content />
    </button>
  `
})
export class UIButtonComponent {
  @Input() variant: 'default'|'destructive'|'outline'|'secondary'|'ghost'|'link' = 'default';
  @Input() size: 'default'|'sm'|'lg'|'icon' = 'default';
  @Input() type: 'button'|'submit'|'reset' = 'button';
  @Input() disabled = false;
  @Input() class = '';

  private get base() {
    // shadcn/ui base classes for Button (React parity)
    return [
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'ring-offset-background disabled:pointer-events-none disabled:opacity-50'
    ];
  }

  private get variantClass() {
    return {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      outline: 'border bg-background text-foreground hover:bg-accent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline'
    }[this.variant];
  }

  private get sizeClass() {
    return {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3',
      lg: 'h-10 px-6',
      icon: 'size-9'
    }[this.size];
  }

  get computedClass() {
    return [...this.base, this.variantClass, this.sizeClass, this.class].join(' ');
  }
}