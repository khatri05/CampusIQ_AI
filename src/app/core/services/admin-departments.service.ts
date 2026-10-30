import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

export interface AdminDepartment {
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  hod?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface DepartmentsResponse {
  success: boolean;
  count: number;
  data: AdminDepartment[];
}

interface DepartmentResponse {
  success: boolean;
  message: string;
  data: AdminDepartment;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDepartmentsService {

  constructor(
    private apiService: ApiService
  ) {}

  getAllDepartments():
    Promise<DepartmentsResponse> {

    return this.apiService.get<DepartmentsResponse>(
      '/admin/departments'
    );
  }

  updateDepartment(
    id: string,
    data: Partial<AdminDepartment>
  ): Promise<DepartmentResponse> {

    return this.apiService.put<DepartmentResponse>(
      `/admin/departments/${id}`,
      data
    );
  }

  deleteDepartment(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/departments/${id}`
    );
  }
}