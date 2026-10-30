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
  AdminApplicationsService,
  AdminApplication
} from '../../../core/services/admin-applications.service';


@Component({
  selector: 'app-applications',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './applications.component.html',

  styleUrl:
    './applications.component.css'
})
export class ApplicationsComponent
  implements OnInit {


  applications:
    AdminApplication[] = [];

  filteredApplications:
    AdminApplication[] = [];


  searchTerm = '';

  statusFilter = 'all';


  loading = false;

  errorMessage = '';

  successMessage = '';


  selectedApplication:
    AdminApplication | null = null;

  editingApplication:
    AdminApplication | null = null;


  showViewModal = false;

  showEditModal = false;


  totalApplications = 0;

  appliedApplications = 0;

  shortlistedApplications = 0;

  interviewApplications = 0;

  selectedApplications = 0;

  rejectedApplications = 0;


  constructor(
    private applicationService:
      AdminApplicationsService
  ) {}


  ngOnInit(): void {

    this.loadApplications();

  }


  /*
  LOAD APPLICATIONS
  */

  async loadApplications(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.applicationService
          .getAllApplications();

      this.applications =
        response.data || [];

      this.applyFilters();

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Load applications error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load applications.';

    } finally {

      this.loading = false;

    }
  }


  /*
  STATISTICS
  */

  calculateStatistics(): void {

    this.totalApplications =
      this.applications.length;


    this.appliedApplications =
      this.countByStatus(
        'Applied'
      );


    this.shortlistedApplications =
      this.countByStatus(
        'Shortlisted'
      );


    this.interviewApplications =
      this.countByStatus(
        'Interview'
      );


    this.selectedApplications =
      this.countByStatus(
        'Selected'
      );


    this.rejectedApplications =
      this.countByStatus(
        'Rejected'
      );
  }


  countByStatus(
    status: string
  ): number {

    return this.applications.filter(
      application =>
        application.status === status
    ).length;
  }


  /*
  SEARCH + FILTER
  */

  applyFilters(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredApplications =
      this.applications.filter(
        application => {

          const matchesSearch =
            !term ||

            application.studentId
              ?.toLowerCase()
              .includes(term) ||

            application.jobId
              ?.toLowerCase()
              .includes(term) ||

            application.status
              ?.toLowerCase()
              .includes(term);


          const matchesStatus =
            this.statusFilter === 'all' ||

            application.status ===
              this.statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );
  }


  onSearch(): void {

    this.applyFilters();

  }


  onStatusChange(): void {

    this.applyFilters();

  }


  clearFilters(): void {

    this.searchTerm = '';

    this.statusFilter = 'all';

    this.applyFilters();

  }


  /*
  VIEW
  */

  viewApplication(
    application: AdminApplication
  ): void {

    this.selectedApplication = {
      ...application
    };

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedApplication = null;

  }


  /*
  EDIT STATUS
  */

  editApplication(
    application: AdminApplication
  ): void {

    this.editingApplication = {
      ...application
    };

    this.showEditModal = true;

    this.errorMessage = '';

  }


  closeEditModal(): void {

    this.showEditModal = false;

    this.editingApplication = null;

  }


  /*
  SAVE STATUS
  */

  async saveApplicationStatus(): Promise<void> {

    if (!this.editingApplication) {
      return;
    }


    const id =
      this.editingApplication.id;


    if (!id) {

      this.errorMessage =
        'Application ID is missing.';

      return;
    }


    if (
      !this.editingApplication.status
    ) {

      this.errorMessage =
        'Application status is required.';

      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      const response =
        await this.applicationService
          .updateApplicationStatus(
            id,
            this.editingApplication.status,
            this.editingApplication.remarks || ''
          );


      const updatedApplication =
        response.data;


      const index =
        this.applications.findIndex(
          application =>
            application.id === id
        );


      if (index !== -1) {

        this.applications[index] =
          updatedApplication;

      }


      this.applyFilters();

      this.calculateStatistics();


      this.showEditModal = false;

      this.editingApplication = null;


      this.successMessage =
        'Application status updated successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Update application error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to update application.';

    } finally {

      this.loading = false;

    }
  }


  /*
  DELETE
  */

  async deleteApplication(
    application: AdminApplication
  ): Promise<void> {

    const id =
      application.id;


    if (!id) {
      return;
    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this application?'
      );


    if (!confirmed) {
      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      await this.applicationService
        .deleteApplication(id);


      this.applications =
        this.applications.filter(
          item =>
            item.id !== id
        );


      this.applyFilters();

      this.calculateStatistics();


      this.successMessage =
        'Application deleted successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Delete application error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to delete application.';

    } finally {

      this.loading = false;

    }
  }


  /*
  DATE
  */

  formatDate(
    date: any
  ): string {

    if (!date) {
      return 'N/A';
    }


    try {

      const value =
        date?.toDate
          ? date.toDate()
          : new Date(date);


      if (
        isNaN(
          value.getTime()
        )
      ) {

        return 'N/A';

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

      return 'N/A';

    }
  }


  /*
  STATUS CLASS
  */

  getStatusClass(
    status?: string
  ): string {

    switch (status) {

      case 'Applied':
        return 'applied';

      case 'Shortlisted':
        return 'shortlisted';

      case 'Interview':
        return 'interview';

      case 'Selected':
        return 'selected';

      case 'Rejected':
        return 'rejected';

      case 'Withdrawn':
        return 'withdrawn';

      default:
        return '';

    }
  }

}