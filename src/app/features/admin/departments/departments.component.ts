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
  AdminDepartmentsService,
  AdminDepartment
} from '../../../core/services/admin-departments.service';

@Component({
  selector: 'app-departments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent
  implements OnInit {

  departments: AdminDepartment[] = [];

  filteredDepartments:
    AdminDepartment[] = [];

  searchTerm = '';

  loading = false;

  errorMessage = '';

  successMessage = '';

  selectedDepartment:
    AdminDepartment | null = null;

  editingDepartment:
    AdminDepartment | null = null;

  showViewModal = false;

  showEditModal = false;

  totalDepartments = 0;

  activeDepartments = 0;

  inactiveDepartments = 0;

  constructor(
    private departmentService:
      AdminDepartmentsService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }


  /*
  LOAD DEPARTMENTS
  */

  async loadDepartments(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.departmentService
          .getAllDepartments();

      this.departments =
        response.data || [];

      this.filteredDepartments =
        [...this.departments];

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Load departments error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load departments.';

    } finally {

      this.loading = false;
    }
  }


  /*
  STATISTICS
  */

  calculateStatistics(): void {

    this.totalDepartments =
      this.departments.length;

    this.activeDepartments =
      this.departments.filter(
        department =>
          !department.status ||
          department.status
            ?.toLowerCase() === 'active'
      ).length;

    this.inactiveDepartments =
      this.departments.filter(
        department =>
          department.status
            ?.toLowerCase() === 'inactive'
      ).length;
  }


  /*
  SEARCH
  */

  onSearch(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!term) {

      this.filteredDepartments =
        [...this.departments];

      return;
    }

    this.filteredDepartments =
      this.departments.filter(
        department =>
          department.name
            ?.toLowerCase()
            .includes(term) ||

          department.code
            ?.toLowerCase()
            .includes(term) ||

          department.description
            ?.toLowerCase()
            .includes(term) ||

          department.hod
            ?.toLowerCase()
            .includes(term)
      );
  }


  /*
  VIEW DEPARTMENT
  */

  viewDepartment(
    department: AdminDepartment
  ): void {

    this.selectedDepartment = {
      ...department
    };

    this.showViewModal = true;
  }


  /*
  CLOSE VIEW
  */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedDepartment = null;
  }


  /*
  EDIT DEPARTMENT
  */

  editDepartment(
    department: AdminDepartment
  ): void {

    this.editingDepartment = {
      ...department
    };

    this.showEditModal = true;

    this.successMessage = '';
    this.errorMessage = '';
  }


  /*
  CLOSE EDIT
  */

  closeEditModal(): void {

    this.showEditModal = false;

    this.editingDepartment = null;
  }


  /*
  SAVE DEPARTMENT
  */

  async saveDepartment(): Promise<void> {

    if (!this.editingDepartment) {
      return;
    }

    const id =
      this.editingDepartment.id;

    if (!id) {

      this.errorMessage =
        'Department ID is missing.';

      return;
    }

    if (
      !this.editingDepartment.name?.trim()
    ) {

      this.errorMessage =
        'Department name is required.';

      return;
    }

    if (
      !this.editingDepartment.code?.trim()
    ) {

      this.errorMessage =
        'Department code is required.';

      return;
    }

    try {

      this.loading = true;

      this.errorMessage = '';

      const updateData = {
        name:
          this.editingDepartment.name
            ?.trim(),

        code:
          this.editingDepartment.code
            ?.trim(),

        description:
          this.editingDepartment.description
            ?.trim() || '',

        hod:
          this.editingDepartment.hod
            ?.trim() || '',

        status:
          this.editingDepartment.status
            ?.trim() || 'active'
      };

      const response =
        await this.departmentService
          .updateDepartment(
            id,
            updateData
          );

      const updatedDepartment =
        response.data;

      const index =
        this.departments.findIndex(
          department =>
            department.id === id
        );

      if (index !== -1) {

        this.departments[index] =
          updatedDepartment;
      }

      this.filteredDepartments =
        [...this.departments];

      this.calculateStatistics();

      this.showEditModal = false;

      this.editingDepartment = null;

      this.successMessage =
        'Department updated successfully.';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    } catch (error: any) {

      console.error(
        'Update department error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to update department.';

    } finally {

      this.loading = false;
    }
  }


  /*
  DELETE DEPARTMENT
  */

  async deleteDepartment(
    department: AdminDepartment
  ): Promise<void> {

    const id = department.id;

    if (!id) {
      return;
    }

    const confirmed =
      confirm(
        `Are you sure you want to delete "${department.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      this.loading = true;

      this.errorMessage = '';

      await this.departmentService
        .deleteDepartment(id);

      this.departments =
        this.departments.filter(
          item =>
            item.id !== id
        );

      this.filteredDepartments =
        this.filteredDepartments.filter(
          item =>
            item.id !== id
        );

      this.calculateStatistics();

      this.successMessage =
        'Department deleted successfully.';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    } catch (error: any) {

      console.error(
        'Delete department error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to delete department.';

    } finally {

      this.loading = false;
    }
  }


  /*
  CLEAR SEARCH
  */

  clearSearch(): void {

    this.searchTerm = '';

    this.filteredDepartments =
      [...this.departments];
  }
}