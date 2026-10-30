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
  AdminPlacementsService,
  AdminPlacement
} from '../../../core/services/admin-placements.service';


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
    AdminPlacement[] = [];

  filteredPlacements:
    AdminPlacement[] = [];


  searchTerm = '';

  statusFilter = 'all';


  loading = false;

  errorMessage = '';

  successMessage = '';


  selectedPlacement:
    AdminPlacement | null = null;

  editingPlacement:
    AdminPlacement | null = null;


  showViewModal = false;

  showEditModal = false;


  totalPlacements = 0;

  placedCount = 0;

  pendingCount = 0;

  otherCount = 0;


  constructor(
    private placementService:
      AdminPlacementsService
  ) {}


  ngOnInit(): void {

    this.loadPlacements();

  }


  /*
  LOAD
  */

  async loadPlacements(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      const response =
        await this.placementService
          .getAllPlacements();

      this.placements =
        response.data || [];

      this.applyFilters();

      this.calculateStatistics();

    } catch (error: any) {

      console.error(
        'Load placements error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load placements.';

    } finally {

      this.loading = false;

    }
  }


  /*
  STATISTICS
  */

  calculateStatistics(): void {

    this.totalPlacements =
      this.placements.length;


    this.placedCount =
      this.placements.filter(
        placement =>
          placement.status
            ?.toLowerCase() === 'placed'
      ).length;


    this.pendingCount =
      this.placements.filter(
        placement =>
          placement.status
            ?.toLowerCase() === 'pending'
      ).length;


    this.otherCount =
      this.totalPlacements -
      this.placedCount -
      this.pendingCount;
  }


  /*
  SEARCH + FILTER
  */

  applyFilters(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredPlacements =
      this.placements.filter(
        placement => {

          const matchesSearch =
            !term ||

            placement.studentId
              ?.toLowerCase()
              .includes(term) ||

            placement.companyName
              ?.toLowerCase()
              .includes(term) ||

            placement.jobTitle
              ?.toLowerCase()
              .includes(term);


          const matchesStatus =
            this.statusFilter === 'all' ||

            placement.status
              ?.toLowerCase() ===
              this.statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );
  }


  onSearch(): void {

    this.applyFilters();

  }


  onStatusChange(): void {

    this.applyFilters();

  }


  clearFilters(): void {

    this.searchTerm = '';

    this.statusFilter = 'all';

    this.applyFilters();

  }


  /*
  VIEW
  */

  viewPlacement(
    placement: AdminPlacement
  ): void {

    this.selectedPlacement = {
      ...placement
    };

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedPlacement = null;

  }


  /*
  EDIT
  */

  editPlacement(
    placement: AdminPlacement
  ): void {

    this.editingPlacement = {
      ...placement
    };

    this.showEditModal = true;

    this.errorMessage = '';

  }


  closeEditModal(): void {

    this.showEditModal = false;

    this.editingPlacement = null;

  }


  /*
  SAVE
  */

  async savePlacement(): Promise<void> {

    if (!this.editingPlacement) {
      return;
    }


    const id =
      this.editingPlacement.id;


    if (!id) {

      this.errorMessage =
        'Placement ID is missing.';

      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      const response =
        await this.placementService
          .updatePlacement(
            id,
            {
              companyName:
                this.editingPlacement.companyName
                  ?.trim(),

              jobTitle:
                this.editingPlacement.jobTitle
                  ?.trim(),

              package:
                Number(
                  this.editingPlacement.package || 0
                ),

              placementDate:
                this.editingPlacement.placementDate,

              status:
                this.editingPlacement.status
                  ?.trim(),

              remarks:
                this.editingPlacement.remarks
                  ?.trim() || ''
            }
          );


      const index =
        this.placements.findIndex(
          placement =>
            placement.id === id
        );


      if (index !== -1) {

        this.placements[index] =
          response.data;

      }


      this.applyFilters();

      this.calculateStatistics();


      this.showEditModal = false;

      this.editingPlacement = null;


      this.successMessage =
        'Placement updated successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Update placement error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to update placement.';

    } finally {

      this.loading = false;

    }
  }


  /*
  DELETE
  */

  async deletePlacement(
    placement: AdminPlacement
  ): Promise<void> {

    const id =
      placement.id;


    if (!id) {
      return;
    }


    const confirmed =
      confirm(
        `Are you sure you want to delete the placement record for "${placement.studentId}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      this.loading = true;

      this.errorMessage = '';


      await this.placementService
        .deletePlacement(id);


      this.placements =
        this.placements.filter(
          item =>
            item.id !== id
        );


      this.applyFilters();

      this.calculateStatistics();


      this.successMessage =
        'Placement deleted successfully.';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);


    } catch (error: any) {

      console.error(
        'Delete placement error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to delete placement.';

    } finally {

      this.loading = false;

    }
  }


  /*
  DATE
  */

  formatDate(
    date: any
  ): string {

    if (!date) {
      return 'N/A';
    }


    try {

      const value =
        date?.toDate
          ? date.toDate()
          : new Date(date);


      if (
        isNaN(
          value.getTime()
        )
      ) {

        return 'N/A';

      }


      return value.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

    } catch {

      return 'N/A';

    }
  }


  /*
  STATUS CLASS
  */

  getStatusClass(
    status?: string
  ): string {

    switch (
      status?.toLowerCase()
    ) {

      case 'placed':
        return 'placed';

      case 'pending':
        return 'pending';

      case 'cancelled':
        return 'cancelled';

      default:
        return 'other';

    }
  }

}