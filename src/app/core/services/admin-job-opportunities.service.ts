import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface AdminJobOpportunity {

  id?: string;

  companyName?: string;

  jobTitle?: string;

  description?: string;

  location?: string;

  jobType?: string;

  experienceRequired?: string;

  salaryMin?: number;

  salaryMax?: number;

  requiredSkills?: string[];

  eligibilityCriteria?: string;

  applicationDeadline?: any;

  jobUrl?: string;

  status?: string;

  createdBy?: string;

  createdAt?: any;

  updatedAt?: any;
}


interface JobOpportunitiesResponse {

  success: boolean;

  count: number;

  data: AdminJobOpportunity[];
}


interface JobOpportunityResponse {

  success: boolean;

  message: string;

  data: AdminJobOpportunity;
}


@Injectable({
  providedIn: 'root'
})
export class AdminJobOpportunitiesService {

  constructor(
    private apiService: ApiService
  ) {}


  /*
  GET ALL JOB OPPORTUNITIES
  */

  getAllJobOpportunities():
    Promise<JobOpportunitiesResponse> {

    return this.apiService.get<JobOpportunitiesResponse>(
      '/admin/job-opportunities'
    );
  }


  /*
  UPDATE JOB OPPORTUNITY
  */

  updateJobOpportunity(
    id: string,
    data: Partial<AdminJobOpportunity>
  ): Promise<JobOpportunityResponse> {

    return this.apiService.put<JobOpportunityResponse>(
      `/admin/job-opportunities/${id}`,
      data
    );
  }


  /*
  DELETE JOB OPPORTUNITY
  */

  deleteJobOpportunity(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/job-opportunities/${id}`
    );
  }
}