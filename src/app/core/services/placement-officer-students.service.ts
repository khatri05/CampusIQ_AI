import { Injectable } from '@angular/core';

import {
  ApiService
} from './api.service';


export interface PlacementStudent {

  id?: string;

  uid?: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  phone?: string;

  enrollmentNumber?: string;

  department?: string;

  departmentId?: string;

  semester?: string;

  cgpa?: number | null;

  placementStatus?: string;

  status?: string;

}


export interface PlacementStudentsApiResponse {

  success: boolean;

  data: PlacementStudent[];

}


export interface PlacementStudentApiResponse {

  success: boolean;

  data: PlacementStudent;

}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerStudentsService {

  constructor(
    private apiService: ApiService
  ) {}


  async getStudents():
    Promise<PlacementStudent[]> {

    const response =
      await this.apiService.get<PlacementStudentsApiResponse>(
        '/placement-officer-students'
      );

    return response.data || [];

  }


  async getStudentById(
    id: string
  ): Promise<PlacementStudent> {

    const response =
      await this.apiService.get<PlacementStudentApiResponse>(
        `/placement-officer-students/${id}`
      );

    return response.data;

  }

}