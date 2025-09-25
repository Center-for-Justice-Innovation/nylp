import { Directive } from '@angular/core';
import { SelectContext } from './select.context';

@Directive({
  selector: 'app-select, [appSelectCtx]', // auto-attach provider
  standalone: true,
  providers: [SelectContext],
})
export class SelectCtxDirective {}

