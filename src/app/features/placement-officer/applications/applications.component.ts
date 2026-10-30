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
  PlacementApplication,
  PlacementOfficerApplicationsService
} from '../../../core/services/placement-officer-applications.service';


@Component({
  selector:
    'app-applications',

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
    PlacementApplication[] = [];

  filteredApplications:
    PlacementApplication[] = [];


  loading = true;

  errorMessage = '';

  successMessage = '';


  searchText = '';

  statusFilter = 'all';


  selectedApplication:
    PlacementApplication | null = null;


  showViewModal = false;

  showStatusModal = false;


  newStatus = '';


  constructor(
    private applicationsService:
      PlacementOfficerApplicationsService
  ) {}


  ngOnInit(): void {

    this.loadApplications();

  }


  async loadApplications(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.applications =
        await this.applicationsService
          .getApplications();

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Applications loading error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load applications';

    } finally {

      this.loading = false;

    }

  }


  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredApplications =
      this.applications.filter(
        application => {

          const studentName =
            this.getStudentName(
              application
            ).toLowerCase();

          const company =
            this.getCompanyName(
              application
            ).toLowerCase();

          const jobTitle =
            this.getJobTitle(
              application
            ).toLowerCase();

          const email =
            String(
              application.studentEmail ||
              ''
            ).toLowerCase();


          const matchesSearch =
            !search ||
            studentName.includes(search) ||
            company.includes(search) ||
            jobTitle.includes(search) ||
            email.includes(search);


          const status =
            this.getStatus(
              application
            );


          const matchesStatus =
            this.statusFilter === 'all' ||
            status === this.statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = 'all';

    this.applyFilters();

  }


  openViewModal(
    application: PlacementApplication
  ): void {

    this.selectedApplication =
      application;

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedApplication = null;

  }


  openStatusModal(
    application: PlacementApplication
  ): void {

    this.selectedApplication =
      application;

    this.newStatus =
      this.getStatus(
        application
      );

    this.showStatusModal = true;

  }


  closeStatusModal(): void {

    this.showStatusModal = false;

    this.selectedApplication = null;

    this.newStatus = '';

  }


  async updateStatus(): Promise<void> {

    if (
      !this.selectedApplication?.id ||
      !this.newStatus
    ) {
      return;
    }


    try {

      const updated =
        await this.applicationsService
          .updateApplicationStatus(
            this.selectedApplication.id,
            this.newStatus
          );


      const index =
        this.applications.findIndex(
          application =>
            application.id ===
            this.selectedApplication?.id
        );


      if (index !== -1) {

        this.applications[index] =
          updated;

      }


      this.applyFilters();


      this.successMessage =
        'Application status updated successfully';


      this.closeStatusModal();


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Status update error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to update application status';

    }

  }


  getStudentName(
    application: PlacementApplication
  ): string {

    if (
      application.studentName
    ) {
      return application.studentName;
    }

    return 'Student';

  }


  getCompanyName(
    application: PlacementApplication
  ): string {

    return (
      application.companyName ||
      'Company'
    );

  }


  getJobTitle(
    application: PlacementApplication
  ): string {

    return (
      application.jobTitle ||
      'Job Opportunity'
    );

  }


  getStatus(
    application: PlacementApplication
  ): string {

    return String(
      application.status ||
      application.applicationStatus ||
      'applied'
    )
      .trim()
      .toLowerCase();

  }


  getStatusLabel(
    application: PlacementApplication
  ): string {

    const status =
      this.getStatus(
        application
      );


    switch (status) {

      case 'shortlisted':
        return 'Shortlisted';

      case 'selected':
        return 'Selected';

      case 'rejected':
        return 'Rejected';

      case 'applied':
        return 'Applied';

      default:
        return status;

    }

  }


  getStatusClass(
    application: PlacementApplication
  ): string {

    switch (
      this.getStatus(application)
    ) {

      case 'selected':
        return 'status-selected';

      case 'shortlisted':
        return 'status-shortlisted';

      case 'rejected':
        return 'status-rejected';

      default:
        return 'status-applied';

    }

  }


  getApplicationDate(
    application: PlacementApplication
  ): string {

    const value =
      application.appliedAt ||
      application.createdAt;


    if (!value) {
      return '-';
    }


    if (
      typeof value === 'object' &&
      typeof value.toDate ===
        'function'
    ) {

      return value
        .toDate()
        .toLocaleDateString();

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '-';

    }


    return date.toLocaleDateString();

  }


  trackByApplication(
    index: number,
    application: PlacementApplication
  ): string {

    return application.id || index.toString();

  }

}