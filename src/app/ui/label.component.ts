import { Component } from '@angular/core';
@Component({ selector: 'ui-label', standalone: true, template: `<label class="block text-sm font-medium text-foreground"><ng-content /></label>` })
export class UILabelComponent {}