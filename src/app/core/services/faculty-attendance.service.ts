import { Injectable } from '@angular/core';

import {
  ApiService
} from './api.service';


export interface AttendanceStudent {

  id?: string;

  uid?: string;

  enrollmentNo?: string;

  firstName: string;

  lastName: string;

  semester?: number;

  division?: string;

  phone?: string;

  profileImage?: string;

  status?: string;

}


export interface AttendanceRecord {

  id?: string;

  studentId: string;

  departmentId?: string;

  subjectId?: string;

  date: string;

  status:
    | 'Present'
    | 'Absent'
    | 'Late';

  recordedBy?: string;

}


export interface FacultyAttendanceResponse {

  department?: {

    id?: string;

    name?: string;

    code?: string;

  } | null;

  students: AttendanceStudent[];

  attendance: AttendanceRecord[];

}


@Injectable({
  providedIn: 'root'
})
export class FacultyAttendanceService {

  constructor(
    private apiService: ApiService
  ) {}


  async getAttendance(
    date: string
  ): Promise<{
    success: boolean;
    data: FacultyAttendanceResponse;
  }> {

    return await this.apiService.get(
      `/faculty-attendance?date=${date}`
    );

  }


  async saveAttendance(
    data: {
      studentId: string;

      subjectId?: string;

      date: string;

      status:
        | 'Present'
        | 'Absent'
        | 'Late';

    }
  ): Promise<any> {

    return await this.apiService.post(
      '/faculty-attendance',
      data
    );

  }

}