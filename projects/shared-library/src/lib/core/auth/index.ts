import { AuthenticationProvider } from './authentication.provider';
import { AuthInterceptor } from './auth-interceptor';
import { FirebaseAuthService } from './firebase-auth.service';
import { WebFirebaseAuthService } from './web/firebase-auth.service';

export {
  AuthenticationProvider,
  AuthInterceptor,
  FirebaseAuthService,
  WebFirebaseAuthService
};

export default [
  AuthenticationProvider,
  AuthInterceptor,
  FirebaseAuthService,
  WebFirebaseAuthService
];
