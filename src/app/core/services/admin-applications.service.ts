import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface AdminApplication {

  id?: string;

  jobId?: string;

  studentId?: string;

  coverLetter?: string;

  resumeUrl?: string;

  status?: string;

  appliedAt?: any;

  reviewedAt?: any;

  remarks?: string;

  createdAt?: any;

  updatedAt?: any;
}


interface ApplicationsResponse {

  success: boolean;

  count: number;

  data: AdminApplication[];
}


interface ApplicationResponse {

  success: boolean;

  message: string;

  data: AdminApplication;
}


@Injectable({
  providedIn: 'root'
})
export class AdminApplicationsService {

  constructor(
    private apiService: ApiService
  ) {}


  /*
  GET ALL APPLICATIONS
  */

  getAllApplications():
    Promise<ApplicationsResponse> {

    return this.apiService.get<ApplicationsResponse>(
      '/admin/applications'
    );
  }


  /*
  UPDATE APPLICATION STATUS
  */

  updateApplicationStatus(
    id: string,
    status: string,
    remarks: string
  ): Promise<ApplicationResponse> {

    return this.apiService.put<ApplicationResponse>(
      `/admin/applications/${id}`,
      {
        status,
        remarks
      }
    );
  }


  /*
  DELETE APPLICATION
  */

  deleteApplication(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/applications/${id}`
    );
  }
}