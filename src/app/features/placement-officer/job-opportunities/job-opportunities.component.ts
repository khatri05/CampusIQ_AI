import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  PlacementOfficerJobsService,
  PlacementJob
} from '../../../core/services/placement-officer-jobs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placement-officer-job-opportunities',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './job-opportunities.component.html',
  styleUrl: './job-opportunities.component.css'
})
export class JobOpportunitiesComponent
  implements OnInit {

  jobs: PlacementJob[] = [];

  filteredJobs: PlacementJob[] = [];

  loading = true;

  saving = false;

  errorMessage = '';

  successMessage = '';

  searchText = '';

  selectedStatus = 'All';

  showForm = false;

  editingJobId: string | null = null;

  selectedJob: PlacementJob | null = null;

  jobForm: PlacementJob = this.getEmptyJob();


  constructor(
    private jobsService:
      PlacementOfficerJobsService
  ) {}


  async ngOnInit(): Promise<void> {

    await this.loadJobs();

  }


  async loadJobs(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.jobs =
        await this.jobsService.getJobs();

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Job opportunities loading error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to load job opportunities.';

    } finally {

      this.loading = false;

    }

  }


  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    this.filteredJobs =
      this.jobs.filter(job => {

        const company =
          this.getCompanyName(job)
            .toLowerCase();

        const title =
          this.getJobTitle(job)
            .toLowerCase();

        const location =
          (job.location || '')
            .toLowerCase();

        const matchesSearch =
          !search ||
          company.includes(search) ||
          title.includes(search) ||
          location.includes(search);

        const matchesStatus =
          this.selectedStatus === 'All' ||
          this.getJobStatus(job).toLowerCase() ===
          this.selectedStatus.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );

      });

  }


  clearFilters(): void {

    this.searchText = '';

    this.selectedStatus = 'All';

    this.applyFilters();

  }


  openCreateForm(): void {

    this.editingJobId = null;

    this.jobForm =
      this.getEmptyJob();

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;

  }


  openEditForm(
    job: PlacementJob
  ): void {

    this.editingJobId =
      job.id || null;

    this.jobForm = {
      ...job
    };

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;

  }


  closeForm(): void {

    this.showForm = false;

    this.editingJobId = null;

    this.jobForm =
      this.getEmptyJob();

  }


  viewJob(
    job: PlacementJob
  ): void {

    this.selectedJob = job;

  }


  closeJobDetails(): void {

    this.selectedJob = null;

  }


  async saveJob(): Promise<void> {

    if (
      !this.jobForm.title?.trim()
    ) {

      this.errorMessage =
        'Job title is required.';

      return;

    }

    if (
      !this.jobForm.companyName?.trim() &&
      !this.jobForm.company?.trim()
    ) {

      this.errorMessage =
        'Company name is required.';

      return;

    }

    this.saving = true;

    this.errorMessage = '';

    this.successMessage = '';

    try {

      if (this.editingJobId) {

        await this.jobsService.updateJob(
          this.editingJobId,
          this.jobForm
        );

        this.successMessage =
          'Job opportunity updated successfully.';

      } else {

        await this.jobsService.createJob(
          this.jobForm
        );

        this.successMessage =
          'Job opportunity posted successfully.';

      }

      this.closeForm();

      await this.loadJobs();

    } catch (error: any) {

      console.error(
        'Save job error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to save job opportunity.';

    } finally {

      this.saving = false;

    }

  }


  async toggleStatus(
    job: PlacementJob
  ): Promise<void> {

    if (!job.id) {
      return;
    }

    const currentStatus =
      this.getJobStatus(job)
        .toLowerCase();

    const newStatus =
      currentStatus === 'active'
        ? 'closed'
        : 'active';

    try {

      await this.jobsService
        .updateJobStatus(
          job.id,
          newStatus
        );

      await this.loadJobs();

    } catch (error: any) {

      console.error(
        'Job status update error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to update job status.';

    }

  }


  async deleteJob(
    job: PlacementJob
  ): Promise<void> {

    if (!job.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${this.getJobTitle(job)}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await this.jobsService
        .deleteJob(job.id);

      await this.loadJobs();

    } catch (error: any) {

      console.error(
        'Delete job error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to delete job opportunity.';

    }

  }


  getEmptyJob(): PlacementJob {

    return {

      title: '',

      companyName: '',

      location: '',

      jobType: 'Full Time',

      package: '',

      salary: '',

      deadline: '',

      eligibility: '',

      requirements: '',

      description: '',

      status: 'active'

    };

  }


  getJobTitle(
    job: PlacementJob
  ): string {

    return (
      job.title ||
      'Untitled Position'
    );

  }


  getCompanyName(
    job: PlacementJob
  ): string {

    return (
      job.companyName ||
      job.company ||
      'Unknown Company'
    );

  }


  getJobStatus(
    job: PlacementJob
  ): string {

    return (
      job.status ||
      'active'
    );

  }


  getStatusClass(
    job: PlacementJob
  ): string {

    const status =
      this.getJobStatus(job)
        .toLowerCase();

    if (status === 'active') {
      return 'status-active';
    }

    if (status === 'closed') {
      return 'status-closed';
    }

    return 'status-neutral';

  }


  getJobType(
    job: PlacementJob
  ): string {

    return (
      job.jobType ||
      'Not specified'
    );

  }


  getDeadline(
    job: PlacementJob
  ): string {

    return (
      job.deadline ||
      'No deadline'
    );

  }

}