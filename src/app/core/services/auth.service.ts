import { Injectable } from '@angular/core';

import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

import { firebaseApp } from '../config/firebase.config';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;


  constructor(
    private apiService: ApiService
  ) {
    this.auth = getAuth(firebaseApp);
  }

  async getUserProfile(): Promise<any> {

    return await this.apiService.get<any>(
      '/auth/profile'
    );

  }


  async login(
    email: string,
    password: string
  ): Promise<User> {

    const result =
      await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

    return result.user;
  }


  async register(
    email: string,
    password: string
  ): Promise<User> {

    const result =
      await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

    return result.user;
  }


  async logout(): Promise<void> {

    await signOut(this.auth);

  }


  getCurrentUser(): User | null {

    return this.auth.currentUser;

  }


  async getIdToken(): Promise<string | null> {

    const user =
      this.auth.currentUser;

    if (!user) {

      return null;

    }

    return await user.getIdToken();

  }


  resetPassword(
    email: string
  ): Promise<void> {

    return sendPasswordResetEmail(
      this.auth,
      email
    );

  }


  onAuthStateChanged(
    callback: (user: User | null) => void
  ): () => void {

    return onAuthStateChanged(
      this.auth,
      callback
    );

  }

}