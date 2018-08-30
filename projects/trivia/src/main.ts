import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from '../../shared-library/src/lib/environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  const script1 = document.createElement('script');
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=UA-122807814-1';
  document.body.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
     }, i[r].l = 1 * new Date();
     a = s.createElement(o),
     m = s.getElementsByTagName(o)[0];
     a.async = 1;
     a.src = g;
     m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
     ga('create', 'UA-122807814-1', 'auto');
     ga('send', 'pageview');
     window.dataLayer = window.dataLayer || [];
     function gtag() { dataLayer.push(arguments); }
       gtag('js', new Date());
       gtag('config', 'UA-122807814-1');`;
  document.body.appendChild(script2);
  enableProdMode();
}
document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
})
