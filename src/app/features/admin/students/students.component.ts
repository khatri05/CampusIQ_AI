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
  AdminStudent,
  AdminStudentsService
} from '../../../core/services/admin-students.service';


@Component({
  selector: 'app-admin-students',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './students.component.html',

  styleUrl:
    './students.component.css'
})
export class StudentsComponent
  implements OnInit {


  // ==========================================
  // DATA
  // ==========================================

  students: AdminStudent[] = [];

  filteredStudents: AdminStudent[] = [];


  // ==========================================
  // FILTERS
  // ==========================================

  searchText = '';

  selectedDepartment = 'all';

  selectedStatus = 'all';


  // ==========================================
  // UI STATE
  // ==========================================

  loading = true;

  errorMessage = '';

  actionMessage = '';

  actionError = '';


  // ==========================================
  // VIEW MODAL
  // ==========================================

  selectedStudent:
    AdminStudent | null = null;

  showDetailsModal = false;


  // ==========================================
  // EDIT MODAL
  // ==========================================

  editingStudent:
    AdminStudent | null = null;

  showEditModal = false;

  saving = false;

  deleting = false;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private studentsService:
      AdminStudentsService
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadStudents();

  }


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  async loadStudents(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.studentsService
          .getAllStudents();


      this.students =
        response.data || [];


      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Students loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        'Unable to load students. Please try again.';

    } finally {

      this.loading = false;

    }

  }


  // ==========================================
  // APPLY FILTERS
  // ==========================================

  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredStudents =
      this.students.filter(
        student => {

          const fullName =
            `${student.firstName || ''} ${student.lastName || ''}`
              .trim()
              .toLowerCase();


          const email =
            (
              student.email || ''
            ).toLowerCase();


          const enrollmentNo =
            (
              student.enrollmentNo || ''
            ).toLowerCase();


          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            email.includes(search) ||
            enrollmentNo.includes(search);


          const matchesDepartment =
            this.selectedDepartment === 'all' ||
            student.departmentId ===
              this.selectedDepartment;


          const status =
            (
              student.status ||
              'active'
            ).toLowerCase();


          const matchesStatus =
            this.selectedStatus === 'all' ||
            status === this.selectedStatus;


          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );

        }
      );

  }


  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(): void {

    this.applyFilters();

  }


  // ==========================================
  // DEPARTMENT FILTER
  // ==========================================

  onDepartmentChange(): void {

    this.applyFilters();

  }


  // ==========================================
  // STATUS FILTER
  // ==========================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // ==========================================
  // DEPARTMENTS
  // ==========================================

  get departments(): string[] {

    return Array.from(
      new Set(
        this.students
          .map(
            student =>
              student.departmentId
          )
          .filter(
            (
              department
            ): department is string =>
              !!department
          )
      )
    );

  }


  // ==========================================
  // STATISTICS
  // ==========================================

  get totalStudents(): number {

    return this.students.length;

  }


  get activeStudents(): number {

    return this.students.filter(
      student =>
        (
          student.status ||
          'active'
        ).toLowerCase() ===
        'active'
    ).length;

  }


  get inactiveStudents(): number {

    return this.students.filter(
      student =>
        (
          student.status ||
          'active'
        ).toLowerCase() !==
        'active'
    ).length;

  }


  // ==========================================
  // STUDENT NAME
  // ==========================================

  getStudentName(
    student: AdminStudent
  ): string {

    const name =
      `${student.firstName || ''} ${student.lastName || ''}`
        .trim();


    return name ||
      'Unnamed Student';

  }


  // ==========================================
  // INITIALS
  // ==========================================

  getInitials(
    student: AdminStudent
  ): string {

    const first =
      student.firstName
        ?.charAt(0)
        ?.toUpperCase() ||
      'S';


    const last =
      student.lastName
        ?.charAt(0)
        ?.toUpperCase() ||
      '';


    return `${first}${last}`;

  }


  // ==========================================
  // STATUS
  // ==========================================

  getStatus(
    student: AdminStudent
  ): string {

    return student.status ||
      'active';

  }


  // ==========================================
  // DEPARTMENT
  // ==========================================

  getDepartmentName(
    student: AdminStudent
  ): string {

    return (
      student.departmentName ||
      student.departmentId ||
      'Not assigned'
    );

  }


  // ==========================================
  // VIEW STUDENT
  // ==========================================

  openDetails(
    student: AdminStudent
  ): void {

    this.selectedStudent =
      student;

    this.showDetailsModal =
      true;

  }


  // ==========================================
  // CLOSE VIEW MODAL
  // ==========================================

  closeDetails(): void {

    this.showDetailsModal =
      false;

    this.selectedStudent =
      null;

  }


  // ==========================================
  // START EDIT
  // ==========================================

  startEdit(
    student: AdminStudent
  ): void {

    /*
     * Create a copy.
     *
     * This prevents changes in the form
     * from immediately changing the table.
     */

    this.editingStudent = {
      ...student
    };


    this.actionError = '';

    this.actionMessage = '';

    this.showEditModal = true;

  }


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  cancelEdit(): void {

    if (this.saving) {

      return;

    }


    this.showEditModal =
      false;

    this.editingStudent =
      null;

    this.actionError = '';

  }


  // ==========================================
  // SAVE STUDENT
  // ==========================================

  async saveStudent(): Promise<void> {

    if (
      !this.editingStudent
    ) {

      return;

    }


    /*
     * Firestore document ID is the UID
     * in your students collection.
     */

    const studentId =
      this.editingStudent.id ||
      this.editingStudent.uid;


    if (!studentId) {

      this.actionError =
        'Student ID is missing.';

      return;

    }


    /*
     * Basic validation
     */

    if (
      !this.editingStudent.firstName?.trim()
    ) {

      this.actionError =
        'First name is required.';

      return;

    }


    if (
      !this.editingStudent.lastName?.trim()
    ) {

      this.actionError =
        'Last name is required.';

      return;

    }


    this.saving = true;

    this.actionError = '';

    this.actionMessage = '';


    try {

      /*
       * IMPORTANT
       *
       * This calls:
       *
       * PUT
       * /api/admin/students/:id
       */

      const response =
        await this.studentsService
          .updateStudent(
            studentId,
            {

              firstName:
                this.editingStudent.firstName
                  .trim(),

              lastName:
                this.editingStudent.lastName
                  .trim(),

              phone:
                this.editingStudent.phone
                  ?.trim(),

              enrollmentNo:
                this.editingStudent.enrollmentNo
                  ?.trim(),

              departmentId:
                this.editingStudent.departmentId
                  ?.trim(),

              semester:
                this.editingStudent.semester,

              division:
                this.editingStudent.division
                  ?.trim(),

              admissionYear:
                this.editingStudent.admissionYear,

              graduationYear:
                this.editingStudent.graduationYear,

              profileImage:
                this.editingStudent.profileImage
                  ?.trim(),

              status:
                this.editingStudent.status
                  ?.trim()

            }
          );


      /*
       * Update local table data
       */

      const index =
        this.students.findIndex(
          student =>
            (
              student.id ||
              student.uid
            ) === studentId
        );


      if (index !== -1) {

        this.students[index] =
          response.data;

      }


      /*
       * Refresh filters
       */

      this.applyFilters();


      /*
       * Close edit modal
       */

      this.showEditModal =
        false;

      this.editingStudent =
        null;


      /*
       * Success message
       */

      this.actionMessage =
        'Student updated successfully.';


      setTimeout(() => {

        this.actionMessage = '';

      }, 4000);

    } catch (error: any) {

      console.error(
        'Update student error:',
        error
      );


      this.actionError =
        error?.error?.message ||
        'Unable to update student.';

    } finally {

      this.saving = false;

    }

  }


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  async deleteStudent(
    student: AdminStudent
  ): Promise<void> {

    const studentId =
      student.id ||
      student.uid;


    if (!studentId) {

      this.actionError =
        'Student ID is missing.';

      return;

    }


    const studentName =
      this.getStudentName(student);


    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${studentName}?`
      );


    if (!confirmed) {

      return;

    }


    this.deleting = true;

    this.actionError = '';

    this.actionMessage = '';


    try {

      /*
       * Calls:
       *
       * DELETE
       * /api/admin/students/:id
       */

      await this.studentsService
        .deleteStudent(
          studentId
        );


      /*
       * Remove from local table
       */

      this.students =
        this.students.filter(
          item =>
            (
              item.id ||
              item.uid
            ) !== studentId
        );


      this.applyFilters();


      /*
       * Close details if
       * deleted student is open.
       */

      if (
        (
          this.selectedStudent?.id ||
          this.selectedStudent?.uid
        ) === studentId
      ) {

        this.closeDetails();

      }


      /*
       * Close edit modal if
       * necessary.
       */

      if (
        (
          this.editingStudent?.id ||
          this.editingStudent?.uid
        ) === studentId
      ) {

        this.cancelEdit();

      }


      this.actionMessage =
        'Student deleted successfully.';


      setTimeout(() => {

        this.actionMessage = '';

      }, 4000);

    } catch (error: any) {

      console.error(
        'Delete student error:',
        error
      );


      this.actionError =
        error?.error?.message ||
        'Unable to delete student.';

    } finally {

      this.deleting = false;

    }

  }


  // ==========================================
  // RETRY
  // ==========================================

  retry(): void {

    this.loadStudents();

  }

}