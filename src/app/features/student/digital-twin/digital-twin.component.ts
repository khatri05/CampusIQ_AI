import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../../core/services/api.service';

interface Student {
  uid: string;
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  semester: number;
  division: string;
  admissionYear: number;
  graduationYear: number;
  profileImage?: string;
}

interface Skill {
  id?: string;
  skillName: string;
  category?: string;
  level?: string;
  yearsOfExperience?: number;
  description?: string;
}

interface Certification {
  id?: string;
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

interface Project {
  id?: string;
  projectName: string;
  description?: string;
  category?: string;
  technologies?: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
  githubUrl?: string;
  teamSize?: number;
  status?: string;
}

interface AttendanceRecord {
  id?: string;
  subjectId?: string;
  status?: string;
  date?: string;
  [key: string]: any;
}

interface MarkRecord {
  id?: string;
  subjectId?: string;
  marksObtained?: number;
  totalMarks?: number;
  grade?: string;
  [key: string]: any;
}

interface DigitalTwinData {
  student: Student;

  academicProfile: {
    marks: MarkRecord[];
    attendance: AttendanceRecord[];
  };

  skillProfile: {
    skills: Skill[];
    certifications: Certification[];
  };

  projectProfile: {
    projects: Project[];
  };

  summary: {
    totalSkills: number;
    totalCertifications: number;
    totalProjects: number;
    totalAttendanceRecords: number;
    totalMarksRecords: number;
  };
}

@Component({
  selector: 'app-digital-twin',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './digital-twin.component.html',
  styleUrl: './digital-twin.component.css'
})
export class DigitalTwinComponent implements OnInit {

  digitalTwin: DigitalTwinData | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDigitalTwin();
  }

  async loadDigitalTwin(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/digital-twin/me'
        );

      if (response?.success && response?.data) {

        this.digitalTwin =
          response.data;

      } else {

        this.errorMessage =
          'Unable to load Digital Twin data.';
      }

    } catch (error: any) {

      console.error(
        'Digital Twin loading error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to load Digital Twin data.';

    } finally {

      this.loading = false;
    }
  }

  get fullName(): string {

    if (!this.digitalTwin?.student) {
      return 'Student';
    }

    return `${this.digitalTwin.student.firstName}
      ${this.digitalTwin.student.lastName}`;
  }

  get initials(): string {

    if (!this.digitalTwin?.student) {
      return 'S';
    }

    const first =
      this.digitalTwin.student.firstName
        ?.charAt(0)
        .toUpperCase() || '';

    const last =
      this.digitalTwin.student.lastName
        ?.charAt(0)
        .toUpperCase() || '';

    return `${first}${last}`;
  }

  get student(): Student | null {
    return this.digitalTwin?.student || null;
  }

  get skills(): Skill[] {

    return this.digitalTwin
      ?.skillProfile
      ?.skills || [];
  }

  get certifications(): Certification[] {

    return this.digitalTwin
      ?.skillProfile
      ?.certifications || [];
  }

  get projects(): Project[] {

    return this.digitalTwin
      ?.projectProfile
      ?.projects || [];
  }

  get marks(): MarkRecord[] {

    return this.digitalTwin
      ?.academicProfile
      ?.marks || [];
  }

  get attendance(): AttendanceRecord[] {

    return this.digitalTwin
      ?.academicProfile
      ?.attendance || [];
  }

  get summary() {

    return this.digitalTwin?.summary || {
      totalSkills: 0,
      totalCertifications: 0,
      totalProjects: 0,
      totalAttendanceRecords: 0,
      totalMarksRecords: 0
    };
  }

  get skillPercentage(): number {

    if (!this.skills.length) {
      return 0;
    }

    const total = this.skills.reduce(
      (sum, skill) => {

        const level =
          skill.level?.toLowerCase();

        const value =
          level === 'expert' ? 100 :
          level === 'advanced' ? 80 :
          level === 'intermediate' ? 60 :
          40;

        return sum + value;
      },
      0
    );

    return Math.round(
      total / this.skills.length
    );
  }

  get projectCompletion(): number {

    if (!this.projects.length) {
      return 0;
    }

    const completed =
      this.projects.filter(
        project =>
          project.status?.toLowerCase() ===
          'completed'
      ).length;

    return Math.round(
      (completed / this.projects.length) * 100
    );
  }

  get completedProjects(): number {

    return this.projects.filter(
      project =>
        project.status?.toLowerCase() ===
        'completed'
    ).length;
  }

  get activeProjects(): number {

    return this.projects.filter(
      project =>
        project.status?.toLowerCase() ===
        'in progress'
    ).length;
  }

  get certificationCount(): number {

    return this.certifications.length;
  }

  get skillCount(): number {

    return this.skills.length;
  }

  get projectCount(): number {

    return this.projects.length;
  }

  get attendanceRecordCount(): number {

    return this.attendance.length;
  }

  get marksRecordCount(): number {

    return this.marks.length;
  }

  formatDate(date?: string): string {

    if (!date) {
      return '—';
    }

    const parsedDate =
      new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  getSkillClass(level?: string): string {

    switch (
      level?.toLowerCase()
    ) {

      case 'expert':
        return 'skill-expert';

      case 'advanced':
        return 'skill-advanced';

      case 'intermediate':
        return 'skill-intermediate';

      default:
        return 'skill-beginner';
    }
  }

  getProjectClass(status?: string): string {

    switch (
      status?.toLowerCase()
    ) {

      case 'completed':
        return 'project-completed';

      case 'in progress':
        return 'project-progress';

      default:
        return 'project-planned';
    }
  }

  trackById(
    index: number,
    item: any
  ): string | number {

    return item?.id || index;
  }
}