import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ApiService
} from '../../../core/services/api.service';


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

  // Stores the department name for display.
  departmentName = '';

  // Stores departments for the edit dropdown.
  departments: any[] = [];

  departmentsLoading = false;

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


  // ========================================
  // INITIALIZATION
  // ========================================

  async ngOnInit(): Promise<void> {
    await this.loadStudentProfile();
    await this.loadDepartments();
  }


  // ========================================
  // LOAD STUDENT PROFILE
  // ========================================

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

      this.student =
        response?.data || null;

      // Resolve the department name from its ID.
      await this.loadDepartmentName();

    } catch (error: any) {

      console.error(
        'Student profile error:',
        error
      );

      this.student = null;

      this.departmentName = '';

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load student profile.';

    } finally {

      this.loading = false;

    }

  }


  // ========================================
  // LOAD DEPARTMENTS
  // ========================================

  async loadDepartments(): Promise<void> {

    this.departmentsLoading = true;

    try {

      const response =
        await this.apiService.get<any>(
          '/departments'
        );

      this.departments =
        Array.isArray(response?.data)
          ? response.data
          : [];

      // Refresh the displayed name using
      // the department list, if available.
      this.resolveDepartmentName();

    } catch (error) {

      console.error(
        'Error loading departments:',
        error
      );

      this.departments = [];

    } finally {

      this.departmentsLoading = false;

    }

  }


  // ========================================
  // LOAD DEPARTMENT NAME
  // ========================================

  async loadDepartmentName(): Promise<void> {

    const departmentId =
      this.student?.departmentId;

    if (!departmentId) {

      this.departmentName = '';

      return;

    }

    // First check whether the department
    // is already available in the list.
    const existingDepartment =
      this.departments.find(
        department =>
          department.id === departmentId
      );

    if (existingDepartment) {

      this.departmentName =
        existingDepartment.name || '';

      return;

    }

    try {

      const response =
        await this.apiService.get<any>(
          `/departments/${encodeURIComponent(departmentId)}`
        );

      const department =
        response?.data;

      this.departmentName =
        department?.name || '';

    } catch (error) {

      console.error(
        'Error loading department name:',
        error
      );

      // Fall back to the department list.
      this.resolveDepartmentName();

    }

  }


  // ========================================
  // RESOLVE DEPARTMENT NAME
  // ========================================

  resolveDepartmentName(): void {

    const departmentId =
      this.student?.departmentId;

    if (!departmentId) {

      this.departmentName = '';

      return;

    }

    const department =
      this.departments.find(
        item =>
          item.id === departmentId
      );

    if (department?.name) {

      this.departmentName =
        department.name;

    }

  }


  // ========================================
  // DEPARTMENT SELECTION
  // ========================================

  onDepartmentChange(): void {

    const department =
      this.departments.find(
        item =>
          item.id === this.editProfile.departmentId
      );

    if (department) {

      this.departmentName =
        department.name || '';

    }

  }


  // ========================================
  // START EDITING
  // ========================================

  startEditing(): void {

    if (!this.student) {

      return;

    }

    this.errorMessage = '';

    this.successMessage = '';

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


  // ========================================
  // CANCEL EDITING
  // ========================================

  cancelEditing(): void {

    this.isEditing = false;

    this.errorMessage = '';

    this.successMessage = '';

    // Restore the displayed department name
    // from the unchanged student profile.
    this.resolveDepartmentName();

  }


  // ========================================
  // SAVE PROFILE
  // ========================================

  async saveProfile(): Promise<void> {

    if (!this.student) {

      return;

    }


    // Validate first name.
    if (
      !this.editProfile.firstName?.trim()
    ) {

      this.errorMessage =
        'First name is required.';

      return;

    }


    // Validate last name.
    if (
      !this.editProfile.lastName?.trim()
    ) {

      this.errorMessage =
        'Last name is required.';

      return;

    }


    // Validate phone number.
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

      const payload = {

        firstName:
          this.editProfile.firstName.trim(),

        lastName:
          this.editProfile.lastName.trim(),

        phone:
          this.editProfile.phone?.trim() || '',

        // Continue storing the department ID.
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


      if (response?.data) {

        this.student =
          response.data;

      } else {

        await this.loadStudentProfile();

      }


      // Refresh the department name after saving.
      await this.loadDepartmentName();


      this.isEditing = false;

      this.successMessage =
        'Profile updated successfully.';


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


  // ========================================
  // INITIALS
  // ========================================

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


  // ========================================
  // EDIT INITIALS
  // ========================================

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