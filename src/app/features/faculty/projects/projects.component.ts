import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  FacultyProjectsService,
  FacultyProject
} from '../../../core/services/faculty-projects.service';


@Component({
  selector: 'app-projects',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './projects.component.html',

  styleUrl: './projects.component.css'
})
export class ProjectsComponent
  implements OnInit {


  /* ========================================
     DATA
  ======================================== */

  projects: FacultyProject[] = [];

  filteredProjects:
    FacultyProject[] = [];


  /* ========================================
     FILTERS
  ======================================== */

  searchText = '';

  selectedSemester = 'All';

  selectedDivision = 'All';

  selectedStatus = 'All';


  semesters: string[] = [];

  divisions: string[] = [];


  /* ========================================
     STATISTICS
  ======================================== */

  totalProjects = 0;

  ongoingProjects = 0;

  completedProjects = 0;

  pendingProjects = 0;


  /* ========================================
     UI
  ======================================== */

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  /* ========================================
     PROJECT DETAILS
  ======================================== */

  selectedProject:
    FacultyProject | null = null;

  showDetails = false;


  constructor(
    private facultyProjectsService:
      FacultyProjectsService
  ) {}


  /* ========================================
     INIT
  ======================================== */

  ngOnInit(): void {

    this.loadProjects();

  }


  /* ========================================
     LOAD PROJECTS
  ======================================== */

  async loadProjects(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.facultyProjectsService
          .getProjects();

      console.log(
        'Faculty projects response:',
        response
      );


      this.projects =
        response?.data?.projects || [];


      this.filteredProjects =
        [...this.projects];


      this.buildFilters();

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Failed to load projects:',
        error
      );


      this.projects = [];

      this.filteredProjects = [];


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load projects.';

    } finally {

      this.isLoading = false;

    }

  }


  /* ========================================
     BUILD FILTERS
  ======================================== */

  buildFilters(): void {

    this.semesters =
      Array.from(
        new Set(
          this.projects
            .map(
              project =>
                project.semester
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
          this.projects
            .map(
              project =>
                project.division
            )
            .filter(
              (
                division
              ): division is string =>
                typeof division === 'string' &&
                division.trim().length > 0
            )
            .map(
              (division: string) =>
                division.trim()
            )
        )
      ).sort();

  }


  /* ========================================
     FILTER PROJECTS
  ======================================== */

  filterProjects(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredProjects =
      this.projects.filter(
        project => {

          const projectName =
            project.title ||
            project.name ||
            '';


          const matchesSearch =
            !search ||

            projectName
              .toLowerCase()
              .includes(search) ||

            project.description
              ?.toLowerCase()
              .includes(search) ||

            project.studentName
              ?.toLowerCase()
              .includes(search) ||

            project.enrollmentNo
              ?.toLowerCase()
              .includes(search);


          const matchesSemester =
            this.selectedSemester === 'All' ||
            String(
              project.semester
            ) === this.selectedSemester;


          const matchesDivision =
            this.selectedDivision === 'All' ||
            project.division ===
              this.selectedDivision;


          const matchesStatus =
            this.selectedStatus === 'All' ||
            this.getProjectStatus(
              project
            ) === this.selectedStatus;


          return (
            matchesSearch &&
            matchesSemester &&
            matchesDivision &&
            matchesStatus
          );

        }
      );

  }


  /* ========================================
     STATISTICS
  ======================================== */

  calculateStatistics(): void {

    this.totalProjects =
      this.projects.length;


    this.ongoingProjects =
      this.projects.filter(
        project =>
          this.getProjectStatus(
            project
          ) === 'Ongoing'
      ).length;


    this.completedProjects =
      this.projects.filter(
        project =>
          this.getProjectStatus(
            project
          ) === 'Completed'
      ).length;


    this.pendingProjects =
      this.projects.filter(
        project =>
          this.getProjectStatus(
            project
          ) === 'Pending'
      ).length;

  }


  /* ========================================
     PROJECT STATUS
  ======================================== */

  getProjectStatus(
    project: FacultyProject
  ): string {

    const status =
      String(
        project.status || ''
      ).toLowerCase();


    if (
      status === 'completed'
    ) {

      return 'Completed';

    }


    if (
      status === 'ongoing' ||
      status === 'in progress'
    ) {

      return 'Ongoing';

    }


    if (
      status === 'pending'
    ) {

      return 'Pending';

    }


    if (
      project.endDate
    ) {

      const endDate =
        new Date(
          project.endDate
        );


      const today =
        new Date();


      today.setHours(
        0,
        0,
        0,
        0
      );


      endDate.setHours(
        0,
        0,
        0,
        0
      );


      if (
        endDate < today
      ) {

        return 'Completed';

      }

    }


    return 'Ongoing';

  }


  /* ========================================
     VIEW DETAILS
  ======================================== */

  viewProject(
    project: FacultyProject
  ): void {

    this.selectedProject =
      project;

    this.showDetails = true;

  }


  /* ========================================
     CLOSE DETAILS
  ======================================== */

  closeDetails(): void {

    this.showDetails = false;

    this.selectedProject = null;

  }


  /* ========================================
     TECHNOLOGIES
  ======================================== */

  getTechnologies(
    project: FacultyProject
  ): string[] {

    if (
      Array.isArray(
        project.technologies
      )
    ) {

      return project.technologies;

    }


    if (
      project.technology
    ) {

      return project.technology
        .split(',')
        .map(
          technology =>
            technology.trim()
        )
        .filter(
          technology =>
            technology.length > 0
        );

    }


    return [];

  }


  /* ========================================
     DATE FORMAT
  ======================================== */

  formatDate(
    date: any
  ): string {

    if (!date) {

      return '-';

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return '-';

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


  /* ========================================
     CLEAR FILTERS
  ======================================== */

  clearFilters(): void {

    this.searchText = '';

    this.selectedSemester = 'All';

    this.selectedDivision = 'All';

    this.selectedStatus = 'All';

    this.filterProjects();

  }


  /* ========================================
     CLEAR MESSAGES
  ======================================== */

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

  }

}