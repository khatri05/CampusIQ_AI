import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

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
  templateUrl: './job-opportunities.component.html',
  styleUrl: './job-opportunities.component.css'
})
export class JobOpportunitiesComponent implements OnInit {

  jobs: JobOpportunity[] = [];

  filteredJobs: JobOpportunity[] = [];

  selectedJob: JobOpportunity | null = null;

  searchTerm = '';

  selectedJobType = 'All';

  selectedLocation = 'All';

  isLoading = false;

  errorMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  async loadJobs(): Promise<void> {

    this.isLoading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/job-opportunities'
        );

      this.jobs = response.data || [];

      this.filteredJobs = [...this.jobs];

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
          job.jobType === this.selectedJobType;

        const matchesLocation =
          this.selectedLocation === 'All' ||
          job.location === this.selectedLocation;

        return (
          matchesSearch &&
          matchesJobType &&
          matchesLocation
        );
      });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onJobTypeChange(): void {
    this.applyFilters();
  }

  onLocationChange(): void {
    this.applyFilters();
  }

  async viewJob(jobId?: string): Promise<void> {

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

  closeJobDetails(): void {
    this.selectedJob = null;
  }

  clearFilters(): void {

    this.searchTerm = '';
    this.selectedJobType = 'All';
    this.selectedLocation = 'All';

    this.applyFilters();
  }

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

  private formatAmount(amount: number): string {

    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)} Cr`;
    }

    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)} LPA`;
    }

    return amount.toLocaleString('en-IN');
  }

  isDeadlinePassed(
    deadline: string | null
  ): boolean {

    if (!deadline) {
      return false;
    }

    return new Date(deadline) < new Date();
  }

  getUniqueLocations(): string[] {

    return [
      ...new Set(
        this.jobs
          .map(job => job.location)
          .filter(Boolean)
      )
    ];
  }

  getOpenJobsCount(): number {

    return this.jobs.filter(
      job => job.status === 'Open'
    ).length;
  }

  getCompaniesCount(): number {

    return new Set(
      this.jobs.map(job => job.companyName)
    ).size;
  }
}