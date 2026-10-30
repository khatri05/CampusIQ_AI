import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { FacultyDashboardComponent } from './layouts/faculty-dashboard/faculty-dashboard.component';
import { PlacementOfficerDashboardComponent } from './layouts/placement-officer-dashboard/placement-officer-dashboard.component';
import { AdminDashboardComponent } from './layouts/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [

  // ==============================
  // Authentication
  // ==============================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/authentication/login/login.component')
        .then(m => m.LoginComponent)
  },

  // Registration
  {
    path: 'register',
    loadComponent: () =>
      import(
        './features/authentication/registration/registration.component'
      ).then(
        m => m.RegisterComponent
      )
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/authentication/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/authentication/unauthorized/unauthorized.component')
        .then(m => m.UnauthorizedComponent)
  },

  // ==============================
  // Default Route
  // ==============================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'student',

    component: StudentLayoutComponent,

    canActivate: [
      authGuard
    ],

    children: [

      {
        path: 'dashboard',

        canActivate: [
          roleGuard
        ],

        data: {
          roles: [
            'student'
          ]
        },

        loadComponent: () =>
          import(
            './features/student/dashboard/dashboard.component'
          ).then(
            m => m.DashboardComponent
          )
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'performance',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/performance/performance.component')
            .then(m => m.PerformanceComponent)
      },
      {
        path: 'attendance',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/attendance/attendance.component')
            .then(m => m.AttendanceComponent)
      },
      {
        path: 'marks',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/marks/marks.component')
            .then(m => m.MarksComponent)
      },
      {
        path: 'assignments',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/assignments/assignments.component')
            .then(m => m.AssignmentsComponent)
      },
      {
        path: 'skills',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/skills/skills.component')
            .then(m => m.SkillsComponent)
      },
      {
        path: 'certifications',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadComponent: () =>
          import('./features/student/certifications/certifications.component')
            .then(m => m.CertificationsComponent)
      },
      {
        path: 'projects',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadComponent: () =>
          import('./features/student/projects/projects.component')
            .then(m => m.ProjectsComponent)
      },
      {
        path: 'digital-twin',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/digital-twin/digital-twin.component')
            .then(m => m.DigitalTwinComponent)
      },
      {
        path: 'performance-analysis',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import('./features/student/performance-analysis/performance-analysis.component')
            .then(m => m.PerformanceAnalysisComponent)
      },
      {
        path: 'skill-gap-analysis',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import(
            './features/student/skill-gap-analysis/skill-gap-analysis.component'
          ).then(
            m => m.SkillGapAnalysisComponent
          )
      },
      {
        path: 'ai-recommendations',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import(
            './features/student/ai-recommendations/ai-recommendations.component'
          ).then(
            m => m.AiRecommendationsComponent
          )
      },
      {
        path: 'placement-readiness',
        canActivate: [roleGuard],
        data: {
          roles: ['student']
        },
        loadComponent: () =>
          import(
            './features/student/placement-readiness/placement-readiness.component'
          ).then(
            m => m.PlacementReadinessComponent
          )
      },
      {
        path: 'job-opportunities',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadComponent: () =>
          import('./features/student/job-opportunities/job-opportunities.component')
            .then(m => m.JobOpportunitiesComponent)
      },
      {
        path: 'job-applications',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadComponent: () =>
          import('./features/student/job-applications/job-applications.component')
            .then(m => m.JobApplicationsComponent)
      }

    ]
  },


  // =====================================================
  // FACULTY ROUTES
  // =====================================================

  {
    path: 'faculty',

    component: FacultyDashboardComponent,

    canActivate: [
      authGuard
    ],

    children: [

      {
        path: 'dashboard',

        canActivate: [
          roleGuard
        ],

        data: {
          roles: [
            'faculty'
          ]
        },

        loadComponent: () =>
          import(
            './features/faculty/dashboard/dashboard.component'
          ).then(
            m => m.DashboardComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/faculty/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/faculty/students/students.component')
            .then(m => m.StudentsComponent)
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/faculty/attendance/attendance.component')
            .then(m => m.AttendanceComponent)
      },
      {
        path: 'marks',
        loadComponent: () =>
          import('./features/faculty/marks/marks.component')
            .then(m => m.MarksComponent)
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('./features/faculty/assignments/assignments.component')
            .then(m => m.AssignmentsComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/faculty/projects/projects.component')
            .then(m => m.ProjectsComponent)
      },
      {
        path: 'student-performance',
        loadComponent: () =>
          import('./features/faculty/student-performance/student-performance.component')
            .then(m => m.StudentPerformanceComponent)
      }
    ]
  },


  // =====================================================
  // PLACEMENT OFFICER ROUTES
  // =====================================================

  {
    path: 'placement-officer',

    component: PlacementOfficerDashboardComponent,

    canActivate: [
      authGuard
    ],

    children: [

      {
        path: 'dashboard',

        canActivate: [
          roleGuard
        ],

        data: {
          roles: [
            'placement_officer'
          ]
        },

        loadComponent: () =>
          import(
            './features/placement-officer/dashboard/dashboard.component'
          ).then(
            m => m.DashboardComponent
          )
      },

      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/placement-officer/profile/profile.component'
          ).then(
            m => m.ProfileComponent
          )
      },

      {
        path: 'students',
        loadComponent: () =>
          import(
            './features/placement-officer/students/students.component'
          ).then(
            m => m.StudentsComponent
          )
      },

      {
        path: 'job-opportunities',
        loadComponent: () =>
          import(
            './features/placement-officer/job-opportunities/job-opportunities.component'
          ).then(
            m => m.JobOpportunitiesComponent
          )
      },

      {
        path: 'applications',

        loadComponent: () =>
          import(
            './features/placement-officer/applications/applications.component'
          ).then(
            m => m.ApplicationsComponent
          )
      },

      {
        path: 'placements',

        loadComponent: () =>
          import(
            './features/placement-officer/placements/placements.component'
          ).then(
            m => m.PlacementsComponent
          )
      },

      {
        path: 'notifications',

        loadComponent: () =>
          import(
            './features/placement-officer/notifications/notifications.component'
          ).then(
            m => m.NotificationsComponent
          )
      }

    ]
  },

  // =====================================================
  // ADMIN ROUTES
  // =====================================================

  {
    path: 'admin',

    component: AdminDashboardComponent,

    canActivate: [
      authGuard
    ],

    children: [

      {
        path: 'dashboard',

        canActivate: [
          roleGuard
        ],

        data: {
          roles: [
            'admin'
          ]
        },

        loadComponent: () =>
          import(
            './features/admin/dashboard/dashboard.component'
          ).then(
            m => m.DashboardComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/admin/profile/profile.component'
          ).then(
            m => m.ProfileComponent
          )
      },

      {
        path: 'students',
        loadComponent: () =>
          import(
            './features/admin/students/students.component'
          ).then(
            m => m.StudentsComponent
          )
      },

      {
        path: 'faculty',
        loadComponent: () =>
          import(
            './features/admin/faculty/faculty.component'
          ).then(
            m => m.FacultyComponent
          )
      },

      {
        path: 'departments',
        loadComponent: () =>
          import(
            './features/admin/departments/departments.component'
          ).then(
            m => m.DepartmentsComponent
          )
      },

      {
        path: 'job-opportunities',
        loadComponent: () =>
          import(
            './features/admin/job-opportunities/job-opportunities.component'
          ).then(
            m => m.JobOpportunitiesComponent
          )
      },

      {
        path: 'applications',
        loadComponent: () =>
          import(
            './features/admin/applications/applications.component'
          ).then(
            m => m.ApplicationsComponent
          )
      },

      {
        path: 'placements',
        loadComponent: () =>
          import(
            './features/admin/placements/placements.component'
          ).then(
            m => m.PlacementsComponent
          )
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './features/admin/notifications/notifications.component'
          ).then(
            m => m.NotificationsComponent
          )
      }

    ]
  },

  // ==============================
  // Wildcard Route
  // ==============================

  {
    path: '**',
    redirectTo: 'login'
  }
];