import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  AdminDashboard,
  AdminDashboardService
} from '../../../core/services/admin-dashboard.service';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './dashboard.component.html',

  styleUrl:
    './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit {


  dashboard:
    AdminDashboard | null = null;


  loading = true;

  errorMessage = '';


  constructor(
    private dashboardService:
      AdminDashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  async loadDashboard(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';


    try {

      this.dashboard =
        await this.dashboardService
          .getDashboard();


    } catch (error: any) {

      console.error(
        'Admin dashboard error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load dashboard';


    } finally {

      this.loading = false;

    }

  }


  getJobTitle(
    job: any
  ): string {

    return (
      job.title ||
      'Job Opportunity'
    );

  }


  getCompanyName(
    job: any
  ): string {

    return (
      job.companyName ||
      job.company ||
      '-'
    );

  }


  getApplicationStudent(
    application: any
  ): string {

    return (
      application.studentName ||
      'Student'
    );

  }


  getApplicationCompany(
    application: any
  ): string {

    return (
      application.companyName ||
      'Company'
    );

  }


  getApplicationJob(
    application: any
  ): string {

    return (
      application.jobTitle ||
      'Job Opportunity'
    );

  }


  getStatus(
    application: any
  ): string {

    return String(
      application.status ||
      application.applicationStatus ||
      'applied'
    )
      .trim()
      .toLowerCase();

  }


  getStatusClass(
    application: any
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


  getStatusLabel(
    application: any
  ): string {

    switch (
      this.getStatus(application)
    ) {

      case 'selected':
        return 'Selected';

      case 'shortlisted':
        return 'Shortlisted';

      case 'rejected':
        return 'Rejected';

      default:
        return 'Applied';

    }

  }


  getDate(
    value: any
  ): string {

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

}