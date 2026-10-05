import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  FacultyStudentsService,
  FacultyStudent
} from '../../../core/services/faculty-students.service';


@Component({
  selector: 'app-students',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './students.component.html',

  styleUrl: './students.component.css'
})
export class StudentsComponent
  implements OnInit {

  /*
  ========================================
  SERVICES
  ========================================
  */

  private facultyStudentsService =
    inject(FacultyStudentsService);

  private router =
    inject(Router);


  /*
  ========================================
  STUDENT DATA
  ========================================
  */

  students: FacultyStudent[] = [];

  filteredStudents: FacultyStudent[] = [];


  /*
  ========================================
  DEPARTMENT
  ========================================
  */

  departmentName = '';

  departmentCode = '';

  totalStudents = 0;


  /*
  ========================================
  FILTERS
  ========================================
  */

  searchText = '';

  selectedSemester = 'All';

  selectedDivision = 'All';

  semesters: string[] = [];

  divisions: string[] = [];


  /*
  ========================================
  STATE
  ========================================
  */

  isLoading = true;

  errorMessage = '';


  /*
  ========================================
  INIT
  ========================================
  */

  ngOnInit(): void {

    this.loadStudents();

  }


  /*
  ========================================
  LOAD STUDENTS
  ========================================
  */

  async loadStudents(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';


    try {

      const data =
        await this.facultyStudentsService
          .getMyStudents();


      /*
      ----------------------------------------
      STUDENTS
      ----------------------------------------
      */

      this.students =
        data?.students ?? [];


      /*
      ----------------------------------------
      FILTERED STUDENTS
      ----------------------------------------
      */

      this.filteredStudents =
        [...this.students];


      /*
      ----------------------------------------
      TOTAL STUDENTS
      ----------------------------------------
      */

      this.totalStudents =
        data?.totalStudents ??
        this.students.length;


      /*
      ----------------------------------------
      DEPARTMENT
      ----------------------------------------
      */

      this.departmentName =
        data?.department?.name ?? '';


      this.departmentCode =
        data?.department?.code ?? '';


      /*
      ----------------------------------------
      BUILD FILTERS
      ----------------------------------------
      */

      this.buildFilters();


    } catch (error: any) {

      console.error(
        'Faculty students error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load students.';


    } finally {

      this.isLoading = false;

    }
  }


  /*
  ========================================
  BUILD FILTER OPTIONS
  ========================================
  */

  buildFilters(): void {

    /*
    ========================================
    SEMESTERS
    ========================================
    */

    this.semesters = Array.from(
      new Set(
        this.students
          .map(student => student.semester)
          .filter(
            (semester): semester is number =>
              semester !== undefined &&
              semester !== null
          )
          .map(semester => String(semester))
      )
    ).sort(
      (a, b) => Number(a) - Number(b)
    );


    /*
    ========================================
    DIVISIONS
    ========================================
    */

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

          /*
          ----------------------------------------
          FULL NAME
          ----------------------------------------
          */

          const fullName =
            `${student.firstName ?? ''} ${student.lastName ?? ''}`
              .trim()
              .toLowerCase();


          /*
          ----------------------------------------
          ENROLLMENT NUMBER
          ----------------------------------------
          */

          const enrollmentNo =
            (
              student.enrollmentNo ?? ''
            )
              .toLowerCase();


          /*
          ----------------------------------------
          SEARCH
          ----------------------------------------
          */

          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            enrollmentNo.includes(search);


          /*
          ----------------------------------------
          SEMESTER
          ----------------------------------------
          */

          const matchesSemester =
            this.selectedSemester === 'All' ||
            String(
              student.semester ?? ''
            ) === this.selectedSemester;


          /*
          ----------------------------------------
          DIVISION
          ----------------------------------------
          */

          const matchesDivision =
            this.selectedDivision === 'All' ||
            (
              student.division ?? ''
            ) === this.selectedDivision;


          /*
          ----------------------------------------
          FINAL RESULT
          ----------------------------------------
          */

          return (
            matchesSearch &&
            matchesSemester &&
            matchesDivision
          );

        }
      );

  }


  /*
  ========================================
  CLEAR FILTERS
  ========================================
  */

  clearFilters(): void {

    this.searchText = '';

    this.selectedSemester = 'All';

    this.selectedDivision = 'All';

    this.filteredStudents =
      [...this.students];

  }


  /*
  ========================================
  GET STUDENT NAME
  ========================================
  */

  getStudentName(
    student: FacultyStudent
  ): string {

    const firstName =
      student.firstName ?? '';

    const lastName =
      student.lastName ?? '';


    return (
      `${firstName} ${lastName}`.trim() ||
      'Student'
    );

  }


  /*
  ========================================
  GET STUDENT INITIALS
  ========================================
  */

  getInitials(
    student: FacultyStudent
  ): string {

    const first =
      student.firstName
        ?.charAt(0)
        .toUpperCase() || '';


    const last =
      student.lastName
        ?.charAt(0)
        .toUpperCase() || '';


    const initials =
      `${first}${last}`;


    return initials || 'ST';

  }


  /*
  ========================================
  VIEW STUDENT
  ========================================
  */

  viewStudent(
    student: FacultyStudent
  ): void {

    const id =
      student.uid ||
      student.id;


    if (!id) {

      console.error(
        'Student ID is missing'
      );

      return;
    }


    this.router.navigate([
      '/faculty/students',
      id
    ]);

  }

}