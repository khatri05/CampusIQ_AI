import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface JobApplication {
  id?: string;
  jobId: string;
  studentId: string;
  coverLetter: string;
  resumeUrl: string;
  status: string;
  appliedAt: any;
  reviewedAt: any;
  remarks: string;
  createdAt?: any;
  updatedAt?: any;

  // Optional job information if backend/repository
  // is later expanded to include job details.
  job?: {
    companyName?: string;
    jobTitle?: string;
    location?: string;
    jobType?: string;
  };
}

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css'
})
export class JobApplicationsComponent implements OnInit {

  applications: JobApplication[] = [];

  filteredApplications: JobApplication[] = [];

  selectedApplication:
    JobApplication | null = null;

  selectedStatus = 'All';

  searchTerm = '';

  isLoading = false;

  isWithdrawing = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  async loadApplications(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/job-applications/me'
        );

      this.applications =
        response.data || [];

      this.filteredApplications =
        [...this.applications];

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Error loading applications:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load your job applications.';

    } finally {

      this.isLoading = false;

    }
  }

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    this.filteredApplications =
      this.applications.filter(
        application => {

          const matchesStatus =
            this.selectedStatus === 'All' ||
            application.status ===
              this.selectedStatus;

          const jobText =
            `${application.jobId}
             ${application.coverLetter}
             ${application.remarks}`
              .toLowerCase();

          const matchesSearch =
            !search ||
            jobText.includes(search);

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {

    this.selectedStatus = 'All';

    this.searchTerm = '';

    this.applyFilters();
  }

  async viewApplication(
    applicationId?: string
  ): Promise<void> {

    if (!applicationId) {
      return;
    }

    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          `/job-applications/${applicationId}`
        );

      this.selectedApplication =
        response.data;

    } catch (error: any) {

      console.error(
        'Error loading application:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load application details.';
    }
  }

  closeApplicationDetails(): void {

    this.selectedApplication =
      null;
  }

  canWithdraw(
    application: JobApplication
  ): boolean {

    return (
      application.status !== 'Selected' &&
      application.status !== 'Rejected' &&
      application.status !== 'Withdrawn'
    );
  }

  async withdrawApplication(
    application: JobApplication
  ): Promise<void> {

    if (!application.id) {
      return;
    }

    if (!this.canWithdraw(application)) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to withdraw this application?'
      );

    if (!confirmed) {
      return;
    }

    this.isWithdrawing = true;

    this.errorMessage = '';

    this.successMessage = '';

    try {

      const response =
        await this.apiService.put<any>(
          `/job-applications/${application.id}/withdraw`,
          {}
        );

      const updatedApplication =
        response.data;

      const index =
        this.applications.findIndex(
          item =>
            item.id === application.id
        );

      if (index !== -1) {

        this.applications[index] =
          updatedApplication;
      }

      this.applyFilters();

      if (
        this.selectedApplication?.id ===
        application.id
      ) {

        this.selectedApplication =
          updatedApplication;
      }

      this.successMessage =
        'Application withdrawn successfully.';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    } catch (error: any) {

      console.error(
        'Withdraw application error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to withdraw application.';

    } finally {

      this.isWithdrawing = false;

    }
  }

  getTotalApplications(): number {

    return this.applications.length;
  }

  getAppliedCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'Applied'
    ).length;
  }

  getShortlistedCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'Shortlisted'
    ).length;
  }

  getInterviewCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'Interview'
    ).length;
  }

  getSelectedCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'Selected'
    ).length;
  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Applied':
        return 'status-applied';

      case 'Shortlisted':
        return 'status-shortlisted';

      case 'Interview':
        return 'status-interview';

      case 'Selected':
        return 'status-selected';

      case 'Rejected':
        return 'status-rejected';

      case 'Withdrawn':
        return 'status-withdrawn';

      default:
        return 'status-default';
    }
  }

  formatDate(date: any): string {

    if (!date) {
      return 'Not available';
    }

    let value: any = date;

    // Firestore Timestamp
    if (
      typeof date === 'object' &&
      date.seconds
    ) {

      value =
        new Date(
          date.seconds * 1000
        );
    }

    const parsedDate =
      new Date(value);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return 'Not available';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  formatDateTime(date: any): string {

    if (!date) {
      return 'Not available';
    }

    let value: any = date;

    if (
      typeof date === 'object' &&
      date.seconds
    ) {

      value =
        new Date(
          date.seconds * 1000
        );
    }

    const parsedDate =
      new Date(value);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return 'Not available';
    }

    return parsedDate.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }
}