import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  // ==========================================
  // Form
  // ==========================================

  email = '';


  // ==========================================
  // UI State
  // ==========================================

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  currentYear = new Date().getFullYear();


  // ==========================================
  // Constructor
  // ==========================================

  constructor(
    private authService: AuthService
  ) {}


  // ==========================================
  // Send Reset Email
  // ==========================================

  async sendResetEmail(): Promise<void> {

    this.errorMessage = '';

    this.successMessage = '';


    // ------------------------------------------
    // Validate email
    // ------------------------------------------

    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }


    if (!this.isValidEmail(this.email)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }


    this.isLoading = true;


    try {

      // ----------------------------------------
      // Firebase Password Reset
      // ----------------------------------------

      await this.authService.resetPassword(
        this.email.trim()
      );


      // ----------------------------------------
      // Success
      // ----------------------------------------

      this.successMessage =
        'Password reset link has been sent to your email address.';


      this.email = '';


    } catch (error: any) {

      console.error(
        'Password reset error:',
        error
      );


      this.errorMessage =
        this.getErrorMessage(error);


    } finally {

      this.isLoading = false;

    }
  }


  // ==========================================
  // Email Validation
  // ==========================================

  private isValidEmail(
    email: string
  ): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(
      email.trim()
    );
  }


  // ==========================================
  // Error Handler
  // ==========================================

  private getErrorMessage(
    error: any
  ): string {

    switch (error?.code) {

      case 'auth/user-not-found':

        return 'No account was found with this email address.';


      case 'auth/invalid-email':

        return 'Please enter a valid email address.';


      case 'auth/too-many-requests':

        return 'Too many requests. Please try again later.';


      case 'auth/network-request-failed':

        return 'Network error. Please check your internet connection.';


      default:

        return (
          error?.message ||
          'Unable to send the password reset email. Please try again.'
        );
    }
  }

}