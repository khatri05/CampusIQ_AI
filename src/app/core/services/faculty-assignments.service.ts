import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface FacultyAssignment {

  id?: string;

  title: string;

  description?: string;

  subjectId?: string;

  subjectName?: string;

  departmentId?: string;

  facultyId?: string;

  createdBy?: string;

  semester?: number;

  division?: string;

  startDate?: string;

  dueDate?: string;

  maxMarks?: number;

  status?: string;

  createdAt?: any;

  updatedAt?: any;

}


export interface FacultyAssignmentsResponse {

  department?: {

    id?: string;

    name?: string;

    code?: string;

  } | null;

  assignments:
    FacultyAssignment[];

}


export interface FacultySubject {

  id?: string;

  name?: string;

  subjectName?: string;

  code?: string;

  subjectCode?: string;

  semester?: number;

  departmentId?: string;

  status?: string;

}


@Injectable({
  providedIn: 'root'
})
export class FacultyAssignmentsService {


  constructor(
    private apiService: ApiService
  ) {}


  /*
  ========================================
  GET FACULTY ASSIGNMENTS
  ========================================
  */

  async getAssignments(): Promise<{
    success: boolean;
    data: FacultyAssignmentsResponse;
  }> {

    return await this.apiService.get(
      '/faculty-assignments'
    );

  }


  /*
  ========================================
  GET SUBJECTS
  ========================================
  */

  async getSubjects(): Promise<any> {

    return await this.apiService.get(
      '/subjects'
    );

  }


  /*
  ========================================
  CREATE ASSIGNMENT
  ========================================
  */

  async createAssignment(
    data: Partial<FacultyAssignment>
  ): Promise<any> {

    return await this.apiService.post(
      '/faculty-assignments',
      data
    );

  }


  /*
  ========================================
  UPDATE ASSIGNMENT
  ========================================
  */

  async updateAssignment(
    id: string,
    data: Partial<FacultyAssignment>
  ): Promise<any> {

    return await this.apiService.put(
      `/faculty-assignments/${id}`,
      data
    );

  }


  /*
  ========================================
  DELETE ASSIGNMENT
  ========================================
  */

  async deleteAssignment(
    id: string
  ): Promise<any> {

    return await this.apiService.delete(
      `/faculty-assignments/${id}`
    );

  }


  /*
  ========================================
  GET SUBMISSIONS
  ========================================
  */

  async getSubmissions(
    id: string
  ): Promise<any> {

    return await this.apiService.get(
      `/faculty-assignments/${id}/submissions`
    );

  }

}