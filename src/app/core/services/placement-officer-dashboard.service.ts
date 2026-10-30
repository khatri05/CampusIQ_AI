import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface PlacementOfficerStatistics {

  totalStudents: number;

  activeJobs: number;

  totalApplications: number;

  selectedStudents: number;

  shortlistedStudents: number;

  placementRate: number;
}


export interface ApplicationStatistics {

  total: number;

  pending: number;

  shortlisted: number;

  selected: number;

  rejected: number;
}


export interface PlacementJob {

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


export interface PlacementApplication {

  id?: string;

  studentId?: string;

  jobId?: string;

  studentName?: string;

  companyName?: string;

  jobTitle?: string;

  status?: string;

  applicationStatus?: string;

  createdAt?: any;

  updatedAt?: any;
}


export interface PlacementOfficerDashboard {

  statistics: PlacementOfficerStatistics;

  applicationStatistics: ApplicationStatistics;

  recentJobs: PlacementJob[];

  recentApplications: PlacementApplication[];
}


export interface PlacementOfficerDashboardApiResponse {

  success: boolean;

  data: PlacementOfficerDashboard;
}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerDashboardService {

  constructor(
    private apiService: ApiService
  ) {}


  async getDashboard():
    Promise<PlacementOfficerDashboard> {

    const response =
      await this.apiService.get<PlacementOfficerDashboardApiResponse>(
        '/placement-officer-dashboard/me'
      );

    return response.data;
  }
}