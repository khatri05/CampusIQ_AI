import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


/*
========================================
STUDENT PERFORMANCE MODEL
========================================
*/

export interface StudentPerformance {

  id?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  enrollmentNo?: string;

  semester?: number | null;

  division?: string;

  departmentId?: string;

  attendancePercentage?: number;

  averageMarks?: number;

  totalAssignments?: number;

  submittedAssignments?: number;

  assignmentPercentage?: number;

  skillsCount?: number;

  certificationsCount?: number;

  projectsCount?: number;

  overallScore?: number;

  performanceStatus?: string;

}


/*
========================================
DEPARTMENT MODEL
========================================
*/

export interface PerformanceDepartment {

  id?: string;

  name?: string;

  code?: string;

}


/*
========================================
API RESPONSE
========================================
*/

export interface StudentPerformanceResponse {

  department?: PerformanceDepartment | null;

  totalStudents?: number;

  students: StudentPerformance[];

}


/*
========================================
SERVICE
========================================
*/

@Injectable({
  providedIn: 'root'
})
export class FacultyStudentPerformanceService {

  constructor(
    private apiService: ApiService
  ) {}


  /*
  ========================================
  GET ALL STUDENT PERFORMANCE
  ========================================
  */

  async getStudentPerformance(): Promise<{
    success: boolean;
    data: StudentPerformanceResponse;
  }> {

    return await this.apiService.get(
      '/faculty-student-performance'
    );

  }


  /*
  ========================================
  GET SINGLE STUDENT PERFORMANCE
  ========================================
  */

  async getStudentPerformanceById(
    id: string
  ): Promise<{
    success: boolean;
    data: StudentPerformance;
  }> {

    return await this.apiService.get(
      `/faculty-student-performance/${id}`
    );

  }

}