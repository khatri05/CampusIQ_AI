import {
  Injectable
} from '@angular/core';

import {
  ApiService
} from './api.service';


export interface AdminStudent {

  id?: string;

  uid?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  enrollmentNo?: string;

  departmentId?: string;

  departmentName?: string;

  semester?: number | null;

  division?: string;

  phone?: string;

  admissionYear?: number | null;

  graduationYear?: number | null;

  profileImage?: string;

  status?: string;

  createdAt?: any;

  updatedAt?: any;

}


interface StudentsResponse {

  success: boolean;

  count: number;

  data: AdminStudent[];

}


interface StudentResponse {

  success: boolean;

  message: string;

  data: AdminStudent;

}


@Injectable({
  providedIn: 'root'
})
export class AdminStudentsService {


  constructor(
    private apiService: ApiService
  ) {}


  getAllStudents():
    Promise<StudentsResponse> {

    return this.apiService.get<StudentsResponse>(
      '/admin/students'
    );

  }


  updateStudent(
    id: string,
    data: Partial<AdminStudent>
  ): Promise<StudentResponse> {

    return this.apiService.put<StudentResponse>(
      `/admin/students/${id}`,
      data
    );

  }


  deleteStudent(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/students/${id}`
    );

  }

}