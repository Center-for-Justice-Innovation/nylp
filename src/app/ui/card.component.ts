import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<div [class]="classes"><ng-content /></div>`
})
export class UICardComponent {
  @Input() class = '';
  get classes() { return ['bg-card text-card-foreground','flex flex-col gap-6','rounded-xl border', this.class].join(' '); }
}

@Component({ selector: 'ui-card-header', standalone: true, template: `<div class="flex flex-col gap-1.5 p-6"><ng-content /></div>` })
export class UICardHeaderComponent {}
@Component({ selector: 'ui-card-title', standalone: true, template: `<h4 class="leading-none text-lg font-semibold"><ng-content /></h4>` })
export class UICardTitleComponent {}
@Component({ selector: 'ui-card-description', standalone: true, template: `<p class="text-sm text-muted-foreground"><ng-content /></p>` })
export class UICardDescriptionComponent {}
@Component({ selector: 'ui-card-content', standalone: true, template: `<div class="p-6 pt-0"><ng-content /></div>` })
export class UICardContentComponent {}
