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

interface MarkRecord {

  id?: string;

  studentId?: string;

  subjectId?: string;

  subject?: string;

  subjectName?: string;

  subjectCode?: string;

  code?: string;

  semester?: number | string | null;

  internal?: number;

  internalMarks?: number;

  external?: number;

  externalMarks?: number;

  marksObtained?: number;

  maximumMarks?: number;

  total?: number;

  grade?: string;

  gradePoint?: number;

  createdAt?: any;

  updatedAt?: any;

}


interface SubjectCatalogItem {
  id?: string;
  subjectId?: string;
  name?: string;
  subjectName?: string;
  subject?: string;
  code?: string;
  subjectCode?: string;
}


interface SubjectMark {

  subject: string;

  code: string;

  subjectId: string;

  internal: number;

  external: number;

  total: number;

  grade: string;

  percentage: number;

}


/* ========================================
   Component
======================================== */

@Component({

  selector: 'app-marks',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './marks.component.html',

  styleUrl: './marks.component.css'

})


export class MarksComponent
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
     Marks
  ======================================== */

  marksRecords:
    MarkRecord[] = [];

  subjects:
    SubjectMark[] = [];

  // Master subject records used to resolve subject IDs to names.
  subjectCatalog: SubjectCatalogItem[] = [];


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

  overallPercentage:
    number | null = null;

  overallGrade =
    '—';

  totalSubjects = 0;

  passedSubjects = 0;

  highestMarks:
    number | null = null;

  lowestMarks:
    number | null = null;


  /* ========================================
     Constructor
  ======================================== */

  constructor(
    private apiService: ApiService
  ) {}


  /* ========================================
     Init
  ======================================== */

  async ngOnInit(): Promise<void> {

    await this.loadMarks();

  }


  /* ========================================
     Load Marks
  ======================================== */

  async loadMarks(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';


      /*
       * Load logged-in student's marks.
       *
       * The interceptor automatically
       * attaches Firebase ID token.
       */

      const response =
        await this.apiService.get<any>(
          '/marks/me'
        );


      console.log(
        'Marks response:',
        response
      );


      /*
       * Handle different possible
       * backend response structures.
       */

      const data =
        response?.data;


      /* ------------------------------------
         Student
      ------------------------------------ */

      this.student =
        data?.student ||
        null;


      /* ------------------------------------
         Extract Marks
      ------------------------------------ */

      if (
        Array.isArray(data)
      ) {

        this.marksRecords =
          data;

      }

      else if (
        Array.isArray(
          data?.marks
        )
      ) {

        this.marksRecords =
          data.marks;

      }

      else if (
        Array.isArray(
          data?.records
        )
      ) {

        this.marksRecords =
          data.records;

      }

      else {

        this.marksRecords =
          [];

      }


      /*
       * If backend directly returns
       * an array.
       */

      if (
        Array.isArray(response?.data)
      ) {

        this.marksRecords =
          response.data;

      }


      console.log(
        'Student marks records:',
        this.marksRecords
      );

      await this.loadSubjectCatalog();


      /* ------------------------------------
         Build semesters
      ------------------------------------ */

      this.buildAvailableSemesters();


      /* ------------------------------------
         Select current semester
      ------------------------------------ */

      this.setDefaultSemester();


      /* ------------------------------------
         Calculate everything
      ------------------------------------ */

      this.calculateMarks();

    }

    catch (error: any) {

      console.error(
        'Marks loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load marks.';

    }

    finally {

      this.loading = false;

    }

  }


  /* ========================================
     Build Available Semesters
  ======================================== */

  private buildAvailableSemesters(): void {

    const semesters =
      this.marksRecords

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
        new Set(semesters)
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


    this.calculateMarks();

  }


  /* ========================================
     Get Filtered Marks
  ======================================== */

  private getFilteredMarks():
    MarkRecord[] {

    /*
     * Current Semester
     */

    if (
      this.selectedSemester ===
      'Current Semester'
    ) {

      const studentSemester =
        this.student?.semester;


      if (
        studentSemester !==
          undefined &&
        studentSemester !==
          null &&
        studentSemester !== ''
      ) {

        const filtered =
          this.marksRecords.filter(
            record =>
              String(
                record.semester
              ) ===
              String(
                studentSemester
              )
          );


        /*
         * If semester information exists
         * and matching records exist,
         * use them.
         */

        if (
          filtered.length > 0
        ) {

          return filtered;

        }

      }


      /*
       * If semester is not available,
       * use all marks.
       */

      return [
        ...this.marksRecords
      ];

    }


    /*
     * Specific semester
     */

    const semesterNumber =
      this.selectedSemester.replace(
        'Semester ',
        ''
      );


    return this.marksRecords.filter(
      record =>
        String(
          record.semester
        ) ===
        semesterNumber
    );

  }


  /* ========================================
     Calculate Marks
  ======================================== */

  private calculateMarks(): void {

    const records =
      this.getFilteredMarks();


    /*
     * Convert records into
     * subject-wise marks.
     */

    this.subjects =
      this.buildSubjectMarks(
        records
      );


    /*
     * Number of subjects
     */

    this.totalSubjects =
      this.subjects.length;


    /*
     * Overall percentage
     */

    if (
      this.subjects.length === 0
    ) {

      this.overallPercentage =
        null;

      this.overallGrade =
        '—';

      this.passedSubjects = 0;

      this.highestMarks =
        null;

      this.lowestMarks =
        null;

      return;

    }


    const percentages =
      this.subjects.map(
        subject =>
          subject.percentage
      );


    /*
     * Average percentage
     */

    const totalPercentage =
      percentages.reduce(
        (
          sum: number,
          value: number
        ) => {

          return sum + value;

        },
        0
      );


    this.overallPercentage =
      Number(
        (
          totalPercentage /
          percentages.length
        ).toFixed(2)
      );


    /*
     * Overall grade
     */

    this.overallGrade =
      this.calculateGrade(
        this.overallPercentage
      );


    /*
     * Passed subjects
     */

    this.passedSubjects =
      this.subjects.filter(
        subject =>
          subject.percentage >= 40
      ).length;


    /*
     * Highest
     */

    this.highestMarks =
      Math.max(
        ...percentages
      );


    /*
     * Lowest
     */

    this.lowestMarks =
      Math.min(
        ...percentages
      );

  }


  /* ========================================
     Load Subject Catalog
  ======================================== */

  private async loadSubjectCatalog(): Promise<void> {
    try {
      const response =
        await this.apiService.get<any>(
          '/subjects'
        );

      const data = response?.data;

      this.subjectCatalog = Array.isArray(data)
        ? data
        : Array.isArray(data?.subjects)
          ? data.subjects
          : Array.isArray(data?.records)
            ? data.records
            : [];

    } catch (error) {
      console.error(
        'Unable to load subject catalog:',
        error
      );

      this.subjectCatalog = [];
    }
  }


  private findSubjectById(
    subjectId: string
  ): SubjectCatalogItem | undefined {
    const normalizedId = String(subjectId || '').trim();

    if (!normalizedId) {
      return undefined;
    }

    return this.subjectCatalog.find(subject => {
      const ids = [
        subject.id,
        subject.subjectId
      ]
        .filter(id => id !== undefined && id !== null)
        .map(id => String(id).trim());

      return ids.includes(normalizedId);
    });
  }


  /* ========================================
     Build Subject Marks
  ======================================== */

  private buildSubjectMarks(
    records: MarkRecord[]
  ): SubjectMark[] {

    const subjectMap =
      new Map<
        string,
        MarkRecord[]
      >();


    /*
     * Group records by subject.
     */

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


    /*
     * Convert groups into subjects.
     */

    return Array.from(
      subjectMap.entries()
    ).map(
      (
        [
          subjectId,
          records
        ]
      ) => {

        /*
         * Usually one mark record
         * exists per subject.
         *
         * If multiple records exist,
         * combine them.
         */

        const internal =
          records.reduce(
            (
              sum: number,
              record: MarkRecord
            ) => {

              return sum +
                this.getInternalMarks(
                  record
                );

            },
            0
          );


        const external =
          records.reduce(
            (
              sum: number,
              record: MarkRecord
            ) => {

              return sum +
                this.getExternalMarks(
                  record
                );

            },
            0
          );


        /*
         * Calculate the subject's raw total.
         *
         * Prefer the stored total/marksObtained values. If records contain
         * separate internal/external components without a stored total,
         * calculate the total from those components.
         *
         * If there are multiple records for a subject, use the highest
         * available maximum and aggregate each record's total once.
         */
        const storedTotals = records
          .map(record => this.getTotalMarks(record))
          .filter(value => Number.isFinite(value) && value >= 0);

        /*
         * A subject can have more than one mark document. Do not add
         * each document's already-calculated total together, because
         * that can double-count the same subject and produce values
         * such as 158%. Use the highest stored total for the subject.
         */
        let totalMarks = storedTotals.length > 0
          ? Math.max(...storedTotals)
          : internal + external;

        if (!Number.isFinite(totalMarks) || totalMarks < 0) {
          totalMarks = 0;
        }

        /*
         * Determine the maximum marks. Default to 100 when the backend
         * does not provide maximumMarks.
         */
        let maximumMarks = 100;

        records.forEach(record => {
          const recordMaximum = Number(record.maximumMarks);

          if (
            Number.isFinite(recordMaximum) &&
            recordMaximum > 0
          ) {
            maximumMarks = recordMaximum;
          }
        });

        /*
         * Convert raw marks to a percentage and clamp the result to
         * the valid 0–100 range. This prevents values such as 158%
         * from being displayed when summed records exceed the maximum.
         */
        const percentage = Number(
          Math.min(
            100,
            Math.max(
              0,
              (totalMarks / maximumMarks) * 100
            )
          ).toFixed(2)
        );

        /*
         * Grade.
         */

        const backendGrade =
          records.find(
            record =>
              !!record.grade
          )?.grade;


        const grade =
          backendGrade ||
          this.calculateGrade(
            percentage
          );


        /*
         * Subject name.
         */

        const firstRecord = records[0];

        const catalogSubject = this.findSubjectById(
          String(firstRecord.subjectId || subjectId)
        );

        const subject =
          catalogSubject?.name ||
          catalogSubject?.subjectName ||
          catalogSubject?.subject ||
          firstRecord.subjectName ||
          firstRecord.subject ||
          catalogSubject?.code ||
          catalogSubject?.subjectCode ||
          firstRecord.subjectCode ||
          firstRecord.code ||
          subjectId;

        const code =
          catalogSubject?.code ||
          catalogSubject?.subjectCode ||
          firstRecord.subjectCode ||
          firstRecord.code ||
          subjectId;


        return {

          subject,

          code,

          subjectId,

          internal:

            Number(
              internal.toFixed(2)
            ),

          external:

            Number(
              external.toFixed(2)
            ),

          // The HTML displays this value with a percent sign.
          total: percentage,

          grade,

          percentage

        };

      }
    );

  }


  /* ========================================
     Internal Marks
  ======================================== */

  private getInternalMarks(
    record: MarkRecord
  ): number {

    const value =
      record.internal ??
      record.internalMarks ??
      0;


    const number =
      Number(value);


    return isNaN(number)
      ? 0
      : number;

  }


  /* ========================================
     External Marks
  ======================================== */

  private getExternalMarks(
    record: MarkRecord
  ): number {

    const value =
      record.external ??
      record.externalMarks ??
      0;


    const number =
      Number(value);


    return isNaN(number)
      ? 0
      : number;

  }


  /* ========================================
     Total Marks
  ======================================== */

  private getTotalMarks(
    record: MarkRecord
  ): number {

    /*
     * Prefer explicitly stored total.
     */

    if (
      record.total !==
        undefined &&
      record.total !== null
    ) {

      const value =
        Number(
          record.total
        );


      if (
        !isNaN(value)
      ) {

        return value;

      }

    }


    /*
     * marksObtained is your
     * existing backend field.
     */

    if (
      record.marksObtained !==
        undefined &&
      record.marksObtained !== null
    ) {

      const value =
        Number(
          record.marksObtained
        );


      if (
        !isNaN(value)
      ) {

        return value;

      }

    }


    /*
     * Otherwise calculate
     * internal + external.
     */

    return (
      this.getInternalMarks(
        record
      ) +
      this.getExternalMarks(
        record
      )
    );

  }


  /* ========================================
     Grade Calculation
  ======================================== */

  private calculateGrade(
    percentage: number
  ): string {

    if (
      percentage >= 90
    ) {

      return 'A+';

    }


    if (
      percentage >= 80
    ) {

      return 'A';

    }


    if (
      percentage >= 70
    ) {

      return 'B+';

    }


    if (
      percentage >= 60
    ) {

      return 'B';

    }


    if (
      percentage >= 50
    ) {

      return 'C';

    }


    if (
      percentage >= 40
    ) {

      return 'D';

    }


    return 'F';

  }


  /* ========================================
     Grade CSS Class
  ======================================== */

  getGradeClass(
    grade: string
  ): string {

    const normalized =
      String(
        grade || ''
      )
        .trim()
        .toUpperCase();


    if (
      normalized === 'A+' ||
      normalized === 'A'
    ) {

      return 'grade-excellent';

    }


    if (
      normalized === 'B+' ||
      normalized === 'B'
    ) {

      return 'grade-good';

    }


    if (
      normalized === 'C' ||
      normalized === 'D'
    ) {

      return 'grade-average';

    }


    return 'grade-poor';

  }


  /* ========================================
     Display Helpers
  ======================================== */

  get overallPercentageDisplay(): string {

    if (
      this.overallPercentage ===
        null ||
      this.overallPercentage ===
        undefined
    ) {

      return '—';

    }


    return `${this.overallPercentage}%`;

  }


  get highestMarksDisplay(): string {

    if (
      this.highestMarks ===
        null ||
      this.highestMarks ===
        undefined
    ) {

      return '—';

    }


    return `${this.highestMarks}%`;

  }


  get lowestMarksDisplay(): string {

    if (
      this.lowestMarks ===
        null ||
      this.lowestMarks ===
        undefined
    ) {

      return '—';

    }


    return `${this.lowestMarks}%`;

  }


  /* ========================================
     Retry
  ======================================== */

  async retry(): Promise<void> {

    await this.loadMarks();

  }

}