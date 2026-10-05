import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  SidebarComponent
} from '../components/sidebar/sidebar.component';

import {
  TopNavbarComponent
} from '../components/top-navbar/top-navbar.component';

import {
  ApiService
} from '../../../core/services/api.service';


interface DashboardStudent {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enrollmentNo?: string;
  departmentId?: string;
  semester?: number | null;
  division?: string;
  profileImage?: string;
}


interface DashboardMetrics {
  cgpa: number | null;

  attendancePercentage: number | null;

  totalAttendance: number;

  presentAttendance: number;

  totalSkills: number;

  totalCertifications: number;

  totalProjects: number;

  completedProjects: number;

  inProgressProjects: number;
}


interface DashboardResponse {
  student: DashboardStudent;

  metrics: DashboardMetrics;

  skills: any[];

  certifications: any[];

  projects: any[];

  marks: any[];

  attendance: any[];
}


@Component({
  selector: 'app-student-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    SidebarComponent,
    TopNavbarComponent
  ],

  templateUrl: './dashboard.component.html',

  styleUrl: './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit {


  /*
   * ==========================================
   * LOADING / ERROR
   * ==========================================
   */

  loading = true;

  errorMessage = '';


  /*
   * ==========================================
   * DASHBOARD DATA
   * ==========================================
   */

  student: DashboardStudent | null = null;

  metrics: DashboardMetrics = {
    cgpa: null,
    attendancePercentage: null,
    totalAttendance: 0,
    presentAttendance: 0,
    totalSkills: 0,
    totalCertifications: 0,
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0
  };


  skills: any[] = [];

  certifications: any[] = [];

  projects: any[] = [];

  marks: any[] = [];

  attendanceRecords: any[] = [];


  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}


  /*
   * ==========================================
   * INITIALIZE
   * ==========================================
   */

  async ngOnInit(): Promise<void> {

    await this.loadDashboard();

  }


  /*
   * ==========================================
   * LOAD DASHBOARD
   * ==========================================
   */

  async loadDashboard(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';


      const response =
        await this.apiService.get<{
          success: boolean;
          data: DashboardResponse;
        }>(
          '/student-dashboard/me'
        );


      console.log(
        'Student dashboard response:',
        response
      );


      if (!response?.success) {

        throw new Error(
          'Unable to load dashboard data.'
        );

      }


      const data =
        response.data;


      this.student =
        data?.student || null;


      this.metrics =
        data?.metrics || this.metrics;


      this.skills =
        data?.skills || [];


      this.certifications =
        data?.certifications || [];


      this.projects =
        data?.projects || [];


      this.marks =
        data?.marks || [];


      this.attendanceRecords =
        data?.attendance || [];


    } catch (error: any) {

      console.error(
        'Dashboard loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load dashboard. Please try again.';


    } finally {

      this.loading = false;

    }

  }


  /*
   * ==========================================
   * STUDENT NAME
   * ==========================================
   */

  get studentName(): string {

    const firstName =
      this.student?.firstName?.trim() || '';

    const lastName =
      this.student?.lastName?.trim() || '';


    const fullName =
      `${firstName} ${lastName}`.trim();


    return fullName || 'Student';

  }


  /*
   * ==========================================
   * INITIALS
   * ==========================================
   */

  get studentInitials(): string {

    const first =
      this.student?.firstName
        ?.charAt(0)
        ?.toUpperCase() || '';


    const last =
      this.student?.lastName
        ?.charAt(0)
        ?.toUpperCase() || '';


    return `${first}${last}` || 'ST';

  }


  /*
   * ==========================================
   * CGPA DISPLAY
   * ==========================================
   */

  get cgpaDisplay(): string {

    if (
      this.metrics.cgpa === null ||
      this.metrics.cgpa === undefined
    ) {

      return '—';

    }


    return this.metrics.cgpa.toFixed(2);

  }


  /*
   * ==========================================
   * ATTENDANCE DISPLAY
   * ==========================================
   */

  get attendanceDisplay(): string {

    if (
      this.metrics.attendancePercentage ===
        null ||
      this.metrics.attendancePercentage ===
        undefined
    ) {

      return '—';

    }


    return `${this.metrics.attendancePercentage}%`;

  }


  /*
   * ==========================================
   * ATTENDANCE STATUS
   * ==========================================
   */

  get attendanceStatus(): string {

    const percentage =
      this.metrics.attendancePercentage;


    if (
      percentage === null ||
      percentage === undefined
    ) {

      return 'No Data';

    }


    if (percentage >= 85) {

      return 'Excellent';

    }


    if (percentage >= 75) {

      return 'Good';

    }


    return 'Low';

  }


  /*
   * ==========================================
   * ATTENDANCE MESSAGE
   * ==========================================
   */

  get attendanceMessage(): string {

    const percentage =
      this.metrics.attendancePercentage;


    if (
      percentage === null ||
      percentage === undefined
    ) {

      return 'No attendance records available yet.';

    }


    if (percentage >= 75) {

      return 'You are maintaining good attendance.';

    }


    return 'Your attendance is below the required minimum.';

  }


  /*
   * ==========================================
   * REQUIRED ATTENDANCE
   * ==========================================
   */

  get attendanceRequirement(): string {

    return 'Required minimum: 75%';

  }


  /*
   * ==========================================
   * STATISTICS
   * ==========================================
   */

  get stats() {

    return [

      {
        title: 'Attendance',

        value:
          this.attendanceDisplay,

        icon: '📅',

        description:
          this.metrics.totalAttendance > 0
            ? 'Overall attendance'
            : 'No attendance records'
      },


      {
        title: 'CGPA',

        value:
          this.cgpaDisplay,

        icon: '🎓',

        description:
          this.metrics.cgpa !== null
            ? 'Current academic performance'
            : 'No academic records'
      },


      {
        title: 'Skills',

        value:
          this.metrics.totalSkills
            .toString(),

        icon: '💡',

        description:
          this.metrics.totalSkills === 0
            ? 'No skills added yet'
            : 'Skills acquired'
      },


      {
        title: 'Projects',

        value:
          this.metrics.totalProjects
            .toString(),

        icon: '🚀',

        description:
          this.metrics.totalProjects === 0
            ? 'No projects added yet'
            : `${this.metrics.completedProjects} completed`
      }

    ];

  }


  /*
   * ==========================================
   * RECENT MARKS
   * ==========================================
   */

  get recentMarks(): any[] {

    return [
      ...this.marks
    ]
      .sort(
        (
          a,
          b
        ) => {

          const dateA =
            new Date(
              a.updatedAt ||
              a.createdAt ||
              0
            ).getTime();


          const dateB =
            new Date(
              b.updatedAt ||
              b.createdAt ||
              0
            ).getTime();


          return dateB - dateA;

        }
      )
      .slice(
        0,
        3
      );

  }


  /*
   * ==========================================
   * UPCOMING PROJECTS
   * ==========================================
   */

  get recentProjects(): any[] {

    return [
      ...this.projects
    ]
      .sort(
        (
          a,
          b
        ) => {

          const dateA =
            new Date(
              a.updatedAt ||
              a.createdAt ||
              0
            ).getTime();


          const dateB =
            new Date(
              b.updatedAt ||
              b.createdAt ||
              0
            ).getTime();


          return dateB - dateA;

        }
      )
      .slice(
        0,
        3
      );

  }


  /*
   * ==========================================
   * TECHNICAL SKILL PROGRESS
   * ==========================================
   */

  get skillProgress(): number {

    if (
      this.metrics.totalSkills === 0
    ) {

      return 0;

    }


    /*
     * Simple dashboard representation.
     * Actual AI skill score will later come
     * from Skill Gap / Digital Twin API.
     */

    return Math.min(
      this.metrics.totalSkills * 8,
      100
    );

  }


  /*
   * ==========================================
   * PROJECT PROGRESS
   * ==========================================
   */

  get projectProgress(): number {

    if (
      this.metrics.totalProjects === 0
    ) {

      return 0;

    }


    return Math.round(
      (
        this.metrics.completedProjects /
        this.metrics.totalProjects
      ) * 100
    );

  }


  /*
   * ==========================================
   * PROFILE NAVIGATION
   * ==========================================
   */

  viewProfile(): void {

    this.router.navigate([
      '/student/profile'
    ]);

  }


  /*
   * ==========================================
   * DIGITAL TWIN NAVIGATION
   * ==========================================
   */

  openDigitalTwin(): void {

    this.router.navigate([
      '/student/digital-twin'
    ]);

  }


  /*
   * ==========================================
   * PERFORMANCE NAVIGATION
   * ==========================================
   */

  openPerformance(): void {

    this.router.navigate([
      '/student/performance'
    ]);

  }


  /*
   * ==========================================
   * ASSIGNMENT NAVIGATION
   * ==========================================
   */

  openAssignments(): void {

    this.router.navigate([
      '/student/assignments'
    ]);

  }


  /*
   * ==========================================
   * RETRY
   * ==========================================
   */

  async retry(): Promise<void> {

    await this.loadDashboard();

  }

}