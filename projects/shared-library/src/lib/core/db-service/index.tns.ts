import { DbService } from './db.service';
import { TNSDbService } from './mobile/db.service';
import { PlatformFirebaseToken } from './tokens';
import { FirebaseService } from './firebase.service'

export const CORE_PROVIDERS: any[] = [
    DbService,
    TNSDbService,
    PlatformFirebaseToken,
    FirebaseService
];


export * from './db.service';
export * from './mobile/db.service'
export * from './tokens';
export * from './firebase.service'
