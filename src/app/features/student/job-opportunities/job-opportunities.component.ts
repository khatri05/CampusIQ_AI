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


interface JobOpportunity {
  id?: string;
  companyName: string;
  jobTitle: string;
  description: string;
  location: string;
  jobType: string;
  experienceRequired: string;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  eligibilityCriteria: string;
  applicationDeadline: string | null;
  jobUrl: string;
  status: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}


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


  // ========================================
  // JOB DATA
  // ========================================

  jobs: JobOpportunity[] = [];

  filteredJobs: JobOpportunity[] = [];

  selectedJob:
    JobOpportunity | null = null;


  // ========================================
  // FILTERS
  // ========================================

  searchTerm = '';

  selectedJobType = 'All';

  selectedLocation = 'All';


  // ========================================
  // LOADING / ERROR
  // ========================================

  isLoading = false;

  errorMessage = '';


  // ========================================
  // APPLICATION
  // ========================================

  showApplyModal = false;

  applicationJob:
    JobOpportunity | null = null;

  coverLetter = '';

  resumeUrl = '';

  isApplying = false;

  applicationSuccess = '';

  applicationError = '';


  // ========================================
  // CONSTRUCTOR
  // ========================================

  constructor(
    private apiService: ApiService
  ) {}


  // ========================================
  // INITIALIZATION
  // ========================================

  ngOnInit(): void {

    this.loadJobs();

  }


  // ========================================
  // LOAD JOBS
  // ========================================

  async loadJobs(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/job-opportunities'
        );

      this.jobs =
        response.data || [];

      this.filteredJobs =
        [...this.jobs];

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Error loading job opportunities:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load job opportunities.';

    } finally {

      this.isLoading = false;

    }

  }


  // ========================================
  // APPLY FILTERS
  // ========================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredJobs =
      this.jobs.filter(job => {

        const matchesSearch =
          !search ||

          job.companyName
            ?.toLowerCase()
            .includes(search) ||

          job.jobTitle
            ?.toLowerCase()
            .includes(search) ||

          job.description
            ?.toLowerCase()
            .includes(search) ||

          job.requiredSkills?.some(
            skill =>
              skill
                .toLowerCase()
                .includes(search)
          );


        const matchesJobType =
          this.selectedJobType === 'All' ||
          job.jobType ===
            this.selectedJobType;


        const matchesLocation =
          this.selectedLocation === 'All' ||
          job.location ===
            this.selectedLocation;


        return (
          matchesSearch &&
          matchesJobType &&
          matchesLocation
        );

      });

  }


  // ========================================
  // FILTER EVENTS
  // ========================================

  onSearchChange(): void {

    this.applyFilters();

  }


  onJobTypeChange(): void {

    this.applyFilters();

  }


  onLocationChange(): void {

    this.applyFilters();

  }


  // ========================================
  // VIEW JOB DETAILS
  // ========================================

  async viewJob(
    jobId?: string
  ): Promise<void> {

    if (!jobId) {

      return;

    }


    try {

      const response =
        await this.apiService.get<any>(
          `/job-opportunities/${jobId}`
        );


      this.selectedJob =
        response.data;

    } catch (error) {

      console.error(
        'Error loading job details:',
        error
      );

      this.errorMessage =
        'Unable to load job details.';

    }

  }


  // ========================================
  // CLOSE JOB DETAILS
  // ========================================

  closeJobDetails(): void {

    this.selectedJob = null;

  }


  // ========================================
  // CLEAR FILTERS
  // ========================================

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedJobType = 'All';

    this.selectedLocation = 'All';

    this.applyFilters();

  }


  // ========================================
  // FORMAT SALARY
  // ========================================

  formatSalary(
    min: number,
    max: number
  ): string {

    if (!min && !max) {

      return 'Salary not disclosed';

    }


    if (min && max) {

      return `₹${this.formatAmount(min)} - ₹${this.formatAmount(max)}`;

    }


    if (min) {

      return `From ₹${this.formatAmount(min)}`;

    }


    return `Up to ₹${this.formatAmount(max)}`;

  }


  private formatAmount(
    amount: number
  ): string {

    if (amount >= 10000000) {

      return `${(
        amount / 10000000
      ).toFixed(1)} Cr`;

    }


    if (amount >= 100000) {

      return `${(
        amount / 100000
      ).toFixed(1)} LPA`;

    }


    return amount.toLocaleString(
      'en-IN'
    );

  }


  // ========================================
  // CHECK DEADLINE
  // ========================================

  isDeadlinePassed(
    deadline: string | null
  ): boolean {

    if (!deadline) {

      return false;

    }


    return new Date(deadline) <
      new Date();

  }


  // ========================================
  // UNIQUE LOCATIONS
  // ========================================

  getUniqueLocations(): string[] {

    return [
      ...new Set(
        this.jobs
          .map(job => job.location)
          .filter(Boolean)
      )
    ];

  }


  // ========================================
  // OPEN JOB COUNT
  // ========================================

  getOpenJobsCount(): number {

    return this.jobs.filter(
      job =>
        job.status === 'Open'
    ).length;

  }


  // ========================================
  // COMPANY COUNT
  // ========================================

  getCompaniesCount(): number {

    return new Set(
      this.jobs.map(
        job => job.companyName
      )
    ).size;

  }


  // ========================================
  // OPEN APPLY MODAL
  // ========================================

  openApplyModal(): void {

    if (!this.selectedJob) {

      return;

    }


    if (!this.selectedJob.id) {

      this.applicationError =
        'Unable to apply for this job. Job ID is missing.';

      return;

    }


    if (
      this.selectedJob.status !== 'Open'
    ) {

      this.applicationError =
        'Applications are closed for this job.';

      return;

    }


    if (
      this.isDeadlinePassed(
        this.selectedJob.applicationDeadline
      )
    ) {

      this.applicationError =
        'The application deadline has passed.';

      return;

    }


    this.applicationJob =
      this.selectedJob;

    this.coverLetter = '';

    this.resumeUrl = '';

    this.applicationSuccess = '';

    this.applicationError = '';

    this.showApplyModal = true;

  }


  // ========================================
  // CLOSE APPLY MODAL
  // ========================================

  closeApplyModal(): void {

    if (this.isApplying) {

      return;

    }


    this.showApplyModal = false;

    this.applicationJob = null;

    this.coverLetter = '';

    this.resumeUrl = '';

    this.applicationSuccess = '';

    this.applicationError = '';

  }


  // ========================================
  // SUBMIT APPLICATION
  // ========================================

  async submitApplication(): Promise<void> {

    if (!this.applicationJob?.id) {

      this.applicationError =
        'Job information is missing.';

      return;

    }


    if (
      this.applicationJob.status !== 'Open'
    ) {

      this.applicationError =
        'Applications are closed for this job.';

      return;

    }


    if (
      this.isDeadlinePassed(
        this.applicationJob.applicationDeadline
      )
    ) {

      this.applicationError =
        'The application deadline has passed.';

      return;

    }


    this.applicationError = '';

    this.applicationSuccess = '';

    this.isApplying = true;


    try {

      const response =
        await this.apiService.post<any>(
          '/job-applications',
          {
            jobId:
              this.applicationJob.id,

            coverLetter:
              this.coverLetter.trim(),

            resumeUrl:
              this.resumeUrl.trim()
          }
        );


      this.applicationSuccess =
        response?.message ||
        'Application submitted successfully.';


      /*
       * Close the Apply modal
       * after successful submission.
       */

      this.showApplyModal = false;


      /*
       * Keep the selected job open
       * so the user can see the success
       * state before closing the details.
       */

    } catch (error: any) {

      console.error(
        'Application submission error:',
        error
      );


      this.applicationError =
        error?.error?.message ||
        'Unable to submit application. Please try again.';

    } finally {

      this.isApplying = false;

    }

  }

}