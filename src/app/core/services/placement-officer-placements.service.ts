import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface Placement {

  id?: string;

  studentId?: string;

  jobId?: string;

  studentName?: string;

  studentEmail?: string;

  enrollmentNumber?: string;

  companyName?: string;

  company?: string;

  jobTitle?: string;

  status?: string;

  applicationStatus?: string;

  appliedAt?: any;

  createdAt?: any;

  updatedAt?: any;

}


export interface PlacementsApiResponse {

  success: boolean;

  data: Placement[];

}


export interface PlacementApiResponse {

  success: boolean;

  data: Placement;

}


export interface PlacementStatistics {

  totalPlacements: number;

  totalCompanies: number;

}


export interface PlacementStatisticsApiResponse {

  success: boolean;

  data: PlacementStatistics;

}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerPlacementsService {


  constructor(
    private apiService: ApiService
  ) {}


  async getPlacements():
    Promise<Placement[]> {

    const response =
      await this.apiService
        .get<PlacementsApiResponse>(
          '/placement-officer/placements'
        );

    return response.data;

  }


  async getPlacementById(
    id: string
  ): Promise<Placement> {

    const response =
      await this.apiService
        .get<PlacementApiResponse>(
          `/placement-officer/placements/${id}`
        );

    return response.data;

  }


  async getStatistics():
    Promise<PlacementStatistics> {

    const response =
      await this.apiService
        .get<PlacementStatisticsApiResponse>(
          '/placement-officer/placements/statistics'
        );

    return response.data;

  }

}