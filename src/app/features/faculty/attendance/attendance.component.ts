import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  FacultyAttendanceService,
  AttendanceStudent,
  AttendanceRecord
} from '../../../core/services/faculty-attendance.service';


@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})

export class AttendanceComponent implements OnInit {

  // ========================================
  // STUDENTS
  // ========================================

  students: AttendanceStudent[] = [];

  filteredStudents: AttendanceStudent[] = [];


  // ========================================
  // ATTENDANCE
  // ========================================

  attendance: AttendanceRecord[] = [];

  attendanceMap: {
    [studentId: string]:
      | 'Present'
      | 'Absent'
      | 'Late'
      | undefined;
  } = {};


  // ========================================
  // DEPARTMENT
  // ========================================

  departmentName = '';

  departmentCode = '';


  // ========================================
  // FILTERS
  // ========================================

  selectedDate = '';

  selectedSemester = 'All';

  selectedDivision = 'All';

  searchText = '';

  semesters: string[] = [];

  divisions: string[] = [];


  // ========================================
  // UI STATE
  // ========================================

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  // ========================================
  // CONSTRUCTOR
  // ========================================

  constructor(
    private facultyAttendanceService: FacultyAttendanceService
  ) {}


  // ========================================
  // INIT
  // ========================================

  ngOnInit(): void {

    this.selectedDate = this.getTodayDate();

    this.loadAttendance();

  }


  // ========================================
  // GET TODAY DATE
  // ========================================

  private getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // ========================================
  // GET STUDENT ID
  // ========================================

  getStudentId(student: AttendanceStudent): string {

    // Prefer Firebase Authentication UID.
    // Use document ID only if UID is unavailable.

    return String(
      student.uid ||
      student.id ||
      ''
    ).trim();

  }


  // ========================================
  // LOAD ATTENDANCE
  // ========================================

  async loadAttendance(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.facultyAttendanceService.getAttendance(
          this.selectedDate
        );

      console.log(
        'Faculty Attendance Response:',
        response
      );

      if (!response || !response.success) {

        throw new Error(
          'Unable to load attendance data.'
        );

      }

      const data = response.data || {};

      // Department

      this.departmentName =
        data.department?.name || '';

      this.departmentCode =
        data.department?.code || '';

      // Students

      this.students = Array.isArray(data.students)
        ? data.students
        : [];

      // Attendance

      this.attendance = Array.isArray(data.attendance)
        ? data.attendance
        : [];

      console.log(
        'Students:',
        this.students
      );

      console.log(
        'Attendance Records:',
        this.attendance
      );

      // Build attendance map

      this.buildAttendanceMap();

      // Build filters

      this.buildFilters();

      // Apply filters

      this.filterStudents();

    } catch (error: any) {

      console.error(
        'Load attendance error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load attendance data.';

    } finally {

      this.isLoading = false;

    }

  }


  // ========================================
  // BUILD ATTENDANCE MAP
  // ========================================

  buildAttendanceMap(): void {

    this.attendanceMap = {};

    for (const record of this.attendance) {

      const studentId = String(
        record.studentId || ''
      ).trim();

      if (!studentId) {
        continue;
      }

      const status = String(
        record.status || ''
      ).trim().toLowerCase();

      if (status === 'present') {

        this.attendanceMap[studentId] = 'Present';

      } else if (status === 'absent') {

        this.attendanceMap[studentId] = 'Absent';

      } else if (status === 'late') {

        this.attendanceMap[studentId] = 'Late';

      }

    }

  }


  // ========================================
  // BUILD FILTERS
  // ========================================

  buildFilters(): void {

    // Semesters

    this.semesters = Array.from(
      new Set(
        this.students
          .map(student => student.semester)
          .filter(
            semester =>
              semester !== undefined &&
              semester !== null &&
              String(semester).trim() !== ''
          )
          .map(semester => String(semester))
      )
    ).sort(
      (a, b) => Number(a) - Number(b)
    );


    // Divisions

    this.divisions = Array.from(
      new Set(
        this.students
          .map(student => student.division)
          .filter(
            (division): division is string =>
              typeof division === 'string' &&
              division.trim().length > 0
          )
          .map(division => division.trim())
      )
    ).sort();

  }


  // ========================================
  // FILTER STUDENTS
  // ========================================

  filterStudents(): void {

    const search = this.searchText
      .trim()
      .toLowerCase();

    this.filteredStudents = this.students.filter(
      student => {

        // Semester filter

        const semesterMatch =
          this.selectedSemester === 'All' ||
          String(student.semester) === this.selectedSemester;


        // Division filter

        const divisionMatch =
          this.selectedDivision === 'All' ||
          (student.division || '').toLowerCase() ===
          this.selectedDivision.toLowerCase();


        // Search filter

        const fullName =
          `${student.firstName || ''} ${student.lastName || ''}`
            .toLowerCase();

        const enrollment =
          (student.enrollmentNo || '').toLowerCase();

        const phone =
          (student.phone || '').toLowerCase();

        const searchMatch =
          !search ||
          fullName.includes(search) ||
          enrollment.includes(search) ||
          phone.includes(search);

        return (
          semesterMatch &&
          divisionMatch &&
          searchMatch
        );

      }
    );

  }


  // ========================================
  // GET STATUS
  // ========================================

  getStatus(
    studentId: string
  ):
    | 'Present'
    | 'Absent'
    | 'Late'
    | undefined {

    return this.attendanceMap[studentId];

  }


  // ========================================
  // SET STATUS
  // ========================================

  setStatus(
    studentId: string,
    status: 'Present' | 'Absent' | 'Late'
  ): void {

    if (!studentId) {
      return;
    }

    this.attendanceMap[studentId] = status;

    this.successMessage = '';

    this.errorMessage = '';

  }


  // ========================================
  // PRESENT COUNT
  // ========================================

  getPresentCount(): number {

    return Object.values(
      this.attendanceMap
    ).filter(
      status => status === 'Present'
    ).length;

  }


  // ========================================
  // ABSENT COUNT
  // ========================================

  getAbsentCount(): number {

    return Object.values(
      this.attendanceMap
    ).filter(
      status => status === 'Absent'
    ).length;

  }


  // ========================================
  // LATE COUNT
  // ========================================

  getLateCount(): number {

    return Object.values(
      this.attendanceMap
    ).filter(
      status => status === 'Late'
    ).length;

  }


  // ========================================
  // SAVE STUDENT ATTENDANCE
  // ========================================

  async saveStudentAttendance(
    student: AttendanceStudent
  ): Promise<void> {

    const studentId = this.getStudentId(student);

    if (!studentId) {

      this.errorMessage =
        'Student ID is missing.';

      return;

    }

    const status = this.getStatus(studentId);

    if (!status) {

      this.errorMessage =
        'Please select attendance status first.';

      return;

    }

    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';

    try {

      console.log(
        'Saving attendance:',
        {
          studentId,
          date: this.selectedDate,
          status
        }
      );

      const response =
        await this.facultyAttendanceService.saveAttendance({

          studentId: studentId,

          date: this.selectedDate,

          status: status

        });

      console.log(
        'Save Attendance Response:',
        response
      );

      if (!response || !response.success) {

        throw new Error(
          response?.message ||
          'Failed to save attendance.'
        );

      }

      this.successMessage =
        `Attendance saved for ${student.firstName || ''} ${student.lastName || ''}.`;

      // Reload attendance from backend

      await this.loadAttendance();

    } catch (error: any) {

      console.error(
        'Save attendance error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to save attendance.';

    } finally {

      this.isSaving = false;

    }

  }


  // ========================================
  // CLEAR FILTERS
  // ========================================

  clearFilters(): void {

    this.selectedSemester = 'All';

    this.selectedDivision = 'All';

    this.searchText = '';

    this.filterStudents();

  }

}