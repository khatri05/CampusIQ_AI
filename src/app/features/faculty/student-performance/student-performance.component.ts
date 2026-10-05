import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  FacultyStudentPerformanceService,
  StudentPerformance
} from '../../../core/services/faculty-student-performance.service';

@Component({
  selector: 'app-student-performance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './student-performance.component.html',
  styleUrl: './student-performance.component.css'
})
export class StudentPerformanceComponent implements OnInit {

  students: StudentPerformance[] = [];
  filteredStudents: StudentPerformance[] = [];

  searchText = '';

  selectedSemester = '';
  selectedDivision = '';
  selectedStatus = '';

  semesters: number[] = [];
  divisions: string[] = [];

  loading = false;
  errorMessage = '';

  totalStudents = 0;
  excellentStudents = 0;
  goodStudents = 0;
  averageStudents = 0;
  needsImprovementStudents = 0;

  selectedStudent: StudentPerformance | null = null;
  showDetails = false;

  constructor(
    private performanceService:
      FacultyStudentPerformanceService
  ) {}

  ngOnInit(): void {
    this.loadStudentPerformance();
  }


  /*
  ========================================
  LOAD STUDENT PERFORMANCE
  ========================================
  */

  async loadStudentPerformance(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.performanceService
          .getStudentPerformance();

      if (
        response &&
        response.success &&
        response.data
      ) {

        this.students =
          response.data.students || [];

        this.totalStudents =
          response.data.totalStudents ??
          this.students.length;

        this.buildFilters();

        this.calculateStatistics();

        this.filterStudents();

      } else {

        this.students = [];
        this.filteredStudents = [];

      }

    } catch (error: any) {

      console.error(
        'Student performance loading error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load student performance data.';

      this.students = [];
      this.filteredStudents = [];

    } finally {

      this.loading = false;

    }

  }


  /*
  ========================================
  BUILD FILTER OPTIONS
  ========================================
  */

  buildFilters(): void {

    this.semesters =
      Array.from(
        new Set(
          this.students
            .map(student => student.semester)
            .filter(
              (semester): semester is number =>
                semester !== null &&
                semester !== undefined
            )
        )
      ).sort(
        (a, b) => a - b
      );


    this.divisions =
      Array.from(
        new Set(
          this.students
            .map(student => student.division)
            .filter(
              (division): division is string =>
                !!division
            )
        )
      ).sort();

  }


  /*
  ========================================
  CALCULATE STATISTICS
  ========================================
  */

  calculateStatistics(): void {

    this.excellentStudents =
      this.students.filter(
        student =>
          student.performanceStatus ===
          'Excellent'
      ).length;


    this.goodStudents =
      this.students.filter(
        student =>
          student.performanceStatus ===
          'Good'
      ).length;


    this.averageStudents =
      this.students.filter(
        student =>
          student.performanceStatus ===
          'Average'
      ).length;


    this.needsImprovementStudents =
      this.students.filter(
        student =>
          student.performanceStatus ===
          'Needs Improvement'
      ).length;

  }


  /*
  ========================================
  FILTER STUDENTS
  ========================================
  */

  filterStudents(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredStudents =
      this.students.filter(
        student => {

          const fullName =
            `${student.firstName || ''} ${
              student.lastName || ''
            }`.trim().toLowerCase();


          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            (student.enrollmentNo || '')
              .toLowerCase()
              .includes(search) ||
            (student.email || '')
              .toLowerCase()
              .includes(search);


          const matchesSemester =
            !this.selectedSemester ||
            String(student.semester) ===
              this.selectedSemester;


          const matchesDivision =
            !this.selectedDivision ||
            student.division ===
              this.selectedDivision;


          const matchesStatus =
            !this.selectedStatus ||
            student.performanceStatus ===
              this.selectedStatus;


          return (
            matchesSearch &&
            matchesSemester &&
            matchesDivision &&
            matchesStatus
          );

        }
      );

  }


  /*
  ========================================
  SEARCH
  ========================================
  */

  onSearch(): void {
    this.filterStudents();
  }


  /*
  ========================================
  CLEAR FILTERS
  ========================================
  */

  clearFilters(): void {

    this.searchText = '';

    this.selectedSemester = '';

    this.selectedDivision = '';

    this.selectedStatus = '';

    this.filterStudents();

  }


  /*
  ========================================
  VIEW STUDENT DETAILS
  ========================================
  */

  async viewStudent(
    student: StudentPerformance
  ): Promise<void> {

    if (!student.id) {

      this.selectedStudent = student;

      this.showDetails = true;

      return;

    }


    try {

      const response =
        await this.performanceService
          .getStudentPerformanceById(
            student.id
          );

      if (
        response &&
        response.success &&
        response.data
      ) {

        this.selectedStudent =
          response.data;

      } else {

        this.selectedStudent =
          student;

      }

    } catch (error) {

      console.error(
        'Student performance details error:',
        error
      );

      this.selectedStudent =
        student;

    }


    this.showDetails = true;

  }


  /*
  ========================================
  CLOSE DETAILS
  ========================================
  */

  closeDetails(): void {

    this.showDetails = false;

    this.selectedStudent = null;

  }


  /*
  ========================================
  STUDENT NAME
  ========================================
  */

  getStudentName(
    student: StudentPerformance
  ): string {

    const name =
      `${student.firstName || ''} ${
        student.lastName || ''
      }`.trim();

    return name || 'Unknown Student';

  }


  /*
  ========================================
  INITIALS
  ========================================
  */

  getInitials(
    student: StudentPerformance
  ): string {

    const first =
      student.firstName?.charAt(0) || '';

    const last =
      student.lastName?.charAt(0) || '';

    return (
      first + last
    ).toUpperCase() || 'ST';

  }


  /*
  ========================================
  PERFORMANCE CLASS
  ========================================
  */

  getPerformanceClass(
    status?: string
  ): string {

    switch (status) {

      case 'Excellent':
        return 'excellent';

      case 'Good':
        return 'good';

      case 'Average':
        return 'average';

      default:
        return 'needs-improvement';

    }

  }


  /*
  ========================================
  SCORE CLASS
  ========================================
  */

  getScoreClass(
    score?: number
  ): string {

    const value =
      Number(score || 0);

    if (value >= 80) {
      return 'excellent';
    }

    if (value >= 65) {
      return 'good';
    }

    if (value >= 50) {
      return 'average';
    }

    return 'needs-improvement';

  }


  /*
  ========================================
  FORMAT PERCENTAGE
  ========================================
  */

  formatPercentage(
    value?: number
  ): string {

    return `${Number(value || 0).toFixed(1)}%`;

  }


  /*
  ========================================
  REFRESH
  ========================================
  */

  refresh(): void {
    this.loadStudentPerformance();
  }

}