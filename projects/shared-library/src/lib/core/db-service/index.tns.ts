import { DbService } from './db.service';
import { TNSDbService } from './mobile/db.service';
import { PlatformFirebaseToken } from './tokens';

export const CORE_PROVIDERS: any[] = [
    DbService,
    TNSDbService,
    PlatformFirebaseToken
];


export * from './db.service';
export * from './mobile/db.service'
export * from './tokens';
