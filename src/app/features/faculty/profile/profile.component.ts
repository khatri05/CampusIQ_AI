import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ApiService
} from '../../../core/services/api.service';
import { DatePipe } from '@angular/common';


interface FacultyProfile {

  id?: string;

  uid?: string;

  employeeId?: string;

  firstName: string;

  lastName: string;

  email: string;

  departmentId?: string;

  departmentName?: string;

  designation?: string;

  qualification?: string;

  specialization?: string;

  phone?: string;

  joiningDate?: any;

  status?: string;

  profileImage?: string;
}


@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    FormsModule,
    DatePipe
  ],

  templateUrl: './profile.component.html',

  styleUrl: './profile.component.css'
})
export class ProfileComponent
  implements OnInit {


  profile: FacultyProfile = {

    firstName: '',

    lastName: '',

    email: '',

    employeeId: '',

    departmentId: '',

    departmentName: '',

    designation: '',

    qualification: '',

    specialization: '',

    phone: '',

    joiningDate: '',

    status: 'active',

    profileImage: ''
  };


  editProfile: FacultyProfile = {
    ...this.profile
  };


  isLoading = true;

  isSaving = false;

  isEditing = false;


  errorMessage = '';

  successMessage = '';


  constructor(
    private apiService: ApiService
  ) {}


  ngOnInit(): void {

    this.loadProfile();

  }


  /*
  ========================================
  LOAD PROFILE
  ========================================
  */

  async loadProfile(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/faculty/me'
        );


      this.profile = {
        ...this.profile,
        ...response.data
      };


      this.editProfile = {
        ...this.profile
      };


    } catch (error: any) {

      console.error(
        'Faculty profile error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        'Unable to load faculty profile.';

    } finally {

      this.isLoading = false;

    }
  }


  /*
  ========================================
  START EDITING
  ========================================
  */

  startEditing(): void {

    this.editProfile = {
      ...this.profile
    };

    this.errorMessage = '';

    this.successMessage = '';

    this.isEditing = true;

  }


  /*
  ========================================
  CANCEL EDITING
  ========================================
  */

  cancelEditing(): void {

    this.editProfile = {
      ...this.profile
    };

    this.errorMessage = '';

    this.isEditing = false;

  }


  /*
  ========================================
  SAVE PROFILE
  ========================================
  */

  async saveProfile(): Promise<void> {

    if (this.isSaving) {
      return;
    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    try {

      const payload = {

        firstName:
          this.editProfile.firstName?.trim(),

        lastName:
          this.editProfile.lastName?.trim(),

        phone:
          this.editProfile.phone?.trim(),

        designation:
          this.editProfile.designation?.trim(),

        qualification:
          this.editProfile.qualification?.trim(),

        specialization:
          this.editProfile.specialization?.trim(),

        profileImage:
          this.editProfile.profileImage?.trim()

      };


      const response =
        await this.apiService.put<any>(
          '/faculty/me',
          payload
        );


      this.profile = {
        ...this.profile,
        ...response.data
      };


      this.editProfile = {
        ...this.profile
      };


      this.isEditing = false;

      this.successMessage =
        response.message ||
        'Profile updated successfully.';


    } catch (error: any) {

      console.error(
        'Update faculty profile error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        'Unable to update profile.';

    } finally {

      this.isSaving = false;

    }
  }


  /*
  ========================================
  FULL NAME
  ========================================
  */

  get fullName(): string {

    const firstName =
      this.profile.firstName || '';

    const lastName =
      this.profile.lastName || '';

    return (
      `${firstName} ${lastName}`.trim()
      || 'Faculty'
    );

  }


  /*
  ========================================
  INITIALS
  ========================================
  */

  get initials(): string {

    const first =
      this.profile.firstName
        ?.charAt(0)
        .toUpperCase() || '';

    const last =
      this.profile.lastName
        ?.charAt(0)
        .toUpperCase() || '';

    return `${first}${last}` || 'FC';

  }


  /*
  ========================================
  STATUS
  ========================================
  */

  get isActive(): boolean {

    return (
      this.profile.status?.toLowerCase()
      === 'active'
    );

  }

}