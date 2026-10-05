import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  FacultyAssignmentsService,
  FacultyAssignment,
  FacultySubject
} from '../../../core/services/faculty-assignments.service';


@Component({
  selector: 'app-assignments',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './assignments.component.html',

  styleUrl: './assignments.component.css'
})
export class AssignmentsComponent
  implements OnInit {


  /* ========================================
     DATA
  ======================================== */

  assignments: FacultyAssignment[] = [];

  filteredAssignments:
    FacultyAssignment[] = [];

  subjects: FacultySubject[] = [];

  /* ========================================
     FORM
  ======================================== */

  showForm = false;

  isEditing = false;

  editingAssignmentId = '';


  assignmentForm: FacultyAssignment = {

    title: '',

    description: '',

    subjectId: '',

    semester: undefined,

    division: '',

    startDate: '',

    dueDate: '',

    maxMarks: 100,

    status: 'active'

  };


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

  totalAssignments = 0;

  activeAssignments = 0;

  completedAssignments = 0;

  pendingAssignments = 0;


  /* ========================================
     UI STATES
  ======================================== */

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  /* ========================================
     SUBMISSIONS MODAL
  ======================================== */

  showSubmissions = false;

  selectedAssignment:
    FacultyAssignment | null = null;

  submissions: any[] = [];

  filteredSubmissions: any[] = [];

  submissionSearchText = '';

  totalSubmissions = 0;

  submittedSubmissions = 0;

  pendingSubmissions = 0;

  isLoadingSubmissions = false;


  constructor(
    private facultyAssignmentsService:
      FacultyAssignmentsService
  ) { }


  /* ========================================
     INIT
  ======================================== */

  ngOnInit(): void {

    this.loadAssignments();

    this.loadSubjects();

  }


  /* ========================================
     LOAD ASSIGNMENTS
  ======================================== */

  async loadAssignments(): Promise<void> {

    this.isLoading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.facultyAssignmentsService
          .getAssignments();

      console.log(
        'Faculty assignments response:',
        response
      );

      this.assignments =
        response?.data?.assignments || [];

      this.filteredAssignments =
        [...this.assignments];

      this.buildFilters();

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Failed to load assignments:',
        error
      );

      this.assignments = [];

      this.filteredAssignments = [];

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load assignments.';

    } finally {

      this.isLoading = false;

    }
  }

  async loadSubjects(): Promise<void> {

    try {

      const response =
        await this.facultyAssignmentsService
          .getSubjects();

      console.log(
        'Subjects response:',
        response
      );


      let subjectsData: any[] = [];


      /*
      ----------------------------------------
      HANDLE COMMON API RESPONSE STRUCTURES
      ----------------------------------------
      */

      if (
        Array.isArray(response)
      ) {

        subjectsData = response;

      } else if (
        Array.isArray(response?.data)
      ) {

        subjectsData = response.data;

      } else if (
        Array.isArray(response?.data?.subjects)
      ) {

        subjectsData =
          response.data.subjects;

      } else if (
        Array.isArray(response?.subjects)
      ) {

        subjectsData =
          response.subjects;

      }


      this.subjects =
        subjectsData;

    } catch (error) {

      console.error(
        'Failed to load subjects:',
        error
      );

      this.subjects = [];

    }

  }

  onSubjectChange(
    subjectId: string
  ): void {

    const subject =
      this.subjects.find(
        item =>
          item.id === subjectId
      );


    if (!subject) {

      this.assignmentForm.subjectId =
        '';

      this.assignmentForm.subjectName =
        '';

      return;

    }


    this.assignmentForm.subjectId =
      subject.id || '';

    this.assignmentForm.subjectName =
      subject.name ||
      subject.subjectName ||
      '';

  }

  private buildAssignmentPayload(): any {

    return {

      title:
        this.assignmentForm.title?.trim(),

      description:
        this.assignmentForm.description?.trim(),

      subjectId:
        this.assignmentForm.subjectId || null,

      subjectName:
        this.assignmentForm.subjectName || null,

      semester:
        this.assignmentForm.semester || null,

      division:
        this.assignmentForm.division || null,

      startDate:
        this.assignmentForm.startDate || null,

      dueDate:
        this.assignmentForm.dueDate || null,

      maxMarks:
        Number(
          this.assignmentForm.maxMarks
        ),

      status:
        this.assignmentForm.status ||
        'active'

    };

  }

  /* ========================================
     BUILD FILTERS
  ======================================== */

  buildFilters(): void {

    this.semesters = Array.from(
      new Set(
        this.assignments
          .map(
            assignment => assignment.semester
          )
          .filter(
            (
              semester
            ): semester is number =>
              semester !== undefined &&
              semester !== null
          )
          .map(
            semester => String(semester)
          )
      )
    ).sort(
      (a, b) => Number(a) - Number(b)
    );


    this.divisions = Array.from(
      new Set(
        this.assignments
          .map(
            assignment => assignment.division
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
     FILTER ASSIGNMENTS
  ======================================== */

  filterAssignments(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredAssignments =
      this.assignments.filter(
        assignment => {

          const matchesSearch =
            !search ||

            assignment.title
              ?.toLowerCase()
              .includes(search) ||

            assignment.description
              ?.toLowerCase()
              .includes(search) ||

            assignment.subjectName
              ?.toLowerCase()
              .includes(search);


          const matchesSemester =
            this.selectedSemester === 'All' ||

            String(
              assignment.semester
            ) ===
            this.selectedSemester;


          const matchesDivision =
            this.selectedDivision === 'All' ||

            assignment.division ===
            this.selectedDivision;


          const matchesStatus =
            this.selectedStatus === 'All' ||

            this.getAssignmentStatus(
              assignment
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

    this.totalAssignments =
      this.assignments.length;


    this.activeAssignments =
      this.assignments.filter(
        assignment =>
          this.getAssignmentStatus(
            assignment
          ) === 'Active'
      ).length;


    this.completedAssignments =
      this.assignments.filter(
        assignment =>
          this.getAssignmentStatus(
            assignment
          ) === 'Completed'
      ).length;


    this.pendingAssignments =
      this.assignments.filter(
        assignment =>
          this.getAssignmentStatus(
            assignment
          ) === 'Pending'
      ).length;

  }


  /* ========================================
     GET STATUS
  ======================================== */

  getAssignmentStatus(
    assignment: FacultyAssignment
  ): string {

    if (
      assignment.status &&
      assignment.status.toLowerCase() ===
      'completed'
    ) {

      return 'Completed';

    }


    if (
      assignment.status &&
      assignment.status.toLowerCase() ===
      'active'
    ) {

      return 'Active';

    }


    if (!assignment.dueDate) {

      return 'Active';

    }


    const dueDate =
      new Date(
        assignment.dueDate
      );


    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    dueDate.setHours(
      0,
      0,
      0,
      0
    );


    if (
      dueDate < today
    ) {

      return 'Pending';

    }


    return 'Active';

  }


  /* ========================================
     OPEN CREATE FORM
  ======================================== */

  openCreateForm(): void {

    this.isEditing = false;

    this.editingAssignmentId = '';

    this.resetForm();

    this.showForm = true;

    this.clearMessages();

  }


  /* ========================================
     OPEN EDIT FORM
  ======================================== */

  openEditForm(
    assignment: FacultyAssignment
  ): void {

    this.isEditing = true;

    this.editingAssignmentId =
      assignment.id || '';


    this.assignmentForm = {

      title:
        assignment.title || '',

      description:
        assignment.description || '',

      subjectId:
        assignment.subjectId || '',

      subjectName:
        assignment.subjectName || '',

      semester:
        assignment.semester,

      division:
        assignment.division || '',

      startDate:
        this.formatDateForInput(
          assignment.startDate
        ),

      dueDate:
        this.formatDateForInput(
          assignment.dueDate
        ),

      maxMarks:
        assignment.maxMarks ?? 100,

      status:
        assignment.status || 'active'

    };


    this.showForm = true;

    this.clearMessages();

  }


  /* ========================================
     CLOSE FORM
  ======================================== */

  closeForm(): void {

    this.showForm = false;

    this.isEditing = false;

    this.editingAssignmentId = '';

    this.resetForm();

  }


  /* ========================================
     RESET FORM
  ======================================== */

  resetForm(): void {

    this.assignmentForm = {

      title: '',

      description: '',

      subjectId: '',

      subjectName: '',

      semester: undefined,

      division: '',

      startDate: '',

      dueDate: '',

      maxMarks: 100,

      status: 'active'

    };

  }


  /* ========================================
     SAVE ASSIGNMENT
  ======================================== */

  async saveAssignment(): Promise<void> {

    this.clearMessages();

    if (!this.assignmentForm.title?.trim()) {

      this.errorMessage =
        'Assignment title is required.';

      return;
    }


    if (!this.assignmentForm.description?.trim()) {

      this.errorMessage =
        'Assignment description is required.';

      return;
    }


    if (!this.assignmentForm.subjectId) {

      this.errorMessage =
        'Please select a subject.';

      return;
    }


    if (!this.assignmentForm.dueDate) {

      this.errorMessage =
        'Due date is required.';

      return;
    }

    this.isSaving = true;

    const editing =
      this.isEditing &&
      !!this.editingAssignmentId;

    try {

      if (editing) {

        await this.facultyAssignmentsService
          .updateAssignment(
            this.editingAssignmentId,
            this.assignmentForm
          );

        this.closeForm();

        this.successMessage =
          'Assignment updated successfully.';

      } else {

        await this.facultyAssignmentsService
          .createAssignment(
            this.buildAssignmentPayload()
          );

        this.closeForm();

        this.successMessage =
          'Assignment created successfully.';
      }

      await this.loadAssignments();

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    } catch (error: any) {

      console.error(
        'Save assignment error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to save assignment.';

    } finally {

      this.isSaving = false;

    }
  }


  /* ========================================
     DELETE
  ======================================== */

  async deleteAssignment(
    assignment: FacultyAssignment
  ): Promise<void> {

    if (!assignment.id) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${assignment.title}"?`
      );


    if (!confirmed) {

      return;

    }


    this.clearMessages();

    this.isLoading = true;


    try {

      await this.facultyAssignmentsService
        .deleteAssignment(
          assignment.id
        );


      this.successMessage =
        'Assignment deleted successfully.';


      await this.loadAssignments();


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);

    } catch (error: any) {

      console.error(
        'Delete assignment error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to delete assignment.';

    } finally {

      this.isLoading = false;

    }

  }


  /* ========================================
     VIEW SUBMISSIONS
  ======================================== */

  async viewSubmissions(
    assignment: FacultyAssignment
  ): Promise<void> {

    if (!assignment.id) {
      return;
    }

    this.selectedAssignment =
      assignment;

    this.showSubmissions = true;

    this.isLoadingSubmissions = true;

    this.submissions = [];

    this.filteredSubmissions = [];

    this.submissionSearchText = '';

    this.totalSubmissions = 0;

    this.submittedSubmissions = 0;

    this.pendingSubmissions = 0;

    try {

      const response =
        await this.facultyAssignmentsService
          .getSubmissions(
            assignment.id
          );

      console.log(
        'Submissions response:',
        response
      );

      this.submissions =
        response?.data?.submissions ||
        response?.submissions ||
        [];

      this.filteredSubmissions =
        [...this.submissions];

      this.calculateSubmissionStatistics();

    } catch (error: any) {

      console.error(
        'Get submissions error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load submissions.';

    } finally {

      this.isLoadingSubmissions = false;

    }
  }

  calculateSubmissionStatistics(): void {

    this.totalSubmissions =
      this.submissions.length;


    this.submittedSubmissions =
      this.submissions.filter(
        submission => {

          const status =
            String(
              submission.status || ''
            ).toLowerCase();

          return (
            status === 'submitted' ||
            status === 'evaluated' ||
            status === 'graded'
          );

        }
      ).length;


    this.pendingSubmissions =
      this.totalSubmissions -
      this.submittedSubmissions;

  }

  filterSubmissions(): void {

    const search =
      this.submissionSearchText
        .trim()
        .toLowerCase();


    if (!search) {

      this.filteredSubmissions =
        [...this.submissions];

      return;

    }


    this.filteredSubmissions =
      this.submissions.filter(
        submission => {

          const studentName =
            String(
              submission.studentName ||
              `${submission.firstName || ''} ${submission.lastName || ''}`
            ).toLowerCase();


          const enrollment =
            String(
              submission.enrollmentNo ||
              submission.enrollmentNumber ||
              ''
            ).toLowerCase();


          return (
            studentName.includes(search) ||
            enrollment.includes(search)
          );

        }
      );

  }

  getSubmissionStudentName(
    submission: any
  ): string {

    if (submission.studentName) {

      return submission.studentName;

    }


    const name =
      `${submission.firstName || ''} ${submission.lastName || ''}`
        .trim();


    if (name) {

      return name;

    }


    return submission.studentId ||
      'Unknown Student';

  }

  getSubmissionStatus(
    submission: any
  ): string {

    if (
      submission.status
    ) {

      return submission.status;

    }


    if (
      submission.submittedAt
    ) {

      return 'Submitted';

    }


    return 'Pending';

  }


  /* ========================================
     CLOSE SUBMISSIONS
  ======================================== */

  closeSubmissions(): void {

    this.showSubmissions = false;

    this.selectedAssignment = null;

    this.submissions = [];

    this.filteredSubmissions = [];

    this.submissionSearchText = '';

    this.totalSubmissions = 0;

    this.submittedSubmissions = 0;

    this.pendingSubmissions = 0;

  }


  /* ========================================
     SUBMISSION STATUS
  ======================================== */

  getSubmissionCount(
    assignment: FacultyAssignment
  ): number {

    if (
      !assignment.id
    ) {

      return 0;

    }


    return this.submissions.filter(
      submission =>
        submission.assignmentId ===
        assignment.id
    ).length;

  }

  getSelectedAssignmentMaxMarks(): number | null {
    if (!this.selectedAssignment) {
      return null;
    }

    return this.selectedAssignment.maxMarks ?? null;
  }


  /* ========================================
     DATE FORMAT
  ======================================== */

  formatDateForInput(
    date: any
  ): string {

    if (!date) {

      return '';

    }


    if (
      typeof date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

      return date;

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return '';

    }


    return parsedDate
      .toISOString()
      .split('T')[0];

  }


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

    this.filterAssignments();

  }


  /* ========================================
     CLEAR MESSAGES
  ======================================== */

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

  }

}