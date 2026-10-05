import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface FacultyStudent {

  id?: string;

  uid?: string;

  enrollmentNo?: string;

  firstName: string;

  lastName: string;

  departmentId?: string;

  semester?: number;

  division?: string;

  phone?: string;

  admissionYear?: number;

  graduationYear?: number;

  profileImage?: string;

  status?: string;
}


export interface FacultyStudentsResponse {

  department: {

    id?: string;

    name?: string;

    code?: string;

  } | null;

  totalStudents: number;

  students: FacultyStudent[];
}


@Injectable({
  providedIn: 'root'
})
export class FacultyStudentsService {

  constructor(
    private apiService: ApiService
  ) {}


  async getMyStudents():
    Promise<FacultyStudentsResponse> {

    const response =
      await this.apiService.get<{
        success: boolean;
        data: FacultyStudentsResponse;
      }>('/faculty/students');

    return response.data;
  }
}