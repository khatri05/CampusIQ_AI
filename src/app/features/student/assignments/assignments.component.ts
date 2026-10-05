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
  ApiService
} from '../../../core/services/api.service';


interface AssignmentRecord {

  // Internal fields
  // NEVER DISPLAY THESE IN HTML.

  id?: string;

  assignmentId?: string;


  // Display fields

  title?: string;

  name?: string;

  subject?: string;

  subjectName?: string;

  subjectId?: string;

  description?: string;

  dueDate?: any;

  deadline?: any;

  dueTime?: string;

  status?: string;

  priority?: string;

  submitted?: boolean;

  submissionStatus?: string;

  marks?: number | null;

  totalMarks?: number;

  createdAt?: any;

  updatedAt?: any;

}


@Component({

  selector: 'app-assignments',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl:
    './assignments.component.html',

  styleUrl:
    './assignments.component.css'

})


export class AssignmentsComponent
  implements OnInit {


  loading = true;

  errorMessage = '';

  selectedStatus = 'All';


  assignments:
    AssignmentRecord[] = [];


  // =====================================================
  // SUBMIT MODAL
  // =====================================================

  showSubmitModal = false;

  selectedAssignment:
    AssignmentRecord | null = null;

  submissionText = '';

  submissionUrl = '';

  submitting = false;

  submissionError = '';

  submissionSuccess = '';


  // =====================================================
  // VIEW SUBMISSION MODAL
  // =====================================================

  showViewModal = false;

  viewingSubmission: any = null;

  viewLoading = false;

  viewError = '';


  constructor(
    private apiService: ApiService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  async ngOnInit(): Promise<void> {

    await this.loadAssignments();

  }


  // =====================================================
  // LOAD ASSIGNMENTS
  // =====================================================

  async loadAssignments(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';


      const response =
        await this.apiService.get<any>(
          '/assignments'
        );


      console.log(
        'Assignments response:',
        response
      );


      const data =
        response?.data;


      if (
        Array.isArray(data)
      ) {

        this.assignments = data;

      }

      else if (
        Array.isArray(
          data?.assignments
        )
      ) {

        this.assignments =
          data.assignments;

      }

      else if (
        Array.isArray(
          data?.records
        )
      ) {

        this.assignments =
          data.records;

      }

      else if (
        Array.isArray(
          response?.assignments
        )
      ) {

        this.assignments =
          response.assignments;

      }

      else {

        this.assignments = [];

      }


      this.assignments =
        this.assignments.map(
          assignment =>
            this.normalizeAssignment(
              assignment
            )
        );


      this.updateAssignmentStatuses();


      // Get already submitted assignments
      await this.loadSubmissionStatus();

    }

    catch (error: any) {

      console.error(
        'Assignments loading error:',
        error
      );


      this.assignments = [];


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load assignments.';

    }

    finally {

      this.loading = false;

    }

  }


  // =====================================================
  // LOAD SUBMISSION STATUS
  // =====================================================

  async loadSubmissionStatus(): Promise<void> {

    try {

      const response =
        await this.apiService.get<any>(
          '/submissions/me'
        );


      const submissions =
        Array.isArray(
          response?.data
        )
          ? response.data
          : [];


      if (
        submissions.length === 0
      ) {

        return;

      }


      this.assignments =
        this.assignments.map(
          assignment => {

            const assignmentId =
              assignment.id ||
              assignment.assignmentId;


            const submission =
              submissions.find(
                (item: any) =>
                  item.assignmentId ===
                  assignmentId
              );


            if (submission) {

              return {

                ...assignment,

                submitted: true,

                submissionStatus:
                  submission.status ||
                  'Submitted',

                marks:
                  submission.marks ??
                  assignment.marks

              };

            }


            return assignment;

          }
        );


      // Recalculate statuses
      this.updateAssignmentStatuses();

    }

    catch (error) {

      console.warn(
        'Unable to load submission status:',
        error
      );

    }

  }


  // =====================================================
  // NORMALIZE ASSIGNMENT
  // =====================================================

  private normalizeAssignment(
    assignment: AssignmentRecord
  ): AssignmentRecord {


    const title =
      assignment.title ||
      assignment.name ||
      'Untitled Assignment';


    /*
     * IMPORTANT:
     *
     * Do NOT use subjectId here.
     *
     * subjectId is a Firestore internal ID.
     */

    const subject =
      assignment.subjectName ||
      assignment.subject ||
      '';


    const description =
      assignment.description ||
      'No description available.';


    const priority =
      this.normalizePriority(
        assignment.priority
      );


    const status =
      this.normalizeStatus(
        assignment
      );


    return {

      ...assignment,

      id:
        assignment.id ||
        assignment.assignmentId ||
        '',

      title,

      subject,

      description,

      priority,

      status,

      submitted:
        this.isSubmitted(
          assignment
        )

    };

  }


  // =====================================================
  // OPEN SUBMIT MODAL
  // =====================================================

  openSubmitModal(
    assignment: AssignmentRecord
  ): void {


    if (
      assignment.submitted
    ) {

      return;

    }


    this.selectedAssignment =
      assignment;


    this.submissionText = '';

    this.submissionUrl = '';

    this.submissionError = '';

    this.submissionSuccess = '';


    this.showSubmitModal = true;

  }


  // =====================================================
  // CLOSE SUBMIT MODAL
  // =====================================================

  closeSubmitModal(): void {

    if (this.submitting) {

      return;

    }


    this.showSubmitModal = false;

    this.selectedAssignment = null;

    this.submissionText = '';

    this.submissionUrl = '';

    this.submissionError = '';

    this.submissionSuccess = '';

  }


  // =====================================================
  // SUBMIT ASSIGNMENT
  // =====================================================

  async submitAssignment(): Promise<void> {


    this.submissionError = '';

    this.submissionSuccess = '';


    if (
      !this.selectedAssignment
    ) {

      this.submissionError =
        'Assignment not selected.';

      return;

    }


    const assignmentId =
      this.selectedAssignment.id ||
      this.selectedAssignment.assignmentId;


    if (!assignmentId) {

      this.submissionError =
        'Unable to identify this assignment.';

      return;

    }


    if (
      !this.submissionText.trim()
    ) {

      this.submissionError =
        'Please enter your submission before submitting.';

      return;

    }


    if (
      this.submissionUrl.trim()
    ) {

      try {

        new URL(
          this.submissionUrl.trim()
        );

      }

      catch {

        this.submissionError =
          'Please enter a valid submission link.';

        return;

      }

    }


    this.submitting = true;


    try {

      const payload = {

        assignmentId:

          assignmentId,

        submissionText:

          this.submissionText.trim(),

        submissionUrl:

          this.submissionUrl.trim()

      };


      console.log(
        'Submitting assignment:',
        payload
      );


      const response =
        await this.apiService.post<any>(
          '/submissions',
          payload
        );


      console.log(
        'Submission response:',
        response
      );


      if (
        !response?.success
      ) {

        throw new Error(
          response?.message ||
          'Unable to submit assignment.'
        );

      }


      // ===============================================
      // UPDATE LOCAL ASSIGNMENT
      // ===============================================

      this.assignments =
        this.assignments.map(
          assignment => {

            const currentId =
              assignment.id ||
              assignment.assignmentId;


            if (
              currentId ===
              assignmentId
            ) {

              return {

                ...assignment,

                submitted: true,

                submissionStatus:
                  'Submitted',

                status:
                  'Submitted'

              };

            }


            return assignment;

          }
        );


      this.submissionSuccess =
        'Assignment submitted successfully.';


      // ===============================================
      // CLOSE MODAL
      // ===============================================

      setTimeout(() => {

        this.showSubmitModal = false;

        this.selectedAssignment = null;

        this.submissionText = '';

        this.submissionUrl = '';

        this.submissionSuccess = '';

      }, 1200);

    }

    catch (error: any) {

      console.error(
        'Assignment submission error:',
        error
      );


      this.submissionError =
        error?.error?.message ||
        error?.message ||
        'Unable to submit assignment. Please try again.';

    }

    finally {

      this.submitting = false;

    }

  }


  // =====================================================
  // VIEW SUBMISSION
  // =====================================================

  async viewSubmission(
    assignment: AssignmentRecord
  ): Promise<void> {


    const assignmentId =
      assignment.id ||
      assignment.assignmentId;


    if (!assignmentId) {

      this.viewError =
        'Unable to identify this assignment.';

      this.showViewModal = true;

      return;

    }


    this.showViewModal = true;

    this.viewLoading = true;

    this.viewError = '';

    this.viewingSubmission = null;


    try {

      const response =
        await this.apiService.get<any>(
          `/submissions/assignment/${assignmentId}`
        );


      console.log(
        'View submission response:',
        response
      );


      if (
        !response?.success
      ) {

        throw new Error(
          response?.message ||
          'Unable to load submission.'
        );

      }


      this.viewingSubmission =
        response.data || null;


      if (
        !this.viewingSubmission
      ) {

        this.viewError =
          'No submission found for this assignment.';

      }

    }

    catch (error: any) {

      console.error(
        'View submission error:',
        error
      );


      this.viewError =
        error?.error?.message ||
        error?.message ||
        'Unable to load submission.';

    }

    finally {

      this.viewLoading = false;

    }

  }


  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  closeViewModal(): void {

    this.showViewModal = false;

    this.viewingSubmission = null;

    this.viewError = '';

  }


  // =====================================================
  // SUBMISSION DATE
  // =====================================================

  getSubmissionDate(
    value: any
  ): string {


    if (!value) {

      return 'Not available';

    }


    let date: Date | null = null;


    if (
      typeof value?.toDate ===
      'function'
    ) {

      date =
        value.toDate();

    }

    else if (
      value?._seconds !==
      undefined
    ) {

      date =
        new Date(
          value._seconds * 1000
        );

    }

    else {

      date =
        new Date(value);

    }


    if (
      !date ||
      isNaN(
        date.getTime()
      )
    ) {

      return 'Not available';

    }


    return date.toLocaleString(
      'en-IN',
      {

        day: '2-digit',

        month: 'short',

        year: 'numeric',

        hour: '2-digit',

        minute: '2-digit'

      }
    );

  }


  // =====================================================
  // PRIORITY
  // =====================================================

  private normalizePriority(
    priority?: string
  ): string {


    const value =
      String(
        priority || 'Medium'
      )
        .trim()
        .toLowerCase();


    if (
      value === 'high'
    ) {

      return 'High';

    }


    if (
      value === 'low'
    ) {

      return 'Low';

    }


    return 'Medium';

  }


  // =====================================================
  // STATUS
  // =====================================================

  private normalizeStatus(
    assignment: AssignmentRecord
  ): string {


    const submissionStatus =
      String(
        assignment.submissionStatus ||
        ''
      )
        .trim()
        .toLowerCase();


    const assignmentStatus =
      String(
        assignment.status ||
        ''
      )
        .trim()
        .toLowerCase();


    if (

      assignment.submitted === true ||

      submissionStatus === 'submitted' ||

      submissionStatus === 'evaluated' ||

      submissionStatus === 'graded'

    ) {

      return 'Submitted';

    }


    if (
      this.isOverdue(
        assignment.dueDate ||
        assignment.deadline
      )
    ) {

      return 'Overdue';

    }


    if (
      assignmentStatus === 'overdue'
    ) {

      return 'Overdue';

    }


    if (
      assignmentStatus === 'closed'
    ) {

      return 'Closed';

    }


    if (
      assignmentStatus === 'draft'
    ) {

      return 'Draft';

    }


    return 'Pending';

  }


  // =====================================================
  // CHECK SUBMITTED
  // =====================================================

  private isSubmitted(
    assignment: AssignmentRecord
  ): boolean {


    if (
      assignment.submitted === true
    ) {

      return true;

    }


    const status =
      String(
        assignment.submissionStatus ||
        assignment.status ||
        ''
      )
        .trim()
        .toLowerCase();


    return (

      status === 'submitted' ||

      status === 'evaluated' ||

      status === 'graded'

    );

  }


  // =====================================================
  // UPDATE STATUSES
  // =====================================================

  private updateAssignmentStatuses(): void {

    this.assignments =
      this.assignments.map(
        assignment =>
          this.normalizeAssignment(
            assignment
          )
      );

  }


  // =====================================================
  // CHECK OVERDUE
  // =====================================================

  private isOverdue(
    dueDate: any
  ): boolean {


    if (!dueDate) {

      return false;

    }


    const date =
      this.convertToDate(
        dueDate
      );


    if (!date) {

      return false;

    }


    return (
      date.getTime() <
      Date.now()
    );

  }


  // =====================================================
  // CONVERT DATE
  // =====================================================

  private convertToDate(
    value: any
  ): Date | null {


    if (!value) {

      return null;

    }


    if (
      typeof value?.toDate ===
      'function'
    ) {

      return value.toDate();

    }


    if (
      value?._seconds !==
      undefined
    ) {

      return new Date(
        value._seconds * 1000
      );

    }


    if (
      value instanceof Date
    ) {

      return value;

    }


    const date =
      new Date(value);


    if (
      isNaN(
        date.getTime()
      )
    ) {

      return null;

    }


    return date;

  }


  // =====================================================
  // DUE DATE
  // =====================================================

  getDueDate(
    assignment: AssignmentRecord
  ): string {


    const value =
      assignment.dueDate ||
      assignment.deadline;


    const date =
      this.convertToDate(
        value
      );


    if (!date) {

      return 'Not specified';

    }


    return date.toLocaleDateString(
      'en-IN',
      {

        day: '2-digit',

        month: 'short',

        year: 'numeric'

      }
    );

  }


  // =====================================================
  // FILTERED ASSIGNMENTS
  // =====================================================

  get filteredAssignments():
    AssignmentRecord[] {


    if (
      this.selectedStatus ===
      'All'
    ) {

      return this.assignments;

    }


    return this.assignments.filter(
      assignment =>
        assignment.status ===
        this.selectedStatus
    );

  }


  // =====================================================
  // COUNTS
  // =====================================================

  get totalAssignments(): number {

    return this.assignments.length;

  }


  get pendingAssignments(): number {

    return this.assignments.filter(
      assignment =>
        assignment.status ===
        'Pending'
    ).length;

  }


  get submittedAssignments(): number {

    return this.assignments.filter(
      assignment =>
        assignment.status ===
        'Submitted'
    ).length;

  }


  get overdueAssignments(): number {

    return this.assignments.filter(
      assignment =>
        assignment.status ===
        'Overdue'
    ).length;

  }


  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  getPriorityClass(
    priority?: string
  ): string {


    switch (

      String(
        priority || ''
      )
        .trim()
        .toLowerCase()

    ) {

      case 'high':

        return 'priority-high';


      case 'low':

        return 'priority-low';


      case 'medium':

      default:

        return 'priority-medium';

    }

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status?: string
  ): string {


    switch (

      String(
        status || ''
      )
        .trim()
        .toLowerCase()

    ) {

      case 'submitted':

        return 'status-submitted';


      case 'overdue':

        return 'status-overdue';


      case 'closed':

        return 'status-closed';


      case 'draft':

        return 'status-draft';


      case 'pending':

      default:

        return 'status-pending';

    }

  }


  // =====================================================
  // STATUS FILTER
  // =====================================================

  onStatusChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    this.selectedStatus =
      select.value;

  }


  // =====================================================
  // RETRY
  // =====================================================

  async retry(): Promise<void> {

    await this.loadAssignments();

  }

}