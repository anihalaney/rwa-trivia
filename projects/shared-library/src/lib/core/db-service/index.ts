import { DbService } from './db.service';
import { WebDbService } from './web/db.service';
import { PlatformFirebaseToken } from './tokens';

export const CORE_PROVIDERS: any[] = [
    DbService,
    WebDbService,
    PlatformFirebaseToken
];


export * from './db.service';
export * from './web/db.service';
export * from './tokens';
