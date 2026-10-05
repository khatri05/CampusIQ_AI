import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegisterComponent {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  role = 'student';

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}


  async register(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';


    /*
     * Validation
     */
    if (!this.firstName.trim()) {
      this.errorMessage =
        'Please enter your first name.';
      return;
    }

    if (!this.lastName.trim()) {
      this.errorMessage =
        'Please enter your last name.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage =
        'Please enter your email address.';
      return;
    }

    if (!this.password) {
      this.errorMessage =
        'Please enter your password.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage =
        'Password must contain at least 6 characters.';
      return;
    }

    if (!this.confirmPassword) {
      this.errorMessage =
        'Please confirm your password.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage =
        'Passwords do not match.';
      return;
    }


    this.isLoading = true;


    try {

      /*
       * Step 1:
       * Create the application user through
       * our Node.js backend.
       *
       * The backend creates:
       *
       * Firebase Authentication user
       * users/{uid}
       * students/{uid} for students
       */
      await this.apiService.post<any>(
        '/auth/register',
        {
          email: this.email.trim(),
          password: this.password,
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          role: this.role
        }
      );


      /*
       * Step 2:
       * Automatically sign in the newly
       * registered user.
       *
       * This is important because the backend
       * creates the Firebase user using Admin SDK,
       * but the Angular application does not
       * automatically have a Firebase session.
       */
      await this.authService.login(
        this.email.trim(),
        this.password
      );


      /*
       * Step 3:
       * Get the authenticated user's profile.
       *
       * The auth interceptor automatically
       * attaches the Firebase ID token.
       */
      const response =
        await this.authService.getUserProfile();

      const user = response?.data;


      if (!user) {
        throw new Error(
          'User profile could not be loaded.'
        );
      }


      /*
       * Step 4:
       * Check whether the account is active.
       */
      if (user.status === 'inactive') {

        await this.authService.logout();

        this.errorMessage =
          'Your account has been deactivated. Please contact the administrator.';

        return;
      }


      /*
       * Step 5:
       * Redirect according to role.
       */
      switch (user.role) {

        case 'student':

          await this.router.navigate([
            '/student/dashboard'
          ]);

          break;


        case 'faculty':

          await this.router.navigate([
            '/faculty/dashboard'
          ]);

          break;


        case 'placement_officer':

          await this.router.navigate([
            '/placement-officer/dashboard'
          ]);

          break;


        case 'admin':

          await this.router.navigate([
            '/admin/dashboard'
          ]);

          break;


        default:

          await this.authService.logout();

          this.errorMessage =
            'Your account does not have a valid role. Please contact the administrator.';

          break;
      }


    } catch (error: any) {

      console.error(
        'Registration error:',
        error
      );


      this.errorMessage =
        this.getRegistrationErrorMessage(
          error
        );

    } finally {

      this.isLoading = false;

    }
  }


  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }


  private getRegistrationErrorMessage(
    error: any
  ): string {

    const errorCode =
      error?.code || '';

    switch (errorCode) {

      case 'auth/email-already-exists':
        return 'An account with this email already exists.';

      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';

      case 'auth/invalid-email':
        return 'Please enter a valid email address.';

      case 'auth/weak-password':
        return 'Password is too weak.';

      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';

      default:

        return (
          error?.error?.message ||
          error?.message ||
          'Unable to create account. Please try again.'
        );
    }
  }
}