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
  FacultyMarksService,
  MarksStudent,
  MarksSubject,
  MarkRecord
} from '../../../core/services/faculty-marks.service';


/*
========================================
STUDENT MARK ENTRY
========================================
*/

interface StudentMarkEntry {

  marksObtained: number | null;

  maxMarks: number;

  percentage?: number;

  grade?: string;

  id?: string;

}


@Component({
  selector: 'app-marks',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './marks.component.html',

  styleUrl: './marks.component.css'
})
export class MarksComponent
  implements OnInit {


  // ========================================
  // STUDENTS
  // ========================================

  students: MarksStudent[] = [];

  filteredStudents: MarksStudent[] = [];


  // ========================================
  // SUBJECTS
  // ========================================

  subjects: MarksSubject[] = [];


  // ========================================
  // MARKS
  // ========================================

  marks: MarkRecord[] = [];


  marksMap: {
    [studentId: string]: StudentMarkEntry;
  } = {};


  // ========================================
  // DEPARTMENT
  // ========================================

  departmentName = '';

  departmentCode = '';


  // ========================================
  // FILTERS
  // ========================================

  selectedSubjectId = '';

  selectedExamType = 'Internal 1';

  selectedSemester = 'All';

  selectedDivision = 'All';

  searchText = '';


  semesters: string[] = [];

  divisions: string[] = [];


  // ========================================
  // EXAM TYPES
  // ========================================

  examTypes: string[] = [

    'Internal 1',

    'Internal 2',

    'Mid Semester',

    'Final Semester',

    'Practical',

    'Viva'

  ];


  // ========================================
  // MAX MARKS
  // ========================================

  maxMarks = 100;


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
    private facultyMarksService:
      FacultyMarksService
  ) {}


  // ========================================
  // INIT
  // ========================================

  ngOnInit(): void {

    this.loadSubjects();

  }


  // ========================================
  // LOAD SUBJECTS
  // ========================================

  async loadSubjects(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.facultyMarksService
          .getSubjects();


      this.subjects =
        response?.data || [];


      if (
        this.subjects.length > 0
      ) {

        this.selectedSubjectId =
          this.subjects[0].id;

      }


      await this.loadMarks();

    } catch (error: any) {

      console.error(
        'Load subjects error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load subjects.';

      this.isLoading = false;

    }

  }


  // ========================================
  // LOAD MARKS
  // ========================================

  async loadMarks(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    try {

      const response =
        await this.facultyMarksService
          .getMarks(
            this.selectedSubjectId,
            this.selectedExamType
          );


      if (
        !response ||
        !response.success
      ) {

        throw new Error(
          'Unable to load marks data'
        );

      }


      const data =
        response.data;


      // ------------------------------------
      // Department
      // ------------------------------------

      this.departmentName =
        data.department?.name || '';

      this.departmentCode =
        data.department?.code || '';


      // ------------------------------------
      // Students
      // ------------------------------------

      this.students =
        data.students || [];


      // ------------------------------------
      // Marks
      // ------------------------------------

      this.marks =
        data.marks || [];


      // ------------------------------------
      // Build data
      // ------------------------------------

      this.buildMarksMap();

      this.buildFilters();

      this.filterStudents();

    } catch (error: any) {

      console.error(
        'Load marks error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load marks data.';

    } finally {

      this.isLoading = false;

    }

  }


  // ========================================
  // BUILD MARKS MAP
  // ========================================

  buildMarksMap(): void {

    this.marksMap = {};


    for (
      const mark of this.marks
    ) {

      if (!mark.studentId) {

        continue;

      }


      this.marksMap[
        mark.studentId
      ] = {

        marksObtained:
          mark.marksObtained,

        maxMarks:
          mark.maxMarks,

        percentage:
          mark.percentage,

        grade:
          mark.grade,

        id:
          mark.id

      };

    }

  }


  // ========================================
  // BUILD FILTERS
  // ========================================

  buildFilters(): void {

    this.semesters =
      Array.from(
        new Set(
          this.students
            .map(
              student =>
                student.semester
            )
            .filter(
              (
                semester
              ): semester is number =>
                semester !== undefined &&
                semester !== null
            )
            .map(
              semester =>
                String(semester)
            )
        )
      ).sort(
        (a, b) =>
          Number(a) - Number(b)
      );


    this.divisions =
      Array.from(
        new Set(
          this.students
            .map(
              student =>
                student.division
            )
            .filter(
              (
                division
              ): division is string =>
                typeof division === 'string' &&
                division.trim().length > 0
            )
            .map(
              division =>
                division.trim()
            )
        )
      ).sort();

  }


  // ========================================
  // FILTER STUDENTS
  // ========================================

  filterStudents(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredStudents =
      this.students.filter(
        student => {

          const semesterMatch =
            this.selectedSemester === 'All' ||
            String(
              student.semester
            ) ===
            this.selectedSemester;


          const divisionMatch =
            this.selectedDivision === 'All' ||
            (
              student.division || ''
            ).toLowerCase() ===
            this.selectedDivision.toLowerCase();


          const fullName =
            `${student.firstName || ''} ${
              student.lastName || ''
            }`.toLowerCase();


          const enrollment =
            (
              student.enrollmentNo || ''
            ).toLowerCase();


          const searchMatch =
            !search ||
            fullName.includes(search) ||
            enrollment.includes(search);


          return (
            semesterMatch &&
            divisionMatch &&
            searchMatch
          );

        }
      );

  }


  // ========================================
  // GET STUDENT MARKS
  // ========================================

  getStudentMarks(
    studentId: string
  ): StudentMarkEntry | undefined {

    if (!studentId) {

      return undefined;

    }


    return this.marksMap[
      studentId
    ];

  }


  // ========================================
  // GET MARKS VALUE
  // ========================================

  getMarksValue(
    studentId: string
  ): number | null {

    const record =
      this.getStudentMarks(
        studentId
      );


    if (!record) {

      return null;

    }


    return record.marksObtained;

  }


  // ========================================
  // SET MARKS
  // ========================================

  setMarks(
    studentId: string,
    value: number | string
  ): void {

    if (!studentId) {

      return;

    }


    if (
      value === '' ||
      value === null ||
      value === undefined
    ) {

      const existing =
        this.getStudentMarks(
          studentId
        );


      this.marksMap[
        studentId
      ] = {

        marksObtained: null,

        maxMarks:
          this.maxMarks,

        id:
          existing?.id

      };

      return;

    }


    const numericValue =
      Number(value);


    if (
      Number.isNaN(
        numericValue
      )
    ) {

      return;

    }


    let validMarks =
      numericValue;


    if (validMarks < 0) {

      validMarks = 0;

    }


    if (
      validMarks >
      this.maxMarks
    ) {

      validMarks =
        this.maxMarks;

    }


    const percentage =
      Number(
        (
          (
            validMarks /
            this.maxMarks
          ) * 100
        ).toFixed(2)
      );


    const grade =
      this.calculateGrade(
        percentage
      );


    const existing =
      this.getStudentMarks(
        studentId
      );


    this.marksMap[
      studentId
    ] = {

      marksObtained:
        validMarks,

      maxMarks:
        this.maxMarks,

      percentage,

      grade,

      id:
        existing?.id

    };

  }


  // ========================================
  // CALCULATE PERCENTAGE
  // ========================================

  calculatePercentage(
    studentId: string
  ): number {

    const record =
      this.getStudentMarks(
        studentId
      );


    if (
      !record ||
      record.marksObtained === null ||
      !record.maxMarks
    ) {

      return 0;

    }


    return Number(
      (
        (
          record.marksObtained /
          record.maxMarks
        ) * 100
      ).toFixed(2)
    );

  }


  // ========================================
  // CALCULATE GRADE
  // ========================================

  calculateGrade(
    percentage: number
  ): string {

    if (percentage >= 90) {

      return 'A+';

    }


    if (percentage >= 80) {

      return 'A';

    }


    if (percentage >= 70) {

      return 'B+';

    }


    if (percentage >= 60) {

      return 'B';

    }


    if (percentage >= 50) {

      return 'C';

    }


    if (percentage >= 40) {

      return 'D';

    }


    return 'F';

  }


  // ========================================
  // SAVE STUDENT MARKS
  // ========================================

  async saveStudentMarks(
    student: MarksStudent
  ): Promise<void> {

    const studentId =
      student.id ||
      student.uid ||
      '';


    if (!studentId) {

      this.errorMessage =
        'Student ID is missing.';

      return;

    }


    const record =
      this.getStudentMarks(
        studentId
      );


    if (
      !record ||
      record.marksObtained === null ||
      record.marksObtained === undefined
    ) {

      this.errorMessage =
        'Please enter marks before saving.';

      return;

    }


    if (!this.selectedSubjectId) {

      this.errorMessage =
        'Please select a subject.';

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    try {

      await this.facultyMarksService
        .saveMarks({

          studentId:

            studentId,

          subjectId:

            this.selectedSubjectId,

          examType:

            this.selectedExamType,

          marksObtained:

            Number(
              record.marksObtained
            ),

          maxMarks:

            Number(
              record.maxMarks
            )

        });


      this.successMessage =
        `Marks saved for ${
          student.firstName
        } ${
          student.lastName
        }.`;


      await this.loadMarks();

    } catch (error: any) {

      console.error(
        'Save marks error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to save marks.';

    } finally {

      this.isSaving = false;

    }

  }


  // ========================================
  // CLEAR FILTERS
  // ========================================

  clearFilters(): void {

    this.selectedSemester =
      'All';

    this.selectedDivision =
      'All';

    this.searchText =
      '';


    this.filterStudents();

  }


  // ========================================
  // SUBJECT CHANGE
  // ========================================

  async onSubjectChange(): Promise<void> {

    await this.loadMarks();

  }


  // ========================================
  // EXAM TYPE CHANGE
  // ========================================

  async onExamTypeChange(): Promise<void> {

    await this.loadMarks();

  }


  // ========================================
  // ENTERED COUNT
  // ========================================

  getEnteredCount(): number {

    return this.filteredStudents
      .filter(
        student => {

          const studentId =
            student.id ||
            student.uid ||
            '';


          const record =
            this.getStudentMarks(
              studentId
            );


          return (
            !!record &&
            record.marksObtained !== null &&
            record.marksObtained !== undefined
          );

        }
      )
      .length;

  }


  // ========================================
  // AVERAGE
  // ========================================

  getAveragePercentage(): number {

    const values =
      this.filteredStudents
        .map(
          student => {

            const studentId =
              student.id ||
              student.uid ||
              '';


            return this.calculatePercentage(
              studentId
            );

          }
        )
        .filter(
          percentage =>
            percentage > 0
        );


    if (!values.length) {

      return 0;

    }


    const total =
      values.reduce(
        (
          sum,
          value
        ) =>
          sum + value,
        0
      );


    return Number(
      (
        total /
        values.length
      ).toFixed(2)
    );

  }


  // ========================================
  // GRADE COUNT
  // ========================================

  getGradeCount(
    grade: string
  ): number {

    return this.filteredStudents
      .filter(
        student => {

          const studentId =
            student.id ||
            student.uid ||
            '';


          const record =
            this.getStudentMarks(
              studentId
            );


          return (
            record?.grade === grade
          );

        }
      )
      .length;

  }

}