import { environment } from 'shared-library/environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
    enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
