import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ApiService
} from '../../../core/services/api.service';


/* ========================================
   Interfaces
======================================== */

interface AttendanceRecord {

  id?: string;

  studentId?: string;

  subjectId?: string;

  subjectName?: string;

  subject?: string;

  subjectCode?: string;

  code?: string;

  status?: string;

  semester?: number | string | null;

  date?: any;

  attendanceDate?: any;

  createdAt?: any;

  updatedAt?: any;

}


interface SubjectAttendance {

  subject: string;

  code: string;

  subjectId: string;

  total: number;

  present: number;

  absent: number;

  late: number;

  percentage: number;

}


/* ========================================
   Component
======================================== */

@Component({

  selector: 'app-attendance',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './attendance.component.html',

  styleUrl: './attendance.component.css'

})


export class AttendanceComponent
  implements OnInit {


  /* ========================================
     Loading / Error
  ======================================== */

  loading = true;

  errorMessage = '';


  /* ========================================
     Student
  ======================================== */

  student: any = null;


  /* ========================================
     Attendance Records
  ======================================== */

  attendanceRecords:
    AttendanceRecord[] = [];


  /* ========================================
     Subjects
  ======================================== */

  subjects:
    SubjectAttendance[] = [];


  /* ========================================
     Semester
  ======================================== */

  selectedSemester =
    'Current Semester';

  availableSemesters:
    string[] = [];


  /* ========================================
     Summary
  ======================================== */

  overallAttendance:
    number | null = null;

  totalClasses = 0;

  presentClasses = 0;

  absentClasses = 0;

  lateClasses = 0;


  /* ========================================
     Constructor
  ======================================== */

  constructor(
    private apiService: ApiService
  ) {}


  /* ========================================
     On Init
  ======================================== */

  async ngOnInit(): Promise<void> {

    await this.loadAttendance();

  }


  /* ========================================
     Load Attendance
  ======================================== */

  async loadAttendance(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';


      /* ------------------------------------
         Student Dashboard
      ------------------------------------ */

      const response =
        await this.apiService.get<any>(
          '/student-dashboard/me'
        );


      console.log(
        'Attendance dashboard response:',
        response
      );


      if (
        !response?.success
      ) {

        throw new Error(
          'Unable to load attendance data.'
        );

      }


      const data =
        response.data;


      /* ------------------------------------
         Student
      ------------------------------------ */

      this.student =
        data?.student || null;


      /* ------------------------------------
         Attendance
      ------------------------------------ */

      this.attendanceRecords =
        Array.isArray(
          data?.attendance
        )
          ? data.attendance
          : [];


      /* ------------------------------------
         Build Semesters
      ------------------------------------ */

      this.buildAvailableSemesters();


      /* ------------------------------------
         Select Student Semester
      ------------------------------------ */

      this.setDefaultSemester();


      /* ------------------------------------
         Calculate Attendance
      ------------------------------------ */

      this.calculateAttendance();

    }

    catch (error: any) {

      console.error(
        'Attendance loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load attendance data.';

    }

    finally {

      this.loading = false;

    }

  }


  /* ========================================
     Build Available Semesters
  ======================================== */

  private buildAvailableSemesters(): void {

    const semesterNumbers =
      this.attendanceRecords

        .map(
          record =>
            record.semester
        )

        .filter(
          (
            semester
          ): semester is
            number | string =>
              semester !== null &&
              semester !== undefined &&
              semester !== ''
        )

        .map(
          semester =>
            Number(semester)
        )

        .filter(
          semester =>
            !isNaN(semester)
        );


    const uniqueSemesters =
      Array.from(
        new Set(
          semesterNumbers
        )
      );


    uniqueSemesters.sort(
      (
        first,
        second
      ) =>
        first - second
    );


    this.availableSemesters =
      uniqueSemesters.map(
        semester =>
          `Semester ${semester}`
      );

  }


  /* ========================================
     Set Default Semester
  ======================================== */

  private setDefaultSemester(): void {

    const studentSemester =
      this.student?.semester;


    if (
      studentSemester !==
        undefined &&
      studentSemester !==
        null &&
      studentSemester !== ''
    ) {

      const semesterName =
        `Semester ${studentSemester}`;


      if (
        this.availableSemesters
          .includes(
            semesterName
          )
      ) {

        this.selectedSemester =
          semesterName;

        return;

      }

    }


    /*
     * If no semester is available,
     * show all records.
     */

    this.selectedSemester =
      'Current Semester';

  }


  /* ========================================
     Semester Change
  ======================================== */

  onSemesterChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    this.selectedSemester =
      select.value;


    this.calculateAttendance();

  }


  /* ========================================
     Get Filtered Attendance
  ======================================== */

  private getFilteredAttendance():
    AttendanceRecord[] {

    if (
      this.selectedSemester ===
      'Current Semester'
    ) {

      /*
       * If current semester is available,
       * filter by student's semester.
       */

      const studentSemester =
        this.student?.semester;


      if (
        studentSemester !==
          undefined &&
        studentSemester !==
          null &&
        studentSemester !== ''
      ) {

        return this.attendanceRecords
          .filter(
            record =>
              String(
                record.semester
              ) ===
              String(
                studentSemester
              )
          );

      }


      /*
       * Otherwise use all records.
       */

      return [
        ...this.attendanceRecords
      ];

    }


    /*
     * Specific semester
     */

    const semesterNumber =
      this.selectedSemester
        .replace(
          'Semester ',
          ''
        );


    return this.attendanceRecords
      .filter(
        record =>
          String(
            record.semester
          ) ===
          semesterNumber
      );

  }


  /* ========================================
     Calculate Attendance
  ======================================== */

  private calculateAttendance(): void {

    const records =
      this.getFilteredAttendance();


    /* ------------------------------------
       Reset
    ------------------------------------ */

    this.totalClasses =
      records.length;

    this.presentClasses = 0;

    this.absentClasses = 0;

    this.lateClasses = 0;


    /* ------------------------------------
       Count Status
    ------------------------------------ */

    records.forEach(
      record => {

        const status =
          String(
            record.status || ''
          )
            .trim()
            .toLowerCase();


        if (
          status === 'present'
        ) {

          this.presentClasses++;

        }

        else if (
          status === 'absent'
        ) {

          this.absentClasses++;

        }

        else if (
          status === 'late'
        ) {

          this.lateClasses++;

        }

      }
    );


    /* ------------------------------------
       Calculate Percentage
    ------------------------------------ */

    if (
      this.totalClasses === 0
    ) {

      this.overallAttendance =
        null;

    }

    else {

      /*
       * Late is treated as attended.
       */

      const attended =
        this.presentClasses +
        this.lateClasses;


      this.overallAttendance =
        Number(
          (
            attended /
            this.totalClasses
          * 100
          ).toFixed(2)
        );

    }


    /* ------------------------------------
       Subject Attendance
    ------------------------------------ */

    this.buildSubjectAttendance(
      records
    );

  }


  /* ========================================
     Build Subject Attendance
  ======================================== */

  private buildSubjectAttendance(
    records: AttendanceRecord[]
  ): void {

    const subjectMap =
      new Map<
        string,
        AttendanceRecord[]
      >();


    /* ------------------------------------
       Group By Subject
    ------------------------------------ */

    records.forEach(
      record => {

        const subjectId =
          String(
            record.subjectId ||
            record.subjectCode ||
            record.code ||
            record.subjectName ||
            record.subject ||
            'unknown'
          );


        if (
          !subjectMap.has(
            subjectId
          )
        ) {

          subjectMap.set(
            subjectId,
            []
          );

        }


        subjectMap
          .get(subjectId)!
          .push(record);

      }
    );


    /* ------------------------------------
       Create Subject Objects
    ------------------------------------ */

    this.subjects =
      Array.from(
        subjectMap.entries()
      ).map(
        (
          [
            subjectId,
            records
          ]
        ) => {

          let present = 0;

          let absent = 0;

          let late = 0;


          records.forEach(
            record => {

              const status =
                String(
                  record.status || ''
                )
                  .trim()
                  .toLowerCase();


              if (
                status === 'present'
              ) {

                present++;

              }

              else if (
                status === 'absent'
              ) {

                absent++;

              }

              else if (
                status === 'late'
              ) {

                late++;

              }

            }
          );


          const total =
            records.length;


          const attended =
            present +
            late;


          const percentage =
            total > 0
              ? Number(
                  (
                    attended /
                    total
                  * 100
                  ).toFixed(2)
                )
              : 0;


          const firstRecord =
            records[0];


          const subject =
            firstRecord.subjectName ||
            firstRecord.subject ||
            firstRecord.subjectCode ||
            firstRecord.code ||
            subjectId;


          const code =
            firstRecord.subjectCode ||
            firstRecord.code ||
            subjectId;


          return {

            subject,

            code,

            subjectId,

            total,

            present,

            absent,

            late,

            percentage

          };

        }
      );


    /* ------------------------------------
       Sort Subjects
    ------------------------------------ */

    this.subjects.sort(
      (
        first,
        second
      ) =>
        first.subject.localeCompare(
          second.subject
        )
    );

  }


  /* ========================================
     Attendance Class
  ======================================== */

  getAttendanceClass(
    percentage: number
  ): string {

    if (
      percentage >= 85
    ) {

      return 'attendance-good';

    }


    if (
      percentage >= 75
    ) {

      return 'attendance-warning';

    }


    return 'attendance-danger';

  }


  /* ========================================
     Attendance Status
  ======================================== */

  getAttendanceStatus(
    percentage: number | null
  ): string {

    if (
      percentage === null ||
      percentage === undefined
    ) {

      return 'No Data';

    }


    if (
      percentage >= 85
    ) {

      return 'Good Attendance';

    }


    if (
      percentage >= 75
    ) {

      return 'Warning';

    }


    return 'Critical';

  }


  /* ========================================
     Attendance Circle
  ======================================== */

  get attendanceCircleBackground(): string {

    const percentage =
      this.overallAttendance === null
        ? 0
        : Math.min(
            Math.max(
              this.overallAttendance,
              0
            ),
            100
          );


    return `
      conic-gradient(
        #2563eb 0% ${percentage}%,
        #e5e7eb ${percentage}% 100%
      )
    `;

  }


  /* ========================================
     Display Values
  ======================================== */

  get overallAttendanceDisplay(): string {

    if (
      this.overallAttendance === null
    ) {

      return '—';

    }


    return `${this.overallAttendance}%`;

  }


  /* ========================================
     Requirement
  ======================================== */

  get meetsRequirement(): boolean {

    if (
      this.overallAttendance === null
    ) {

      return false;

    }


    return (
      this.overallAttendance >= 75
    );

  }


  /* ========================================
     Retry
  ======================================== */

  async retry(): Promise<void> {

    await this.loadAttendance();

  }

}