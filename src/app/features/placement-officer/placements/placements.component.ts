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
  Placement,
  PlacementStatistics,
  PlacementOfficerPlacementsService
} from '../../../core/services/placement-officer-placements.service';


@Component({
  selector: 'app-placements',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './placements.component.html',

  styleUrl:
    './placements.component.css'
})
export class PlacementsComponent
  implements OnInit {


  placements:
    Placement[] = [];

  filteredPlacements:
    Placement[] = [];


  statistics:
    PlacementStatistics = {
      totalPlacements: 0,
      totalCompanies: 0
    };


  searchText = '';

  companyFilter = 'all';


  companies: string[] = [];


  loading = true;

  errorMessage = '';


  selectedPlacement:
    Placement | null = null;

  showViewModal = false;


  constructor(
    private placementsService:
      PlacementOfficerPlacementsService
  ) {}


  ngOnInit(): void {

    this.loadPlacements();

  }


  async loadPlacements(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';


    try {

      const [
        placements,
        statistics
      ] = await Promise.all([

        this.placementsService
          .getPlacements(),

        this.placementsService
          .getStatistics()

      ]);


      this.placements =
        placements;

      this.statistics =
        statistics;


      this.buildCompanies();

      this.applyFilters();


    } catch (error: any) {

      console.error(
        'Placements loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load placements';


    } finally {

      this.loading = false;

    }

  }


  buildCompanies(): void {

    const companySet =
      new Set<string>();


    this.placements.forEach(
      placement => {

        const company =
          this.getCompanyName(
            placement
          );

        if (company !== '-') {

          companySet.add(
            company
          );

        }

      }
    );


    this.companies =
      Array.from(
        companySet
      ).sort();

  }


  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredPlacements =
      this.placements.filter(
        placement => {

          const student =
            this.getStudentName(
              placement
            ).toLowerCase();


          const company =
            this.getCompanyName(
              placement
            ).toLowerCase();


          const job =
            this.getJobTitle(
              placement
            ).toLowerCase();


          const email =
            String(
              placement.studentEmail ||
              ''
            ).toLowerCase();


          const matchesSearch =
            !search ||
            student.includes(search) ||
            company.includes(search) ||
            job.includes(search) ||
            email.includes(search);


          const matchesCompany =
            this.companyFilter === 'all' ||
            company === this.companyFilter;


          return (
            matchesSearch &&
            matchesCompany
          );

        }
      );

  }


  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = 'all';

    this.applyFilters();

  }


  openViewModal(
    placement: Placement
  ): void {

    this.selectedPlacement =
      placement;

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedPlacement = null;

  }


  getStudentName(
    placement: Placement
  ): string {

    return (
      placement.studentName ||
      'Student'
    );

  }


  getCompanyName(
    placement: Placement
  ): string {

    return (
      placement.companyName ||
      placement.company ||
      '-'
    );

  }


  getJobTitle(
    placement: Placement
  ): string {

    return (
      placement.jobTitle ||
      'Job Position'
    );

  }


  getPlacementDate(
    placement: Placement
  ): string {

    const value =
      placement.updatedAt ||
      placement.createdAt;


    if (!value) {

      return '-';

    }


    if (
      typeof value === 'object' &&
      typeof value.toDate ===
        'function'
    ) {

      return value
        .toDate()
        .toLocaleDateString();

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '-';

    }


    return date.toLocaleDateString();

  }


  trackByPlacement(
    index: number,
    placement: Placement
  ): string {

    return (
      placement.id ||
      index.toString()
    );

  }

}