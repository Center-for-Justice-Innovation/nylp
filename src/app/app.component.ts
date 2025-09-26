// src/app/app.component.ts (standalone)
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, GuardsCheckStart, GuardsCheckEnd, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, @Inject(PLATFORM_ID) pid: Object) {
    if (isPlatformBrowser(pid)) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationStart)        console.log('[router] start →', e.url);
        if (e instanceof RoutesRecognized)       console.log('[router] routes recognized →', e.url);
        if (e instanceof GuardsCheckStart)       console.log('[router] guards start →', e.url);
        if (e instanceof GuardsCheckEnd)         console.log('[router] guards end →', e.url, 'shouldActivate=', e.shouldActivate);
        if (e instanceof NavigationEnd)          console.log('[router] end →', e.urlAfterRedirects);
        if (e instanceof NavigationCancel)       console.warn('[router] cancel →', e.url, e.reason);
        if (e instanceof NavigationError)        console.error('[router] error →', e.url, e.error);
      });
    }
  }
}
