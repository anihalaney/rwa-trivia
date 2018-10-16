import { AuthenticationProvider } from './authentication.provider';
import { AuthInterceptor } from './auth-interceptor';
import { FirebaseAuthService } from './firebase-auth.service';
import { TNSFirebaseAuthService } from './mobile/firebase-auth.service';

export {
  AuthenticationProvider,
  AuthInterceptor,
  FirebaseAuthService,
  TNSFirebaseAuthService,
};

export default [
  AuthenticationProvider,
  AuthInterceptor,
  FirebaseAuthService,
  TNSFirebaseAuthService,
];
