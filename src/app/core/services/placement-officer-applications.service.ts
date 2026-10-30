import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface PlacementApplication {

  id?: string;

  studentId?: string;

  jobId?: string;

  studentName?: string;

  studentEmail?: string;

  enrollmentNumber?: string;

  companyName?: string;

  jobTitle?: string;

  status?: string;

  applicationStatus?: string;

  appliedAt?: any;

  createdAt?: any;

  updatedAt?: any;
}


export interface ApplicationsApiResponse {

  success: boolean;

  data: PlacementApplication[];
}


export interface ApplicationApiResponse {

  success: boolean;

  data: PlacementApplication;
}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerApplicationsService {

  constructor(
    private apiService: ApiService
  ) {}


  async getApplications():
    Promise<PlacementApplication[]> {

    const response =
      await this.apiService.get<ApplicationsApiResponse>(
        '/placement-officer/applications'
      );

    return response.data;
  }


  async getApplicationById(
    applicationId: string
  ): Promise<PlacementApplication> {

    const response =
      await this.apiService.get<ApplicationApiResponse>(
        `/placement-officer/applications/${applicationId}`
      );

    return response.data;
  }


  async updateApplicationStatus(
    applicationId: string,
    status: string
  ): Promise<PlacementApplication> {

    const response =
      await this.apiService.patch<ApplicationApiResponse>(
        `/placement-officer/applications/${applicationId}/status`,
        {
          status
        }
      );

    return response.data;
  }

}