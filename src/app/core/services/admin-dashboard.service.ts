import { Injectable } from '@angular/core';

import {
  ApiService
} from './api.service';


export interface AdminStatistics {

  totalStudents: number;

  totalFaculty: number;

  totalDepartments: number;

  totalJobs: number;

  activeJobs: number;

  closedJobs: number;

  totalApplications: number;

  placedStudents: number;

  placementRate: number;

}


export interface AdminApplicationStatistics {

  total: number;

  applied: number;

  shortlisted: number;

  selected: number;

  rejected: number;

}


export interface AdminJob {

  id?: string;

  title?: string;

  companyName?: string;

  company?: string;

  location?: string;

  jobType?: string;

  package?: string;

  salary?: string;

  deadline?: string;

  status?: string;

  createdAt?: any;

  updatedAt?: any;

}


export interface AdminApplication {

  id?: string;

  studentId?: string;

  jobId?: string;

  studentName?: string;

  studentEmail?: string;

  companyName?: string;

  jobTitle?: string;

  status?: string;

  applicationStatus?: string;

  createdAt?: any;

  updatedAt?: any;

}


export interface AdminDashboard {

  statistics: AdminStatistics;

  applicationStatistics:
    AdminApplicationStatistics;

  recentJobs: AdminJob[];

  recentApplications:
    AdminApplication[];

}


export interface AdminDashboardApiResponse {

  success: boolean;

  data: AdminDashboard;

}


@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(
    private apiService: ApiService
  ) {}


  async getDashboard():
    Promise<AdminDashboard> {

    const response =
      await this.apiService
        .get<AdminDashboardApiResponse>(
          '/admin-dashboard/me'
        );


    return response.data;

  }

}