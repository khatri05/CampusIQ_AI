import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  PlacementOfficerStudentsService,
  PlacementStudent
} from '../../../core/services/placement-officer-students.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-placement-officer-students',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent
  implements OnInit {


  students: PlacementStudent[] = [];

  filteredStudents: PlacementStudent[] = [];

  loading = true;

  errorMessage = '';

  searchText = '';

  selectedDepartment = 'All';

  selectedStatus = 'All';

  departments: string[] = [];


  constructor(
    private studentsService:
      PlacementOfficerStudentsService
  ) {}


  async ngOnInit(): Promise<void> {

    await this.loadStudents();

  }


  async loadStudents(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.students =
        await this.studentsService
          .getStudents();

      this.buildDepartments();

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Students loading error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to load students.';

    } finally {

      this.loading = false;

    }

  }


  buildDepartments(): void {

    const departmentSet =
      new Set<string>();

    this.students.forEach(
      student => {

        if (student.department) {

          departmentSet.add(
            student.department
          );

        }

      }
    );

    this.departments =
      Array.from(
        departmentSet
      ).sort();

  }


  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredStudents =
      this.students.filter(
        student => {

          const matchesSearch =
            !search ||

            (student.name || '')
              .toLowerCase()
              .includes(search) ||

            (student.email || '')
              .toLowerCase()
              .includes(search) ||

            (student.enrollmentNumber || '')
              .toLowerCase()
              .includes(search) ||

            (student.department || '')
              .toLowerCase()
              .includes(search);


          const matchesDepartment =
            this.selectedDepartment ===
            'All' ||

            student.department ===
            this.selectedDepartment;


          const matchesStatus =
            this.selectedStatus ===
            'All' ||

            this.getPlacementStatus(
              student
            ).toLowerCase() ===
            this.selectedStatus.toLowerCase();


          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );

        }
      );

  }


  clearFilters(): void {

    this.searchText = '';

    this.selectedDepartment = 'All';

    this.selectedStatus = 'All';

    this.applyFilters();

  }


  getPlacementStatus(
    student: PlacementStudent
  ): string {

    return (
      student.placementStatus ||
      'Not Placed'
    );

  }


  getStatusClass(
    student: PlacementStudent
  ): string {

    const status =
      this.getPlacementStatus(
        student
      ).toLowerCase();

    if (
      status === 'placed' ||
      status === 'selected'
    ) {

      return 'status-success';

    }

    if (
      status === 'shortlisted'
    ) {

      return 'status-warning';

    }

    if (
      status === 'rejected'
    ) {

      return 'status-danger';

    }

    return 'status-neutral';

  }


  getInitials(
    student: PlacementStudent
  ): string {

    const first =
      student.firstName?.charAt(0) || '';

    const last =
      student.lastName?.charAt(0) || '';

    const initials =
      `${first}${last}`.trim();

    if (initials) {
      return initials.toUpperCase();
    }

    return (
      student.name
        ?.charAt(0)
        .toUpperCase() || 'S'
    );

  }


  getCgpa(
    student: PlacementStudent
  ): string {

    if (
      student.cgpa === null ||
      student.cgpa === undefined
    ) {

      return '—';

    }

    return Number(
      student.cgpa
    ).toFixed(2);

  }


  getFullName(
    student: PlacementStudent
  ): string {

    return (
      student.name ||
      `${student.firstName || ''} ${student.lastName || ''}`
        .trim() ||
      'Unknown Student'
    );

  }

}