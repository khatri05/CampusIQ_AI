import {
  Injectable
} from '@angular/core';

import {
  ApiService
} from './api.service';


export interface AdminFaculty {

  id?: string;

  uid?: string;

  employeeId?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  departmentId?: string;

  departmentName?: string;

  designation?: string;

  qualification?: string;

  specialization?: string;

  phone?: string;

  joiningDate?: string;

  status?: string;

  createdAt?: any;

  updatedAt?: any;

}


interface FacultyResponse {

  success: boolean;

  count: number;

  data: AdminFaculty[];

}


interface SingleFacultyResponse {

  success: boolean;

  message: string;

  data: AdminFaculty;

}


@Injectable({
  providedIn: 'root'
})
export class AdminFacultyService {


  constructor(
    private apiService: ApiService
  ) {}


  getAllFaculty():
    Promise<FacultyResponse> {

    return this.apiService.get<FacultyResponse>(
      '/admin/faculty'
    );

  }


  updateFaculty(
    id: string,
    data: Partial<AdminFaculty>
  ): Promise<SingleFacultyResponse> {

    return this.apiService.put<SingleFacultyResponse>(
      `/admin/faculty/${id}`,
      data
    );

  }


  deleteFaculty(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/faculty/${id}`
    );

  }

}