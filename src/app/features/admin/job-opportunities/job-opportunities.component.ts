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
  AdminJobOpportunitiesService,
  AdminJobOpportunity
} from '../../../core/services/admin-job-opportunities.service';


@Component({
  selector: 'app-job-opportunities',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './job-opportunities.component.html',

  styleUrl:
    './job-opportunities.component.css'
})
export class JobOpportunitiesComponent
  implements OnInit {


  jobs: AdminJobOpportunity[] = [];

  filteredJobs:
    AdminJobOpportunity[] = [];


  searchTerm = '';

  statusFilter = 'all';

  jobTypeFilter = 'all';


  loading = false;

  errorMessage = '';

  successMessage = '';


  selectedJob:
    AdminJobOpportunity | null = null;

  editingJob:
    AdminJobOpportunity | null = null;


  showViewModal = false;

  showEditModal = false;


  totalJobs = 0;

  openJobs = 0;

  closedJobs = 0;

  otherJobs = 0;


  constructor(
    private jobService:
      AdminJobOpportunitiesService
  ) { }


  ngOnInit(): void {

    this.loadJobs();

  }


  /*
  LOAD JOBS
  */

  async loadJobs(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.jobService
          .getAllJobOpportunities();

      this.jobs =
        response.data || [];

      this.applyFilters();

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Load jobs error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load job opportunities.';

    } finally {

      this.loading = false;

    }
  }


  /*
  STATISTICS
  */

  calculateStatistics(): void {

    this.totalJobs =
      this.jobs.length;


    this.openJobs =
      this.jobs.filter(
        job =>
          this.getStatus(job) === 'open'
      ).length;


    this.closedJobs =
      this.jobs.filter(
        job =>
          this.getStatus(job) === 'closed'
      ).length;


    this.otherJobs =
      this.totalJobs -
      this.openJobs -
      this.closedJobs;
  }


  /*
  STATUS
  */

  getStatus(
    job: AdminJobOpportunity
  ): string {

    return (
      job.status
        ?.trim()
        .toLowerCase() ||
      'open'
    );
  }


  /*
  JOB TYPE
  */

  getJobType(
    job: AdminJobOpportunity
  ): string {

    return (
      job.jobType ||
      'Not specified'
    );
  }


  /*
  SEARCH + FILTER
  */

  applyFilters(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredJobs =
      this.jobs.filter(job => {

        const matchesSearch =
          !term ||

          job.companyName
            ?.toLowerCase()
            .includes(term) ||

          job.jobTitle
            ?.toLowerCase()
            .includes(term) ||

          job.location
            ?.toLowerCase()
            .includes(term) ||

          job.experienceRequired
            ?.toLowerCase()
            .includes(term);


        const matchesStatus =
          this.statusFilter === 'all' ||
          this.getStatus(job) ===
          this.statusFilter;


        const jobType =
          job.jobType
            ?.trim()
            .toLowerCase() || '';


        const matchesJobType =
          this.jobTypeFilter === 'all' ||
          jobType ===
          this.jobTypeFilter;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesJobType
        );

      });

  }


  onSearch(): void {

    this.applyFilters();

  }


  onStatusChange(): void {

    this.applyFilters();

  }


  onJobTypeChange(): void {

    this.applyFilters();

  }


  clearFilters(): void {

    this.searchTerm = '';

    this.statusFilter = 'all';

    this.jobTypeFilter = 'all';

    this.applyFilters();

  }


  /*
  VIEW
  */

  viewJob(
    job: AdminJobOpportunity
  ): void {

    this.selectedJob = {
      ...job
    };

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedJob = null;

  }


  /*
  EDIT
  */

  editJob(
    job: AdminJobOpportunity
  ): void {

    this.editingJob = {
      ...job,

      requiredSkills:
        job.requiredSkills
          ? [...job.requiredSkills]
          : []
    };

    this.showEditModal = true;

    this.errorMessage = '';

  }


  closeEditModal(): void {

    this.showEditModal = false;

    this.editingJob = null;

  }


  /*
  SAVE
  */

  async saveJob(): Promise<void> {

    if (!this.editingJob) {
      return;
    }


    const id =
      this.editingJob.id;


    if (!id) {

      this.errorMessage =
        'Job opportunity ID is missing.';

      return;
    }


    if (
      !this.editingJob.companyName?.trim()
    ) {

      this.errorMessage =
        'Company name is required.';

      return;
    }


    if (
      !this.editingJob.jobTitle?.trim()
    ) {

      this.errorMessage =
        'Job title is required.';

      return;
    }


    if (
      !this.editingJob.description?.trim()
    ) {

      this.errorMessage =
        'Job description is required.';

      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      const updateData:
        Partial<AdminJobOpportunity> = {

        companyName:
          this.editingJob.companyName
            ?.trim(),

        jobTitle:
          this.editingJob.jobTitle
            ?.trim(),

        description:
          this.editingJob.description
            ?.trim(),

        location:
          this.editingJob.location
            ?.trim() || '',

        jobType:
          this.editingJob.jobType
            ?.trim() || 'Full Time',

        experienceRequired:
          this.editingJob
            .experienceRequired
            ?.trim() || 'Fresher',

        salaryMin:
          Number(
            this.editingJob.salaryMin || 0
          ),

        salaryMax:
          Number(
            this.editingJob.salaryMax || 0
          ),

        requiredSkills:
          this.editingJob.requiredSkills || [],

        eligibilityCriteria:
          this.editingJob
            .eligibilityCriteria
            ?.trim() || '',

        applicationDeadline:
          this.editingJob
            .applicationDeadline || null,

        jobUrl:
          this.editingJob.jobUrl
            ?.trim() || '',

        status:
          this.editingJob.status
            ?.trim() || 'Open'
      };


      const response =
        await this.jobService
          .updateJobOpportunity(
            id,
            updateData
          );


      const updatedJob =
        response.data;


      const index =
        this.jobs.findIndex(
          job =>
            job.id === id
        );


      if (index !== -1) {

        this.jobs[index] =
          updatedJob;

      }


      this.applyFilters();

      this.calculateStatistics();


      this.showEditModal = false;

      this.editingJob = null;


      this.successMessage =
        'Job opportunity updated successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Update job error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to update job opportunity.';

    } finally {

      this.loading = false;

    }
  }


  /*
  DELETE
  */

  async deleteJob(
    job: AdminJobOpportunity
  ): Promise<void> {

    const id =
      job.id;


    if (!id) {
      return;
    }


    const confirmed =
      confirm(
        `Are you sure you want to delete "${job.jobTitle}" at "${job.companyName}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      await this.jobService
        .deleteJobOpportunity(id);


      this.jobs =
        this.jobs.filter(
          item =>
            item.id !== id
        );


      this.applyFilters();

      this.calculateStatistics();


      this.successMessage =
        'Job opportunity deleted successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Delete job error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to delete job opportunity.';

    } finally {

      this.loading = false;

    }
  }

  onSkillsChange(value: string): void {

    if (!this.editingJob) {
      return;
    }

    this.editingJob.requiredSkills =
      value
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
  }

  /*
  FORMAT DATE
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

}