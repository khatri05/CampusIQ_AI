import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  from
} from 'rxjs';

import {
  switchMap
} from 'rxjs/operators';

import {
  getAuth
} from 'firebase/auth';

import {
  firebaseApp
} from '../config/firebase.config';

export const authInterceptor: HttpInterceptorFn =
  (req, next) => {

    const auth = getAuth(firebaseApp);

    const user = auth.currentUser;

    if (!user) {

      console.log(
        'Auth Interceptor: No authenticated user'
      );

      return next(req);
    }

    console.log(
      'Auth Interceptor: User:',
      user.uid
    );

    return from(
      user.getIdToken()
    ).pipe(

      switchMap((token) => {

        console.log(
          'Auth Interceptor: Token attached'
        );

        const authenticatedRequest =
          req.clone({
            setHeaders: {
              Authorization:
                `Bearer ${token}`
            }
          });

        return next(
          authenticatedRequest
        );

      })

    );
  };