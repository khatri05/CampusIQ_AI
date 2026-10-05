import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  student: any = null;

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  isEditing = false;

  editProfile: any = {
    firstName: '',
    lastName: '',
    phone: '',
    departmentId: '',
    semester: null,
    division: '',
    admissionYear: null,
    graduationYear: null,
    profileImage: ''
  };


  constructor(
    private apiService: ApiService
  ) {}


  async ngOnInit(): Promise<void> {
    await this.loadStudentProfile();
  }


  async loadStudentProfile(): Promise<void> {

    try {

      this.loading = true;
      this.errorMessage = '';

      const response =
        await this.apiService.get<any>(
          '/students/me'
        );

      console.log(
        'Student profile response:',
        response
      );

      this.student = response?.data || null;

    } catch (error: any) {

      console.error(
        'Student profile error:',
        error
      );

      this.student = null;

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load student profile.';

    } finally {

      this.loading = false;

    }
  }


  startEditing(): void {

    if (!this.student) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    /*
     * Copy current profile data into
     * the edit object.
     *
     * We use a separate object so the
     * displayed profile does not change
     * until Save is clicked.
     */
    this.editProfile = {
      firstName:
        this.student.firstName || '',

      lastName:
        this.student.lastName || '',

      phone:
        this.student.phone || '',

      departmentId:
        this.student.departmentId || '',

      semester:
        this.student.semester ?? null,

      division:
        this.student.division || '',

      admissionYear:
        this.student.admissionYear ?? null,

      graduationYear:
        this.student.graduationYear ?? null,

      profileImage:
        this.student.profileImage || ''
    };

    this.isEditing = true;
  }


  cancelEditing(): void {

    this.isEditing = false;

    this.errorMessage = '';
    this.successMessage = '';

  }


  async saveProfile(): Promise<void> {

    if (!this.student) {
      return;
    }


    /*
     * Basic validation
     */

    if (!this.editProfile.firstName?.trim()) {

      this.errorMessage =
        'First name is required.';

      return;
    }


    if (!this.editProfile.lastName?.trim()) {

      this.errorMessage =
        'Last name is required.';

      return;
    }


    if (
      this.editProfile.phone &&
      !/^[0-9]{10}$/.test(
        this.editProfile.phone.trim()
      )
    ) {

      this.errorMessage =
        'Please enter a valid 10-digit phone number.';

      return;
    }


    this.saving = true;

    this.errorMessage = '';
    this.successMessage = '';


    try {

      /*
       * IMPORTANT:
       *
       * We do NOT send UID.
       * Backend gets UID from Firebase
       * authentication token.
       */
      const payload = {

        firstName:
          this.editProfile.firstName.trim(),

        lastName:
          this.editProfile.lastName.trim(),

        phone:
          this.editProfile.phone?.trim() || '',

        departmentId:
          this.editProfile.departmentId?.trim() || '',

        semester:
          this.editProfile.semester === '' ||
          this.editProfile.semester === null
            ? null
            : Number(this.editProfile.semester),

        division:
          this.editProfile.division?.trim() || '',

        admissionYear:
          this.editProfile.admissionYear === '' ||
          this.editProfile.admissionYear === null
            ? null
            : Number(this.editProfile.admissionYear),

        graduationYear:
          this.editProfile.graduationYear === '' ||
          this.editProfile.graduationYear === null
            ? null
            : Number(this.editProfile.graduationYear),

        profileImage:
          this.editProfile.profileImage?.trim() || ''
      };


      console.log(
        'Updating student profile:',
        payload
      );


      const response =
        await this.apiService.put<any>(
          '/students/me',
          payload
        );


      console.log(
        'Profile update response:',
        response
      );


      /*
       * Replace displayed profile with
       * the updated Firestore data.
       */
      if (response?.data) {

        this.student =
          response.data;

      } else {

        /*
         * If backend doesn't return data,
         * reload the profile.
         */
        await this.loadStudentProfile();
      }


      this.isEditing = false;

      this.successMessage =
        'Profile updated successfully.';


      /*
       * Remove success message after
       * a few seconds.
       */
      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Profile update error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to update profile. Please try again.';

    } finally {

      this.saving = false;

    }
  }


  get initials(): string {

    const first =
      this.student?.firstName
        ?.charAt(0)
        ?.toUpperCase() || '';

    const last =
      this.student?.lastName
        ?.charAt(0)
        ?.toUpperCase() || '';

    return `${first}${last}` || 'ST';
  }


  get editInitials(): string {

    const first =
      this.editProfile?.firstName
        ?.charAt(0)
        ?.toUpperCase() || '';

    const last =
      this.editProfile?.lastName
        ?.charAt(0)
        ?.toUpperCase() || '';

    return `${first}${last}` || 'ST';
  }

}