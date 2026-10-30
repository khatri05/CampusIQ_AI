import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface AdminPlacement {

  id?: string;

  studentId?: string;

  applicationId?: string;

  jobId?: string;

  companyName?: string;

  jobTitle?: string;

  package?: number;

  placementDate?: any;

  status?: string;

  remarks?: string;

  createdAt?: any;

  updatedAt?: any;
}


interface PlacementsResponse {

  success: boolean;

  count: number;

  data: AdminPlacement[];
}


interface PlacementResponse {

  success: boolean;

  message: string;

  data: AdminPlacement;
}


@Injectable({
  providedIn: 'root'
})
export class AdminPlacementsService {

  constructor(
    private apiService: ApiService
  ) {}


  getAllPlacements():
    Promise<PlacementsResponse> {

    return this.apiService.get<PlacementsResponse>(
      '/admin/placements'
    );
  }


  updatePlacement(
    id: string,
    data: Partial<AdminPlacement>
  ): Promise<PlacementResponse> {

    return this.apiService.put<PlacementResponse>(
      `/admin/placements/${id}`,
      data
    );
  }


  deletePlacement(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/placements/${id}`
    );
  }
}