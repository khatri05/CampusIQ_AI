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
  AdminFaculty,
  AdminFacultyService
} from '../../../core/services/admin-faculty.service';


@Component({
  selector: 'app-admin-faculty',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './faculty.component.html',

  styleUrl:
    './faculty.component.css'
})
export class FacultyComponent
  implements OnInit {


  // ==========================================
  // DATA
  // ==========================================

  faculty: AdminFaculty[] = [];

  filteredFaculty: AdminFaculty[] = [];


  // ==========================================
  // FILTERS
  // ==========================================

  searchText = '';

  selectedDepartment = 'all';

  selectedStatus = 'all';


  // ==========================================
  // UI STATE
  // ==========================================

  loading = true;

  errorMessage = '';

  actionMessage = '';

  actionError = '';


  // ==========================================
  // VIEW MODAL
  // ==========================================

  selectedFaculty:
    AdminFaculty | null = null;

  showDetailsModal = false;


  // ==========================================
  // EDIT MODAL
  // ==========================================

  editingFaculty:
    AdminFaculty | null = null;

  showEditModal = false;

  saving = false;

  deleting = false;


  constructor(
    private facultyService:
      AdminFacultyService
  ) {}


  ngOnInit(): void {

    this.loadFaculty();

  }


  // ==========================================
  // LOAD FACULTY
  // ==========================================

  async loadFaculty(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.facultyService
          .getAllFaculty();


      this.faculty =
        response.data || [];


      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Faculty loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        'Unable to load faculty. Please try again.';

    } finally {

      this.loading = false;

    }

  }


  // ==========================================
  // FILTERS
  // ==========================================

  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredFaculty =
      this.faculty.filter(
        member => {

          const fullName =
            `${member.firstName || ''} ${member.lastName || ''}`
              .trim()
              .toLowerCase();


          const email =
            (
              member.email || ''
            ).toLowerCase();


          const employeeId =
            (
              member.employeeId || ''
            ).toLowerCase();


          const designation =
            (
              member.designation || ''
            ).toLowerCase();


          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            email.includes(search) ||
            employeeId.includes(search) ||
            designation.includes(search);


          const matchesDepartment =
            this.selectedDepartment === 'all' ||
            member.departmentId ===
              this.selectedDepartment;


          const status =
            (
              member.status ||
              'active'
            ).toLowerCase();


          const matchesStatus =
            this.selectedStatus === 'all' ||
            status === this.selectedStatus;


          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );

        }
      );

  }


  onSearch(): void {

    this.applyFilters();

  }


  onDepartmentChange(): void {

    this.applyFilters();

  }


  onStatusChange(): void {

    this.applyFilters();

  }


  // ==========================================
  // DEPARTMENTS
  // ==========================================

  get departments(): string[] {

    return Array.from(
      new Set(
        this.faculty
          .map(
            member =>
              member.departmentId
          )
          .filter(
            (
              department
            ): department is string =>
              !!department
          )
      )
    );

  }


  // ==========================================
  // STATISTICS
  // ==========================================

  get totalFaculty(): number {

    return this.faculty.length;

  }


  get activeFaculty(): number {

    return this.faculty.filter(
      member =>
        (
          member.status ||
          'active'
        ).toLowerCase() ===
        'active'
    ).length;

  }


  get inactiveFaculty(): number {

    return this.faculty.filter(
      member =>
        (
          member.status ||
          'active'
        ).toLowerCase() !==
        'active'
    ).length;

  }


  // ==========================================
  // NAME
  // ==========================================

  getFacultyName(
    member: AdminFaculty
  ): string {

    const name =
      `${member.firstName || ''} ${member.lastName || ''}`
        .trim();


    return name ||
      'Unnamed Faculty';

  }


  // ==========================================
  // INITIALS
  // ==========================================

  getInitials(
    member: AdminFaculty
  ): string {

    const first =
      member.firstName
        ?.charAt(0)
        ?.toUpperCase() ||
      'F';


    const last =
      member.lastName
        ?.charAt(0)
        ?.toUpperCase() ||
      '';


    return `${first}${last}`;

  }


  // ==========================================
  // STATUS
  // ==========================================

  getStatus(
    member: AdminFaculty
  ): string {

    return member.status ||
      'active';

  }


  // ==========================================
  // DEPARTMENT
  // ==========================================

  getDepartmentName(
    member: AdminFaculty
  ): string {

    return (
      member.departmentName ||
      member.departmentId ||
      'Not assigned'
    );

  }


  // ==========================================
  // VIEW
  // ==========================================

  openDetails(
    member: AdminFaculty
  ): void {

    this.selectedFaculty =
      member;

    this.showDetailsModal =
      true;

  }


  closeDetails(): void {

    this.showDetailsModal =
      false;

    this.selectedFaculty =
      null;

  }


  // ==========================================
  // EDIT
  // ==========================================

  startEdit(
    member: AdminFaculty
  ): void {

    this.editingFaculty = {
      ...member
    };


    this.actionError = '';

    this.actionMessage = '';

    this.showEditModal = true;

  }


  cancelEdit(): void {

    if (this.saving) {

      return;

    }


    this.showEditModal =
      false;

    this.editingFaculty =
      null;

    this.actionError = '';

  }


  async saveFaculty(): Promise<void> {

    if (!this.editingFaculty) {

      return;

    }


    const facultyId =
      this.editingFaculty.id ||
      this.editingFaculty.uid;


    if (!facultyId) {

      this.actionError =
        'Faculty ID is missing.';

      return;

    }


    if (
      !this.editingFaculty.firstName?.trim()
    ) {

      this.actionError =
        'First name is required.';

      return;

    }


    if (
      !this.editingFaculty.lastName?.trim()
    ) {

      this.actionError =
        'Last name is required.';

      return;

    }


    this.saving = true;

    this.actionError = '';

    this.actionMessage = '';


    try {

      const response =
        await this.facultyService
          .updateFaculty(
            facultyId,
            {

              employeeId:
                this.editingFaculty.employeeId
                  ?.trim(),

              firstName:
                this.editingFaculty.firstName
                  .trim(),

              lastName:
                this.editingFaculty.lastName
                  .trim(),

              departmentId:
                this.editingFaculty.departmentId
                  ?.trim(),

              designation:
                this.editingFaculty.designation
                  ?.trim(),

              qualification:
                this.editingFaculty.qualification
                  ?.trim(),

              specialization:
                this.editingFaculty.specialization
                  ?.trim(),

              phone:
                this.editingFaculty.phone
                  ?.trim(),

              joiningDate:
                this.editingFaculty.joiningDate
                  ?.trim(),

              status:
                this.editingFaculty.status
                  ?.trim()

            }
          );


      const index =
        this.faculty.findIndex(
          member =>
            (
              member.id ||
              member.uid
            ) === facultyId
        );


      if (index !== -1) {

        this.faculty[index] =
          response.data;

      }


      this.applyFilters();


      this.showEditModal =
        false;

      this.editingFaculty =
        null;


      this.actionMessage =
        'Faculty updated successfully.';


      setTimeout(() => {

        this.actionMessage = '';

      }, 4000);

    } catch (error: any) {

      console.error(
        'Update faculty error:',
        error
      );


      this.actionError =
        error?.error?.message ||
        'Unable to update faculty.';

    } finally {

      this.saving = false;

    }

  }


  // ==========================================
  // DELETE
  // ==========================================

  async deleteFaculty(
    member: AdminFaculty
  ): Promise<void> {

    const facultyId =
      member.id ||
      member.uid;


    if (!facultyId) {

      this.actionError =
        'Faculty ID is missing.';

      return;

    }


    const facultyName =
      this.getFacultyName(member);


    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${facultyName}?`
      );


    if (!confirmed) {

      return;

    }


    this.deleting = true;

    this.actionError = '';

    this.actionMessage = '';


    try {

      await this.facultyService
        .deleteFaculty(
          facultyId
        );


      this.faculty =
        this.faculty.filter(
          item =>
            (
              item.id ||
              item.uid
            ) !== facultyId
        );


      this.applyFilters();


      if (
        (
          this.selectedFaculty?.id ||
          this.selectedFaculty?.uid
        ) === facultyId
      ) {

        this.closeDetails();

      }


      this.actionMessage =
        'Faculty deleted successfully.';


      setTimeout(() => {

        this.actionMessage = '';

      }, 4000);

    } catch (error: any) {

      console.error(
        'Delete faculty error:',
        error
      );


      this.actionError =
        error?.error?.message ||
        'Unable to delete faculty.';

    } finally {

      this.deleting = false;

    }

  }


  // ==========================================
  // RETRY
  // ==========================================

  retry(): void {

    this.loadFaculty();

  }

}