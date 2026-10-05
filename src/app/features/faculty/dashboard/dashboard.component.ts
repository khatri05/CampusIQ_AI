import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  FacultyDashboardService,
  FacultyDashboardResponse,
  FacultySubject
} from '../../../core/services/faculty-dashboard.service';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl:
    './dashboard.component.html',

  styleUrl:
    './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit {


  /*
  ========================================
  LOADING
  ========================================
  */

  isLoading = true;

  errorMessage = '';


  /*
  ========================================
  FACULTY
  ========================================
  */

  faculty = {

    name: '',

    role: 'Faculty',

    initials: ''

  };


  /*
  ========================================
  WELCOME
  ========================================
  */

  welcome = {

    title:
      'Welcome Back',

    subtitle:
      'Your teaching makes a difference.',

    quote: {

      line1:
        'A great teacher turns information',

      line2:
        'into transformation.',

      author:
        '— Unknown'

    },

    date: '',

    message:
      'Have a productive day!'

  };


  /*
  ========================================
  NOTIFICATIONS
  ========================================
  */

  notificationCount = 0;


  /*
  ========================================
  STATISTICS
  ========================================
  */

  statistics = [

    {

      value: '0',

      title:
        'Total Students',

      change:
        '',

      description:
        'Department students',

      icon:
        'bi-people-fill',

      type:
        'purple'

    },

    {

      value:
        '0%',

      title:
        'Average Attendance',

      change:
        '',

      description:
        'Recorded attendance',

      icon:
        'bi-calendar-check-fill',

      type:
        'green'

    },

    {

      value:
        '0',

      title:
        'Active Assignments',

      change:
        '',

      description:
        'Current assignments',

      icon:
        'bi-file-earmark-text-fill',

      type:
        'orange'

    },

    {

      value:
        '0',

      title:
        'Ongoing Projects',

      change:
        '',

      description:
        'Faculty projects',

      icon:
        'bi-folder-fill',

      type:
        'blue'

    }

  ];


  /*
  ========================================
  SCHEDULE
  ========================================
  */

  schedule: any[] = [];


  /*
  ========================================
  ATTENDANCE
  ========================================
  */

  attendance = {

    selectedPeriod:
      'This Week',

    periods: [

      'This Week',

      'Last Week',

      'This Month'

    ],

    data: [

      {
        day: 'Mon',
        percentage: 0
      },

      {
        day: 'Tue',
        percentage: 0
      },

      {
        day: 'Wed',
        percentage: 0
      },

      {
        day: 'Thu',
        percentage: 0
      },

      {
        day: 'Fri',
        percentage: 0
      }

    ]

  };


  /*
  ========================================
  DEADLINES
  ========================================
  */

  deadlines: any[] = [];


  /*
  ========================================
  ACTIVITIES
  ========================================
  */

  activities: any[] = [];


  /*
  ========================================
  PERFORMANCE
  ========================================
  */

  performance = {

    selectedClass:
      'All Classes',

    classes: [
      'All Classes'
    ],

    overallPercentage:
      0,

    categories: [

      {
        label:
          '≥ 90%',

        students:
          0,

        type:
          'green'
      },

      {
        label:
          '75 – 89%',

        students:
          0,

        type:
          'blue'
      },

      {
        label:
          '60 – 74%',

        students:
          0,

        type:
          'yellow'
      },

      {
        label:
          '< 60%',

        students:
          0,

        type:
          'red'
      }

    ]

  };


  /*
  ========================================
  QUICK ACTIONS
  ========================================
  */

  quickActions = [

    {

      title:
        'Take Attendance',

      icon:
        'bi-calendar-check-fill',

      type:
        'green',

      route:
        '/faculty/attendance'

    },

    {

      title:
        'Enter Marks',

      icon:
        'bi-bar-chart-fill',

      type:
        'red',

      route:
        '/faculty/marks'

    },

    {

      title:
        'Create Assignment',

      icon:
        'bi-file-earmark-text-fill',

      type:
        'purple',

      route:
        '/faculty/assignments'

    },

    {

      title:
        'Create Project',

      icon:
        'bi-folder-fill',

      type:
        'orange',

      route:
        '/faculty/projects'

    }

  ];


  /*
  ========================================
  BOTTOM BANNER
  ========================================
  */

  bottomBanner = {

    title:
      'Your Effort Shapes Futures',

    description:
      'Thank you for your dedication and commitment to your students.',

    buttonText:
      'View Student Performance'

  };


  /*
  ========================================
  CONSTRUCTOR
  ========================================
  */

  constructor(

    private facultyDashboardService:
      FacultyDashboardService,

    private router:
      Router

  ) {}


  /*
  ========================================
  ON INIT
  ========================================
  */

  ngOnInit(): void {

    this.loadDashboard();

  }


  /*
  ========================================
  LOAD DASHBOARD
  ========================================
  */

  async loadDashboard(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response:
        FacultyDashboardResponse =
        await this.facultyDashboardService
          .getDashboard();


      this.setDashboardData(
        response
      );

    }

    catch (error: any) {

      console.error(
        'Faculty dashboard error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load faculty dashboard';

    }

    finally {

      this.isLoading = false;

    }

  }


  /*
  ========================================
  SET DASHBOARD DATA
  ========================================
  */

  private setDashboardData(
    response:
      FacultyDashboardResponse
  ): void {


    /*
    ----------------------------------------
    FACULTY
    ----------------------------------------
    */

    const firstName =
      response.faculty?.firstName ||
      '';

    const lastName =
      response.faculty?.lastName ||
      '';

    const fullName =
      `${firstName} ${lastName}`.trim();


    this.faculty = {

      name:
        response.faculty?.name ||
        fullName ||
        'Faculty',

      role:
        response.faculty?.designation ||
        'Faculty',

      initials:
        this.getInitials(
          firstName,
          lastName
        )

    };


    /*
    ----------------------------------------
    DATE
    ----------------------------------------
    */

    this.welcome.date =
      this.formatCurrentDate();


    /*
    ----------------------------------------
    NOTIFICATIONS
    ----------------------------------------
    */

    this.notificationCount =
      response.notificationCount || 0;


    /*
    ----------------------------------------
    STATISTICS
    ----------------------------------------
    */

    const stats =
      response.statistics;


    this.statistics = [

      {

        value:
          String(
            stats?.totalStudents || 0
          ),

        title:
          'Total Students',

        change:
          '',

        description:
          'Department students',

        icon:
          'bi-people-fill',

        type:
          'purple'

      },

      {

        value:
          `${stats?.attendancePercentage || 0}%`,

        title:
          'Average Attendance',

        change:
          '',

        description:
          'Recorded attendance',

        icon:
          'bi-calendar-check-fill',

        type:
          'green'

      },

      {

        value:
          String(
            stats?.activeAssignments || 0
          ),

        title:
          'Active Assignments',

        change:
          '',

        description:
          'Current assignments',

        icon:
          'bi-file-earmark-text-fill',

        type:
          'orange'

      },

      {

        value:
          String(
            stats?.ongoingProjects || 0
          ),

        title:
          'Ongoing Projects',

        change:
          '',

        description:
          'Faculty projects',

        icon:
          'bi-folder-fill',

        type:
          'blue'

      }

    ];


    /*
    ----------------------------------------
    ATTENDANCE
    ----------------------------------------
    */

    this.setAttendance(
      response
    );


    /*
    ----------------------------------------
    DEADLINES
    ----------------------------------------
    */

    this.deadlines =
      (response.deadlines || [])
        .map(
          deadline => {

            const date =
              this.convertDate(
                deadline.dueDate
              );


            return {

              month:
                date
                  ? date
                      .toLocaleDateString(
                        'en-IN',
                        {
                          month:
                            'short'
                        }
                      )
                      .toUpperCase()
                  : '',

              date:
                date
                  ? String(
                      date.getDate()
                    )
                  : '',

              title:
                deadline.title ||
                'Assignment',

              subject:
                deadline.subjectName ||
                deadline.subject ||
                deadline.status ||
                ''

            };

          }
        );


    /*
    ----------------------------------------
    ACTIVITIES
    ----------------------------------------
    */

    this.activities =
      (
        response.recentNotifications ||
        []
      )
        .slice(0, 5)
        .map(
          notification => {

            return {

              icon:
                'bi-bell-fill',

              type:
                notification.isRead
                  ? 'blue'
                  : 'purple',

              text:
                notification.title
                  ? `${notification.title}: ${
                      notification.message || ''
                    }`
                  : (
                      notification.message ||
                      'New notification'
                    ),

              time:
                this.getRelativeTime(
                  notification.createdAt
                )

            };

          }
        );


    /*
    ----------------------------------------
    PERFORMANCE
    ----------------------------------------
    */

    const performance =
      response.performance;


    this.performance.overallPercentage =
      performance?.overallPercentage || 0;


    if (
      performance?.categories &&
      performance.categories.length
    ) {

      this.performance.categories =
        performance.categories;

    }

    else {

      this.performance.categories = [

        {

          label:
            '≥ 90%',

          students:
            performance?.excellent || 0,

          type:
            'green'

        },

        {

          label:
            '75 – 89%',

          students:
            performance?.good || 0,

          type:
            'blue'

        },

        {

          label:
            '60 – 74%',

          students:
            performance?.average || 0,

          type:
            'yellow'

        },

        {

          label:
            '< 60%',

          students:
            performance?.needsImprovement || 0,

          type:
            'red'

        }

      ];

    }


    /*
    ----------------------------------------
    CLASSES / SUBJECTS
    ----------------------------------------
    */

    const subjects:
      FacultySubject[] =
      response.subjects || [];


    this.performance.classes =
      Array.from(

        new Set(

          [

            'All Classes',

            ...subjects
              .map(
                subject =>
                  subject.division ||
                  subject.subjectName ||
                  ''
              )
              .filter(
                value =>
                  !!value
              )

          ]

        )

      );


    if (
      !this.performance.classes.includes(
        this.performance.selectedClass
      )
    ) {

      this.performance.selectedClass =
        'All Classes';

    }


    /*
    ----------------------------------------
    SCHEDULE
    ----------------------------------------
    */

    this.schedule = [];

  }


  /*
  ========================================
  ATTENDANCE
  ========================================
  */

  private setAttendance(
    response:
      FacultyDashboardResponse
  ): void {

    const source =
      response.attendance?.data ||
      response.attendance?.weekly ||
      [];


    this.attendance.data =
      source.map(
        item => {

          if (
            item.percentage !== undefined
          ) {

            return {

              day:
                this.shortDay(
                  item.day
                ),

              percentage:
                Number(
                  item.percentage || 0
                )

            };

          }


          return {

            day:
              this.shortDay(
                item.day
              ),

            percentage:
              this.calculateDailyPercentage(
                item.present || 0,
                item.absent || 0,
                item.late || 0
              )

          };

        }
      );


    if (
      this.attendance.data.length === 0
    ) {

      this.attendance.data = [

        {
          day: 'Mon',
          percentage: 0
        },

        {
          day: 'Tue',
          percentage: 0
        },

        {
          day: 'Wed',
          percentage: 0
        },

        {
          day: 'Thu',
          percentage: 0
        },

        {
          day: 'Fri',
          percentage: 0
        }

      ];

    }

  }


  /*
  ========================================
  SHORT DAY
  ========================================
  */

  private shortDay(
    day: string
  ): string {

    const value =
      String(
        day || ''
      ).trim();


    const map: {
      [key: string]: string
    } = {

      Sunday:
        'Sun',

      Monday:
        'Mon',

      Tuesday:
        'Tue',

      Wednesday:
        'Wed',

      Thursday:
        'Thu',

      Friday:
        'Fri',

      Saturday:
        'Sat'

    };


    return (
      map[value] ||
      value.substring(
        0,
        3
      )
    );

  }


  /*
  ========================================
  DAILY ATTENDANCE
  ========================================
  */

  private calculateDailyPercentage(
    present: number,
    absent: number,
    late: number
  ): number {

    const total =
      Number(present || 0) +
      Number(absent || 0) +
      Number(late || 0);


    if (
      total === 0
    ) {

      return 0;

    }


    return Math.round(

      (
        (
          Number(present || 0) +
          Number(late || 0)
        )
        /
        total
      )
      *
      100

    );

  }


  /*
  ========================================
  QUICK ACTION NAVIGATION
  ========================================
  */

  openQuickAction(
    route: string
  ): void {

    this.router.navigate([
      route
    ]);

  }


  /*
  ========================================
  VIEW STUDENT PERFORMANCE
  ========================================
  */

  viewStudentPerformance(): void {

    this.router.navigate([
      '/faculty/student-performance'
    ]);

  }


  /*
  ========================================
  INITIALS
  ========================================
  */

  private getInitials(
    firstName: string,
    lastName: string
  ): string {

    const first =
      firstName
        ?.trim()
        ?.charAt(0) ||
      '';

    const last =
      lastName
        ?.trim()
        ?.charAt(0) ||
      '';


    return (
      `${first}${last}`.toUpperCase()
      ||
      'F'
    );

  }


  /*
  ========================================
  CURRENT DATE
  ========================================
  */

  private formatCurrentDate(): string {

    return new Intl.DateTimeFormat(
      'en-IN',
      {

        weekday:
          'long',

        day:
          'numeric',

        month:
          'short',

        year:
          'numeric'

      }
    ).format(
      new Date()
    );

  }


  /*
  ========================================
  DATE CONVERTER
  ========================================
  */

  private convertDate(
    value: any
  ): Date | null {

    if (!value) {

      return null;

    }


    if (
      typeof value.toDate ===
      'function'
    ) {

      return value.toDate();

    }


    if (
      value._seconds !==
      undefined
    ) {

      return new Date(
        value._seconds *
        1000
      );

    }


    const date =
      new Date(value);


    return isNaN(
      date.getTime()
    )
      ? null
      : date;

  }


  /*
  ========================================
  RELATIVE TIME
  ========================================
  */

  private getRelativeTime(
    value: any
  ): string {

    const date =
      this.convertDate(
        value
      );


    if (!date) {

      return '';

    }


    const difference =
      new Date().getTime() -
      date.getTime();


    const seconds =
      Math.floor(
        difference /
        1000
      );


    if (
      seconds < 60
    ) {

      return 'Just now';

    }


    const minutes =
      Math.floor(
        seconds /
        60
      );


    if (
      minutes < 60
    ) {

      return `${minutes} ${
        minutes === 1
          ? 'minute'
          : 'minutes'
      } ago`;

    }


    const hours =
      Math.floor(
        minutes /
        60
      );


    if (
      hours < 24
    ) {

      return `${hours} ${
        hours === 1
          ? 'hour'
          : 'hours'
      } ago`;

    }


    const days =
      Math.floor(
        hours /
        24
      );


    if (
      days < 7
    ) {

      return `${days} ${
        days === 1
          ? 'day'
          : 'days'
      } ago`;

    }


    return date.toLocaleDateString(
      'en-IN',
      {

        day:
          'numeric',

        month:
          'short',

        year:
          'numeric'

      }
    );

  }

}