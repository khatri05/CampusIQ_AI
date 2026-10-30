import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-placement-officer-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  loading = true;

  editing = false;

  saving = false;

  errorMessage = '';

  successMessage = '';

  profile: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: '',
    role: 'placement_officer',
    status: 'active'
  };

  originalProfile: any = {};

  constructor(
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {

    await this.loadProfile();

  }


  async loadProfile(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.authService.getUserProfile();

      if (response?.data) {

        this.profile = {
          ...this.profile,
          ...response.data
        };

        this.originalProfile =
          JSON.parse(
            JSON.stringify(this.profile)
          );

      }

    } catch (error: any) {

      console.error(
        'Placement Officer profile error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to load profile. Please try again.';

    } finally {

      this.loading = false;

    }

  }


  startEditing(): void {

    this.successMessage = '';

    this.errorMessage = '';

    this.originalProfile =
      JSON.parse(
        JSON.stringify(this.profile)
      );

    this.editing = true;

  }


  cancelEditing(): void {

    this.profile =
      JSON.parse(
        JSON.stringify(this.originalProfile)
      );

    this.editing = false;

    this.successMessage = '';

    this.errorMessage = '';

  }


  async saveProfile(): Promise<void> {

    this.saving = true;

    this.successMessage = '';

    this.errorMessage = '';

    try {

      /*
       * Connect this to the profile update
       * API when the authenticated update
       * endpoint is added to the backend.
       */

      this.originalProfile =
        JSON.parse(
          JSON.stringify(this.profile)
        );

      this.editing = false;

      this.successMessage =
        'Profile updated successfully.';

    } catch (error: any) {

      console.error(
        'Update profile error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to update profile.';

    } finally {

      this.saving = false;

    }

  }


  getFullName(): string {

    const firstName =
      this.profile.firstName || '';

    const lastName =
      this.profile.lastName || '';

    return (
      `${firstName} ${lastName}`.trim()
    ) || 'Placement Officer';

  }


  getInitials(): string {

    const first =
      this.profile.firstName?.charAt(0) || 'P';

    const last =
      this.profile.lastName?.charAt(0) || 'O';

    return (
      first + last
    ).toUpperCase();

  }


  getRoleName(): string {

    if (
      this.profile.role ===
      'placement_officer'
    ) {
      return 'Placement Officer';
    }

    return (
      this.profile.role ||
      'Placement Officer'
    );

  }


  getStatusName(): string {

    return (
      this.profile.status ||
      'active'
    )
      .toString()
      .replace(
        /^./,
        (char: string) =>
          char.toUpperCase()
      );

  }

}