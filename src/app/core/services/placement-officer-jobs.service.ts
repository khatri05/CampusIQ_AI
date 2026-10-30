import {
  Injectable
} from '@angular/core';

import {
  ApiService
} from './api.service';


export interface PlacementJob {

  id?: string;

  title?: string;

  companyName?: string;

  company?: string;

  location?: string;

  jobType?: string;

  package?: string;

  salary?: string;

  description?: string;

  eligibility?: string;

  requirements?: string;

  deadline?: string;

  status?: string;

  createdBy?: string;

  createdAt?: any;

  updatedAt?: any;

}


export interface JobsApiResponse {

  success: boolean;

  data: PlacementJob[];

}


export interface JobApiResponse {

  success: boolean;

  data: PlacementJob;

}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerJobsService {

  constructor(
    private apiService: ApiService
  ) {}


  async getJobs():
    Promise<PlacementJob[]> {

    const response =
      await this.apiService.get<JobsApiResponse>(
        '/placement-officer/jobs'
      );

    return response.data || [];

  }


  async getJobById(
    id: string
  ): Promise<PlacementJob> {

    const response =
      await this.apiService.get<JobApiResponse>(
        `/placement-officer/jobs/${id}`
      );

    return response.data;

  }


  async createJob(
    job: PlacementJob
  ): Promise<PlacementJob> {

    const response =
      await this.apiService.post<JobApiResponse>(
        '/placement-officer/jobs',
        job
      );

    return response.data;

  }


  async updateJob(
    id: string,
    job: PlacementJob
  ): Promise<PlacementJob> {

    const response =
      await this.apiService.put<JobApiResponse>(
        `/placement-officer/jobs/${id}`,
        job
      );

    return response.data;

  }


  async updateJobStatus(
    id: string,
    status: string
  ): Promise<PlacementJob> {

    const response =
      await this.apiService.patch<JobApiResponse>(
        `/placement-officer/jobs/${id}/status`,
        { status }
      );

    return response.data;

  }


  async deleteJob(
    id: string
  ): Promise<void> {

    await this.apiService.delete(
      `/placement-officer/jobs/${id}`
    );

  }

}