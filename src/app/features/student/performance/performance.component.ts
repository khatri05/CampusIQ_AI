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

  subjectName?: string;

  subject?: string;

  subjectCode?: string;

  code?: string;

  marksObtained?: number | null;

  maximumMarks?: number | null;

  marks?: number | null;

  percentage?: number | null;

  grade?: string;

  gradePoint?: number | null;

  semester?: number | string | null;

  semesterName?: string;

  createdAt?: any;

  updatedAt?: any;

}


interface AcademicPerformance {

  totalExams: number;

  averagePercentage: number | null;

  highestPercentage: number | null;

  lowestPercentage: number | null;

  gradeDistribution: {
    [key: string]: number;
  };

}


interface AttendancePerformance {

  totalRecords: number;

  present: number;

  absent: number;

  late: number;

  attendancePercentage: number | null;

}


interface OverallPerformance {

  overallScore: number | null;

  performanceLevel: string;

}


interface SemesterPerformance {

  semester: string;

  sgpa: number;

  percentage: number;

}


interface SubjectPerformance {

  subject: string;

  code: string;

  marks: number;

  grade: string;

}


/* ========================================
   Component
======================================== */

@Component({

  selector: 'app-performance',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './performance.component.html',

  styleUrl: './performance.component.css'

})


export class PerformanceComponent
  implements OnInit {


  /* ========================================
     Loading / Error
  ======================================== */

  loading = true;

  errorMessage = '';


  /* ========================================
     Main Performance Values
  ======================================== */

  cgpa: number | null = null;

  percentage: number | null = null;

  academicScore: number | null = null;

  attendanceScore: number | null = null;

  assignmentScore: number | null = null;

  skillScore: number | null = null;


  /* ========================================
     Backend Performance Data
  ======================================== */

  academicPerformance:
    AcademicPerformance = {

      totalExams: 0,

      averagePercentage: null,

      highestPercentage: null,

      lowestPercentage: null,

      gradeDistribution: {}

    };


  attendancePerformance:
    AttendancePerformance = {

      totalRecords: 0,

      present: 0,

      absent: 0,

      late: 0,

      attendancePercentage: null

    };


  overallPerformance:
    OverallPerformance = {

      overallScore: null,

      performanceLevel: 'No Data'

    };


  /* ========================================
     Student Data
  ======================================== */

  marks: MarkRecord[] = [];

  skills: any[] = [];

  assignments: any[] = [];


  /* ========================================
     Semester / Subject
  ======================================== */

  semesters:
    SemesterPerformance[] = [];

  subjects:
    SubjectPerformance[] = [];


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

    await this.loadPerformance();

  }


  /* ========================================
     Load Performance
  ======================================== */

  async loadPerformance(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';


      /* ------------------------------------
         Performance Analysis API
      ------------------------------------ */

      const performanceResponse =
        await this.apiService.get<any>(
          '/performance-analysis/me'
        );


      /* ------------------------------------
         Student Dashboard API

         Used for:
         - Marks
         - Skills
         - Assignments
      ------------------------------------ */

      const dashboardResponse =
        await this.apiService.get<any>(
          '/student-dashboard/me'
        );


      console.log(
        'Performance response:',
        performanceResponse
      );


      console.log(
        'Dashboard response:',
        dashboardResponse
      );


      /* ------------------------------------
         Performance Data
      ------------------------------------ */

      if (
        performanceResponse?.data
      ) {

        const data =
          performanceResponse.data;


        if (
          data.academicPerformance
        ) {

          this.academicPerformance =
            data.academicPerformance;

        }


        if (
          data.attendancePerformance
        ) {

          this.attendancePerformance =
            data.attendancePerformance;

        }


        if (
          data.overallPerformance
        ) {

          this.overallPerformance =
            data.overallPerformance;

        }

      }


      /* ------------------------------------
         Dashboard Data
      ------------------------------------ */

      if (
        dashboardResponse?.data
      ) {

        const data =
          dashboardResponse.data;


        this.marks =
          Array.isArray(data.marks)
            ? data.marks
            : [];


        this.skills =
          Array.isArray(data.skills)
            ? data.skills
            : [];


        this.assignments =
          Array.isArray(data.assignments)
            ? data.assignments
            : [];

      }


      /* ------------------------------------
         Calculate Values
      ------------------------------------ */

      this.calculateAcademicValues();

      this.calculateAttendance();

      this.calculateAssignmentScore();

      this.calculateSkillScore();

      this.buildSemesterPerformance();

      this.buildSubjectPerformance();

    }

    catch (error: any) {

      console.error(
        'Performance loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load performance data.';

    }

    finally {

      this.loading = false;

    }

  }


  /* ========================================
     Academic Values
  ======================================== */

  private calculateAcademicValues(): void {

    const percentages: number[] =

      this.marks

        .map(
          mark =>
            this.getMarkPercentage(mark)
        )

        .filter(
          (value): value is number =>
            value !== null &&
            value !== undefined &&
            !isNaN(value)
        );


    /* ------------------------------------
       No Academic Records
    ------------------------------------ */

    if (
      percentages.length === 0
    ) {

      this.cgpa = null;

      this.percentage = null;

      this.academicScore = null;

      return;

    }


    /* ------------------------------------
       Average Percentage
    ------------------------------------ */

    const total =
      percentages.reduce(
        (
          sum: number,
          value: number
        ) =>
          sum + value,

        0
      );


    const average =
      total /
      percentages.length;


    this.percentage =
      Number(
        average.toFixed(2)
      );


    this.academicScore =
      Number(
        average.toFixed(2)
      );


    /* ------------------------------------
       CGPA
    ------------------------------------ */

    const gradePoints: number[] =

      this.marks

        .map(
          mark =>
            mark.gradePoint
        )

        .filter(
          (value): value is number =>
            value !== null &&
            value !== undefined &&
            !isNaN(Number(value))
        )

        .map(
          value =>
            Number(value)
        );


    /* ------------------------------------
       Calculate From Grade Points
    ------------------------------------ */

    if (
      gradePoints.length > 0
    ) {

      const totalGradePoints =
        gradePoints.reduce(
          (
            sum: number,
            value: number
          ) =>
            sum + value,

          0
        );


      this.cgpa =
        Number(
          (
            totalGradePoints /
            gradePoints.length
          ).toFixed(2)
        );

    }

    else {

      /* --------------------------------
         Fallback CGPA
      -------------------------------- */

      this.cgpa =
        Number(
          (
            average / 10
          ).toFixed(2)
        );

    }

  }


  /* ========================================
     Attendance
  ======================================== */

  private calculateAttendance(): void {

    const value =
      this.attendancePerformance
        .attendancePercentage;


    if (
      value === null ||
      value === undefined ||
      isNaN(Number(value))
    ) {

      this.attendanceScore = null;

      return;

    }


    this.attendanceScore =
      Number(value);

  }


  /* ========================================
     Assignment Score
  ======================================== */

  private calculateAssignmentScore(): void {

    if (
      this.assignments.length === 0
    ) {

      this.assignmentScore = null;

      return;

    }


    const percentages: number[] =

      this.assignments

        .map(
          assignment => {

            /* -----------------------------
               Direct Percentage
            ----------------------------- */

            if (
              assignment.percentage !==
                undefined &&
              assignment.percentage !==
                null
            ) {

              const value =
                Number(
                  assignment.percentage
                );


              return isNaN(value)
                ? null
                : value;

            }


            /* -----------------------------
               Score / Total Marks
            ----------------------------- */

            if (
              assignment.score !==
                undefined &&

              assignment.score !==
                null &&

              assignment.totalMarks !==
                undefined &&

              assignment.totalMarks !==
                null
            ) {

              const totalMarks =
                Number(
                  assignment.totalMarks
                );


              if (
                totalMarks <= 0 ||
                isNaN(totalMarks)
              ) {

                return null;

              }


              const score =
                Number(
                  assignment.score
                );


              if (
                isNaN(score)
              ) {

                return null;

              }


              return (
                score /
                totalMarks
              ) * 100;

            }


            return null;

          }
        )

        .filter(
          (value): value is number =>
            value !== null &&
            value !== undefined &&
            !isNaN(value)
        );


    /* ------------------------------------
       No Valid Assignment Data
    ------------------------------------ */

    if (
      percentages.length === 0
    ) {

      this.assignmentScore = null;

      return;

    }


    /* ------------------------------------
       Average Assignment Score
    ------------------------------------ */

    const total =
      percentages.reduce(
        (
          sum: number,
          value: number
        ) =>
          sum + value,

        0
      );


    const average =
      total /
      percentages.length;


    this.assignmentScore =
      Number(
        average.toFixed(2)
      );

  }


  /* ========================================
     Skill Score
  ======================================== */

  private calculateSkillScore(): void {

    if (
      this.skills.length === 0
    ) {

      this.skillScore = null;

      return;

    }


    const levelScores: {
      [key: string]: number;
    } = {

      beginner: 25,

      intermediate: 50,

      advanced: 75,

      expert: 100

    };


    const scores: number[] =

      this.skills

        .map(
          skill => {

            const level =
              String(
                skill.level || ''
              )
                .toLowerCase()
                .trim();


            return (
              levelScores[level] ??
              null
            );

          }
        )

        .filter(
          (value): value is number =>
            value !== null &&
            value !== undefined
        );


    if (
      scores.length === 0
    ) {

      this.skillScore = null;

      return;

    }


    const total =
      scores.reduce(
        (
          sum: number,
          value: number
        ) =>
          sum + value,

        0
      );


    const average =
      total /
      scores.length;


    this.skillScore =
      Number(
        average.toFixed(2)
      );

  }


  /* ========================================
     Semester Performance
  ======================================== */

  private buildSemesterPerformance(): void {

    const semesterMap =
      new Map<
        string,
        MarkRecord[]
      >();


    /* ------------------------------------
       Group Marks By Semester
    ------------------------------------ */

    this.marks.forEach(
      mark => {

        if (
          mark.semester ===
            undefined ||

          mark.semester ===
            null ||

          mark.semester === ''
        ) {

          return;

        }


        const semester =
          `Semester ${mark.semester}`;


        if (
          !semesterMap.has(
            semester
          )
        ) {

          semesterMap.set(
            semester,
            []
          );

        }


        semesterMap
          .get(semester)!
          .push(mark);

      }
    );


    /* ------------------------------------
       Calculate Semester Results
    ------------------------------------ */

    this.semesters =

      Array.from(
        semesterMap.entries()
      )

        .map(
          (
            [
              semester,
              records
            ]
          ): SemesterPerformance | null => {

            const values: number[] =

              records

                .map(
                  record =>
                    this.getMarkPercentage(
                      record
                    )
                )

                .filter(
                  (value): value is number =>
                    value !== null &&
                    value !== undefined &&
                    !isNaN(value)
                );


            if (
              values.length === 0
            ) {

              return null;

            }


            const total =
              values.reduce(
                (
                  sum: number,
                  value: number
                ) =>
                  sum + value,

                0
              );


            const average =
              total /
              values.length;


            const sgpa =
              Number(
                (
                  average / 10
                ).toFixed(2)
              );


            return {

              semester,

              sgpa,

              percentage:
                Number(
                  average.toFixed(2)
                )

            };

          }
        )

        .filter(
          (
            semester
          ): semester is SemesterPerformance =>
            semester !== null
        );


    /* ------------------------------------
       Sort Semesters
    ------------------------------------ */

    this.semesters.sort(
      (
        first,
        second
      ) => {

        const firstNumber =
          Number(
            first.semester
              .replace(
                'Semester ',
                ''
              )
          );


        const secondNumber =
          Number(
            second.semester
              .replace(
                'Semester ',
                ''
              )
          );


        return (
          firstNumber -
          secondNumber
        );

      }
    );

  }


  /* ========================================
     Subject Performance
  ======================================== */

  private buildSubjectPerformance(): void {

    this.subjects =

      this.marks.map(
        mark => {

          const percentage =
            this.getMarkPercentage(
              mark
            );


          return {

            subject:
              mark.subjectName ||
              mark.subject ||
              'Subject',


            code:
              mark.subjectCode ||
              mark.code ||
              'SUB',


            marks:
              percentage === null
                ? 0
                : Number(
                    percentage.toFixed(2)
                  ),


            grade:
              mark.grade ||
              this.calculateGrade(
                percentage
              )

          };

        }
      );

  }


  /* ========================================
     Get Percentage From Mark
  ======================================== */

  private getMarkPercentage(
    mark: MarkRecord
  ): number | null {


    /* ------------------------------------
       Existing Percentage
    ------------------------------------ */

    if (
      mark.percentage !==
        undefined &&

      mark.percentage !==
        null
    ) {

      const value =
        Number(
          mark.percentage
        );


      if (
        !isNaN(value)
      ) {

        return value;

      }

    }


    /* ------------------------------------
       Existing Marks
    ------------------------------------ */

    if (
      mark.marks !==
        undefined &&

      mark.marks !==
        null
    ) {

      const value =
        Number(
          mark.marks
        );


      if (
        !isNaN(value)
      ) {

        return value;

      }

    }


    /* ------------------------------------
       Obtained / Maximum Marks
    ------------------------------------ */

    if (
      mark.marksObtained !==
        undefined &&

      mark.marksObtained !==
        null &&

      mark.maximumMarks !==
        undefined &&

      mark.maximumMarks !==
        null
    ) {

      const obtained =
        Number(
          mark.marksObtained
        );


      const maximum =
        Number(
          mark.maximumMarks
        );


      if (
        isNaN(obtained) ||
        isNaN(maximum) ||
        maximum <= 0
      ) {

        return null;

      }


      return (
        obtained /
        maximum
      ) * 100;

    }


    return null;

  }


  /* ========================================
     Grade Calculation
  ======================================== */

  private calculateGrade(
    percentage: number | null
  ): string {

    if (
      percentage === null ||
      percentage === undefined
    ) {

      return '—';

    }


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


  /* ========================================
     Display Values
  ======================================== */

  get cgpaDisplay(): string {

    if (
      this.cgpa === null ||
      this.cgpa === undefined
    ) {

      return '—';

    }


    return this.cgpa.toFixed(2);

  }


  get percentageDisplay(): string {

    if (
      this.percentage === null ||
      this.percentage === undefined
    ) {

      return '—';

    }


    return `${this.percentage.toFixed(2)}%`;

  }


  get academicScoreDisplay(): string {

    if (
      this.academicScore === null ||
      this.academicScore === undefined
    ) {

      return '—';

    }


    return `${this.academicScore.toFixed(2)}%`;

  }


  get attendanceScoreDisplay(): string {

    if (
      this.attendanceScore === null ||
      this.attendanceScore === undefined
    ) {

      return '—';

    }


    return `${this.attendanceScore.toFixed(2)}%`;

  }


  get assignmentScoreDisplay(): string {

    if (
      this.assignmentScore === null ||
      this.assignmentScore === undefined
    ) {

      return '—';

    }


    return `${this.assignmentScore.toFixed(2)}%`;

  }


  get skillScoreDisplay(): string {

    if (
      this.skillScore === null ||
      this.skillScore === undefined
    ) {

      return '—';

    }


    return `${this.skillScore.toFixed(2)}%`;

  }


  /* ========================================
     Performance Class
  ======================================== */

  getPerformanceClass(
    value: number | null
  ): string {

    if (
      value === null ||
      value === undefined
    ) {

      return 'poor';

    }


    if (
      value >= 85
    ) {

      return 'excellent';

    }


    if (
      value >= 75
    ) {

      return 'good';

    }


    if (
      value >= 60
    ) {

      return 'average';

    }


    return 'poor';

  }


  /* ========================================
     Performance Status
  ======================================== */

  get performanceStatus(): string {

    if (
      this.percentage === null ||
      this.percentage === undefined
    ) {

      return 'No Data';

    }


    if (
      this.percentage >= 85
    ) {

      return 'Excellent';

    }


    if (
      this.percentage >= 75
    ) {

      return 'Good';

    }


    if (
      this.percentage >= 60
    ) {

      return 'Average';

    }


    return 'Needs Improvement';

  }


  /* ========================================
     Performance Description
  ======================================== */

  get performanceDescription(): string {

    if (
      this.percentage === null ||
      this.percentage === undefined
    ) {

      return (
        'Academic performance will appear here once marks are available.'
      );

    }


    if (
      this.percentage >= 85
    ) {

      return (
        'Your academic performance is excellent. Keep maintaining your current progress.'
      );

    }


    if (
      this.percentage >= 75
    ) {

      return (
        'Your academic performance is good. Continue working consistently.'
      );

    }


    if (
      this.percentage >= 60
    ) {

      return (
        'Your performance is average. Focus on improving weaker subjects.'
      );

    }


    return (
      'Your performance needs improvement. Consider focusing more on your academics.'
    );

  }


  /* ========================================
     Dynamic Score Circle
  ======================================== */

  get scoreCircleBackground(): string {

    const value =
      this.percentage === null ||
      this.percentage === undefined
        ? 0
        : Math.min(
            Math.max(
              this.percentage,
              0
            ),
            100
          );


    return `
      conic-gradient(
        #2563eb 0% ${value}%,
        #e5e7eb ${value}% 100%
      )
    `;

  }


  /* ========================================
     Data Availability
  ======================================== */

  get hasAcademicData(): boolean {

    return (
      this.marks.length > 0
    );

  }


  get hasSemesterData(): boolean {

    return (
      this.semesters.length > 0
    );

  }


  get hasSubjectData(): boolean {

    return (
      this.subjects.length > 0
    );

  }

}