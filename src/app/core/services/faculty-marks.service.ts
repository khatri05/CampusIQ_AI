import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


/*
========================================
STUDENT
========================================
*/

export interface MarksStudent {
  id?: string;
  uid?: string;
  enrollmentNo?: string;

  firstName: string;
  lastName: string;

  semester?: number;
  division?: string;

  phone?: string;
  profileImage?: string;
}


/*
========================================
SUBJECT
========================================
*/

export interface MarksSubject {
  id: string;

  name?: string;
  subjectName?: string;

  code?: string;
  subjectCode?: string;

  departmentId?: string;

  semester?: number;

  credits?: number;

  status?: string;
}


/*
========================================
MARK RECORD
========================================
*/

export interface MarkRecord {
  id?: string;

  studentId: string;

  subjectId: string;

  examType: string;

  marksObtained: number;

  maxMarks: number;

  percentage?: number;

  grade?: string;

  recordedBy?: string;
}


/*
========================================
API RESPONSE
========================================
*/

export interface FacultyMarksResponse {

  department?: {
    id?: string;
    name?: string;
    code?: string;
  } | null;

  subject?: MarksSubject | null;

  students: MarksStudent[];

  marks: MarkRecord[];
}


@Injectable({
  providedIn: 'root'
})
export class FacultyMarksService {


  constructor(
    private apiService: ApiService
  ) {}


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
  GET FACULTY MARKS
  ========================================
  */

  async getMarks(
    subjectId?: string,
    examType?: string
  ): Promise<{
    success: boolean;
    data: FacultyMarksResponse;
  }> {

    let endpoint =
      '/faculty-marks';


    const params: string[] = [];


    if (subjectId) {

      params.push(
        `subjectId=${encodeURIComponent(
          subjectId
        )}`
      );

    }


    if (examType) {

      params.push(
        `examType=${encodeURIComponent(
          examType
        )}`
      );

    }


    if (params.length > 0) {

      endpoint +=
        '?' +
        params.join('&');

    }


    return await this.apiService.get(
      endpoint
    );

  }


  /*
  ========================================
  SAVE MARKS
  ========================================
  */

  async saveMarks(
    data: {
      studentId: string;

      subjectId: string;

      examType: string;

      marksObtained: number;

      maxMarks: number;
    }
  ): Promise<any> {

    return await this.apiService.post(
      '/faculty-marks',
      data
    );

  }

}