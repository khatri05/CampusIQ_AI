import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // ================================
  // Form Fields
  // ================================

  email = '';

  password = '';


  // ================================
  // UI State
  // ================================

  showPassword = false;

  isLoading = false;

  errorMessage = '';

  currentYear = new Date().getFullYear();


  // ================================
  // Constructor
  // ================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // ================================
  // Login
  // ================================

  async login(): Promise<void> {

    this.errorMessage = '';

    // Validate email
    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }


    // Validate password
    if (!this.password) {

      this.errorMessage =
        'Please enter your password.';

      return;
    }


    this.isLoading = true;


    try {

      // --------------------------------
      // Step 1: Firebase Authentication
      // --------------------------------

      await this.authService.login(
        this.email.trim(),
        this.password
      );


      // --------------------------------
      // Step 2: Get user profile
      // --------------------------------

      /*
       * The Auth Interceptor automatically
       * attaches the Firebase ID token:
       *
       * Authorization: Bearer <token>
       */

      const response =
        await this.authService.getUserProfile();


      // --------------------------------
      // Step 3: Extract user
      // --------------------------------

      const user = response?.data;


      if (!user) {

        throw new Error(
          'User profile could not be loaded.'
        );
      }


      // --------------------------------
      // Step 4: Check account status
      // --------------------------------

      if (user.status === 'inactive') {

        await this.authService.logout();

        this.errorMessage =
          'Your account has been deactivated. Please contact the administrator.';

        return;
      }


      // --------------------------------
      // Step 5: Role-based navigation
      // --------------------------------

      switch (user.role) {


        // ==============================
        // STUDENT
        // ==============================

        case 'student':

          await this.router.navigate([
            '/student/dashboard'
          ]);

          break;


        // ==============================
        // FACULTY
        // ==============================

        case 'faculty':

          await this.router.navigate([
            '/faculty/dashboard'
          ]);

          break;


        // ==============================
        // PLACEMENT OFFICER
        // ==============================

        case 'placement_officer':

          await this.router.navigate([
            '/placement-officer/dashboard'
          ]);

          break;


        // ==============================
        // ADMIN
        // ==============================

        case 'admin':

          await this.router.navigate([
            '/admin/dashboard'
          ]);

          break;


        // ==============================
        // UNKNOWN ROLE
        // ==============================

        default:

          await this.authService.logout();

          this.errorMessage =
            'Your account does not have a valid role. Please contact the administrator.';

          break;
      }


    } catch (error: any) {

      console.error(
        'Login error:',
        error
      );


      this.errorMessage =
        this.getLoginErrorMessage(error);


    } finally {

      this.isLoading = false;

    }
  }


  // ================================
  // Toggle Password
  // ================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // ================================
  // Login Error Handler
  // ================================

  private getLoginErrorMessage(
    error: any
  ): string {

    const errorCode =
      error?.code || '';


    switch (errorCode) {


      // Firebase invalid credentials
      case 'auth/invalid-credential':

        return 'Invalid email or password.';


      // Older Firebase error
      case 'auth/invalid-login-credentials':

        return 'Invalid email or password.';


      // Wrong password
      case 'auth/wrong-password':

        return 'Invalid email or password.';


      // User doesn't exist
      case 'auth/user-not-found':

        return 'No account was found with this email address.';


      // Invalid email
      case 'auth/invalid-email':

        return 'Please enter a valid email address.';


      // Disabled Firebase account
      case 'auth/user-disabled':

        return 'Your account has been disabled. Please contact the administrator.';


      // Too many requests
      case 'auth/too-many-requests':

        return 'Too many login attempts. Please try again later.';


      // Network issue
      case 'auth/network-request-failed':

        return 'Network error. Please check your internet connection.';


      // Backend unauthorized
      case 'auth/unauthorized':

        return 'You are not authorized to access this account.';


      // Default
      default:

        return (
          error?.message ||
          'Unable to login. Please try again.'
        );
    }
  }

}