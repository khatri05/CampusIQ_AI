import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


/*
========================================
SERVICE RESPONSE
========================================
*/

export interface FacultyDashboardApiResponse {

  success: boolean;

  data: FacultyDashboardResponse;

}


/*
========================================
SERVICE
========================================
*/

@Injectable({
  providedIn: 'root'
})
export class FacultyDashboardService {

  constructor(
    private apiService: ApiService
  ) {}


  /*
  ========================================
  GET FACULTY DASHBOARD
  ========================================
  */

  async getDashboard(): Promise<FacultyDashboardResponse> {

    const response =
      await this.apiService.get<FacultyDashboardApiResponse>(
        '/faculty-dashboard/me'
      );

    return response.data;

  }

}


/*
========================================
FACULTY DASHBOARD RESPONSE
========================================
*/

export interface FacultyDashboardResponse {

  faculty: FacultyInfo;

  statistics: FacultyStatistics;

  notificationCount: number;

  attendance: FacultyAttendance;

  deadlines: FacultyDeadline[];

  performance: FacultyPerformance;

  subjects: FacultySubject[];

  recentNotifications: FacultyNotification[];

  totals?: FacultyTotals;

}


/*
========================================
FACULTY INFORMATION
========================================
*/

export interface FacultyInfo {

  id?: string;

  uid?: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  employeeId?: string;

  employeeCode?: string;

  designation?: string;

  departmentId?: string;

  departmentName?: string;

  phone?: string;

  profileImage?: string;

}


/*
========================================
STATISTICS
========================================
*/

export interface FacultyStatistics {

  totalStudents: number;

  attendancePercentage: number;

  activeAssignments: number;

  ongoingProjects: number;

  totalSubjects?: number;

  totalAssignments?: number;

  totalProjects?: number;

  totalMarks?: number;

}


/*
========================================
ATTENDANCE
========================================
*/

export interface FacultyAttendance {

  percentage?: number;

  totalRecords?: number;

  selectedPeriod?: string;

  periods?: string[];

  data?: AttendanceDay[];

  weekly?: AttendanceDay[];

}


/*
========================================
ATTENDANCE DAY
========================================
*/

export interface AttendanceDay {

  day: string;

  percentage?: number;

  present?: number;

  absent?: number;

  late?: number;

}


/*
========================================
DEADLINE
========================================
*/

export interface FacultyDeadline {

  id?: string;

  title?: string;

  dueDate?: any;

  status?: string;

  subject?: string;

  subjectName?: string;

}


/*
========================================
PERFORMANCE
========================================
*/

export interface FacultyPerformance {

  overallPercentage: number;

  excellent: number;

  good: number;

  average: number;

  needsImprovement: number;

  categories?: PerformanceCategory[];

}


/*
========================================
PERFORMANCE CATEGORY
========================================
*/

export interface PerformanceCategory {

  label: string;

  students: number;

  type: string;

}


/*
========================================
SUBJECT
========================================
*/

export interface FacultySubject {

  id?: string;

  subjectId?: string;

  subjectName?: string;

  semester?: number | null;

  division?: string;

  departmentId?: string;

  academicYear?: string;

}


/*
========================================
NOTIFICATION
========================================
*/

export interface FacultyNotification {

  id?: string;

  title?: string;

  message?: string;

  isRead?: boolean;

  read?: boolean;

  createdAt?: any;

}


/*
========================================
TOTALS
========================================
*/

export interface FacultyTotals {

  students?: number;

  subjects?: number;

  assignments?: number;

  attendanceRecords?: number;

  marks?: number;

  projects?: number;

}