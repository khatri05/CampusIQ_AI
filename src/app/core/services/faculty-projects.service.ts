import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface FacultyProject {

  id?: string;

  title?: string;

  name?: string;

  description?: string;

  studentId?: string;

  studentName?: string;

  enrollmentNo?: string;

  departmentId?: string;

  facultyId?: string;

  createdBy?: string;

  semester?: number;

  division?: string;

  technologies?: string[];

  technology?: string;

  githubUrl?: string;

  liveUrl?: string;

  status?: string;

  startDate?: string;

  endDate?: string;

  createdAt?: any;

  updatedAt?: any;

}


export interface FacultyProjectsResponse {

  department?: {

    id?: string;

    name?: string;

    code?: string;

  } | null;

  totalProjects?: number;

  projects: FacultyProject[];

}


@Injectable({
  providedIn: 'root'
})
export class FacultyProjectsService {


  constructor(
    private apiService: ApiService
  ) {}


  /*
  ========================================
  GET FACULTY PROJECTS
  ========================================
  */

  async getProjects(): Promise<{
    success: boolean;
    data: FacultyProjectsResponse;
  }> {

    return await this.apiService.get(
      '/faculty-projects'
    );

  }


  /*
  ========================================
  CREATE PROJECT
  ========================================
  */

  async createProject(
    data: Partial<FacultyProject>
  ): Promise<any> {

    return await this.apiService.post(
      '/faculty-projects',
      data
    );

  }


  /*
  ========================================
  UPDATE PROJECT
  ========================================
  */

  async updateProject(
    id: string,
    data: Partial<FacultyProject>
  ): Promise<any> {

    return await this.apiService.put(
      `/faculty-projects/${id}`,
      data
    );

  }


  /*
  ========================================
  DELETE PROJECT
  ========================================
  */

  async deleteProject(
    id: string
  ): Promise<any> {

    return await this.apiService.delete(
      `/faculty-projects/${id}`
    );

  }


  /*
  ========================================
  GET PROJECT BY ID
  ========================================
  */

  async getProjectById(
    id: string
  ): Promise<any> {

    return await this.apiService.get(
      `/faculty-projects/${id}`
    );

  }


}