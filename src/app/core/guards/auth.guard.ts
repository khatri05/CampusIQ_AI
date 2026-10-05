import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';

import {
  firebaseApp
} from '../config/firebase.config';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const auth = getAuth(firebaseApp);

  return new Promise((resolve) => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {

        unsubscribe();

        if (user) {
          resolve(true);
        } else {
          resolve(
            router.createUrlTree(['/login'])
          );
        }

      }
    );

  });
};