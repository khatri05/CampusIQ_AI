import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  PlacementOfficerDashboardService,
  PlacementOfficerDashboard,
  PlacementJob,
  PlacementApplication
} from '../../../core/services/placement-officer-dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


interface DashboardStat {

  label: string;

  value: number | string;

  icon: string;

  description: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [FormsModule,CommonModule],

  templateUrl: './dashboard.component.html',

  styleUrl: './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit {


  isLoading = true;

  errorMessage = '';


  dashboard:
    PlacementOfficerDashboard | null = null;


  statistics:
    DashboardStat[] = [];


  recentJobs:
    PlacementJob[] = [];


  recentApplications:
    PlacementApplication[] = [];


  constructor(

    private dashboardService:
      PlacementOfficerDashboardService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  async loadDashboard(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';


    try {

      this.dashboard =
        await this.dashboardService
          .getDashboard();


      this.setDashboardData();


    } catch (error: any) {

      console.error(
        'Placement Officer dashboard error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load dashboard.';


    } finally {

      this.isLoading = false;

    }
  }


  private setDashboardData(): void {

    if (!this.dashboard) {
      return;
    }


    const stats =
      this.dashboard.statistics;


    this.statistics = [

      {
        label: 'Total Students',

        value:
          stats.totalStudents,

        icon:
          'bi bi-people-fill',

        description:
          'Registered students'
      },


      {
        label: 'Active Jobs',

        value:
          stats.activeJobs,

        icon:
          'bi bi-briefcase-fill',

        description:
          'Current opportunities'
      },


      {
        label: 'Applications',

        value:
          stats.totalApplications,

        icon:
          'bi bi-file-earmark-text-fill',

        description:
          'Total applications'
      },


      {
        label: 'Placements',

        value:
          stats.selectedStudents,

        icon:
          'bi bi-award-fill',

        description:
          `${stats.placementRate}% placement rate`
      }

    ];


    this.recentJobs =
      this.dashboard.recentJobs || [];


    this.recentApplications =
      this.dashboard.recentApplications || [];

  }


  openJobs(): void {

    this.router.navigate([
      '/placement-officer/job-opportunities'
    ]);

  }


  openApplications(): void {

    this.router.navigate([
      '/placement-officer/applications'
    ]);

  }


  openStudents(): void {

    this.router.navigate([
      '/placement-officer/students'
    ]);

  }


  openPlacements(): void {

    this.router.navigate([
      '/placement-officer/placements'
    ]);

  }


  getJobTitle(job: PlacementJob): string {

    return (
      job.title ||
      'Untitled Job'
    );

  }


  getCompanyName(job: PlacementJob): string {

    return (
      job.companyName ||
      job.company ||
      'Company'
    );

  }


  getApplicationStudentName(
    application: PlacementApplication
  ): string {

    return (
      application.studentName ||
      'Student'
    );

  }


  getApplicationJobTitle(
    application: PlacementApplication
  ): string {

    return (
      application.jobTitle ||
      'Job Application'
    );

  }


  getApplicationStatus(
    application: PlacementApplication
  ): string {

    return (
      application.status ||
      application.applicationStatus ||
      'Pending'
    );

  }


  getStatusClass(
    status: string
  ): string {

    switch (
      status.toLowerCase()
    ) {

      case 'selected':
        return 'status-selected';

      case 'shortlisted':
        return 'status-shortlisted';

      case 'rejected':
        return 'status-rejected';

      case 'applied':
      case 'pending':
        return 'status-pending';

      default:
        return 'status-default';
    }
  }


  getRelativeTime(
    value: any
  ): string {

    if (!value) {
      return '';
    }


    let date: Date;


    if (
      typeof value === 'object' &&
      typeof value.toDate === 'function'
    ) {

      date =
        value.toDate();

    } else {

      date =
        new Date(value);

    }


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '';

    }


    const now =
      new Date();


    const difference =
      now.getTime() -
      date.getTime();


    const minutes =
      Math.floor(
        difference / 60000
      );


    if (minutes < 1) {
      return 'Just now';
    }


    if (minutes < 60) {

      return `${minutes} min ago`;

    }


    const hours =
      Math.floor(
        minutes / 60
      );


    if (hours < 24) {

      return `${hours} hr ago`;

    }


    const days =
      Math.floor(
        hours / 24
      );


    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}