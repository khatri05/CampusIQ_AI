import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  AuthService
} from '../../../core/services/auth.service';


interface AdminProfile {
  id?: string;
  uid?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}


@Component({
  selector: 'app-admin-profile',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './profile.component.html',

  styleUrl:
    './profile.component.css'
})
export class ProfileComponent
  implements OnInit {

  profile: AdminProfile | null = null;

  loading = true;

  errorMessage = '';

  constructor(
    private authService: AuthService
  ) {}


  ngOnInit(): void {

    this.loadProfile();

  }


  async loadProfile(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.authService
          .getUserProfile();

      this.profile =
        response?.data || null;

      if (!this.profile) {

        this.errorMessage =
          'Admin profile not found.';

      }

    } catch (error) {

      console.error(
        'Admin profile error:',
        error
      );

      this.errorMessage =
        'Unable to load admin profile. Please try again.';

    } finally {

      this.loading = false;

    }

  }


  get fullName(): string {

    const firstName =
      this.profile?.firstName || '';

    const lastName =
      this.profile?.lastName || '';

    const name =
      `${firstName} ${lastName}`.trim();

    return name || 'Administrator';

  }


  get initials(): string {

    const first =
      this.profile?.firstName
        ?.charAt(0)
        ?.toUpperCase() || 'A';

    const last =
      this.profile?.lastName
        ?.charAt(0)
        ?.toUpperCase() || '';

    return `${first}${last}`;

  }


  get formattedRole(): string {

    const role =
      this.profile?.role || 'admin';

    return role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  get accountStatus(): string {

    return this.profile?.status || 'active';

  }


  get statusClass(): string {

    return this.accountStatus
      .toLowerCase() === 'active'
      ? 'status-active'
      : 'status-inactive';

  }


  formatDate(date: any): string {

    if (!date) {
      return 'Not available';
    }

    try {

      let value: Date;

      if (
        date?._seconds !== undefined
      ) {

        value = new Date(
          date._seconds * 1000
        );

      } else if (
        date?.seconds !== undefined
      ) {

        value = new Date(
          date.seconds * 1000
        );

      } else {

        value = new Date(date);

      }

      if (isNaN(value.getTime())) {
        return 'Not available';
      }

      return value.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

    } catch {

      return 'Not available';

    }

  }


  async changePassword(): Promise<void> {

    const email =
      this.profile?.email;

    if (!email) {

      alert(
        'Email address is not available.'
      );

      return;

    }

    try {

      await this.authService
        .resetPassword(email);

      alert(
        'Password reset link has been sent to your registered email address.'
      );

    } catch (error) {

      console.error(
        'Password reset error:',
        error
      );

      alert(
        'Unable to send password reset email.'
      );

    }

  }


  retry(): void {

    this.loadProfile();

  }

}