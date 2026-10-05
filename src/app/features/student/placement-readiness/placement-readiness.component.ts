import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';

interface PlacementReadiness {
  id?: string;
  studentId: string;

  academicScore: number;
  attendanceScore: number;
  skillScore: number;
  certificationScore: number;
  projectScore: number;

  overallScore: number;

  readinessLevel:
    | 'Placement Ready'
    | 'Nearly Ready'
    | 'Developing'
    | 'Needs Improvement';

  strengths: string[];
  improvements: string[];

  createdAt?: any;
}

@Component({
  selector: 'app-placement-readiness',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './placement-readiness.component.html',
  styleUrl: './placement-readiness.component.css'
})
export class PlacementReadinessComponent
  implements OnInit {

  readiness: PlacementReadiness | null = null;

  loading = false;
  generating = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadPlacementReadiness();
  }

  /**
   * Load latest placement readiness
   */
  async loadPlacementReadiness(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/placement-readiness/me'
        );

      this.readiness =
        response?.data || null;

    } catch (error: any) {

      console.error(
        'Placement readiness loading error:',
        error
      );

      this.readiness = null;

      this.errorMessage =
        error?.error?.message ||
        'Placement readiness has not been calculated yet.';

    } finally {

      this.loading = false;
    }
  }

  /**
   * Generate placement readiness
   */
  async generatePlacementReadiness(): Promise<void> {

    this.generating = true;

    this.errorMessage = '';
    this.successMessage = '';

    try {

      const response =
        await this.apiService.post<any>(
          '/placement-readiness/generate',
          {}
        );

      if (response?.data) {

        this.readiness =
          response.data;

        this.successMessage =
          'Placement readiness calculated successfully.';

      }

    } catch (error: any) {

      console.error(
        'Placement readiness generation error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to calculate placement readiness.';

    } finally {

      this.generating = false;
    }
  }

  /**
   * Get readiness CSS class
   */
  getReadinessClass(
    level?: string
  ): string {

    switch (level) {

      case 'Placement Ready':
        return 'ready';

      case 'Nearly Ready':
        return 'nearly-ready';

      case 'Developing':
        return 'developing';

      case 'Needs Improvement':
        return 'needs-improvement';

      default:
        return '';
    }
  }

  /**
   * Get score CSS class
   */
  getScoreClass(
    score: number
  ): string {

    if (score >= 80) {
      return 'score-good';
    }

    if (score >= 60) {
      return 'score-medium';
    }

    if (score >= 40) {
      return 'score-average';
    }

    return 'score-low';
  }

  /**
   * Get progress width
   */
  getProgressWidth(
    score: number
  ): number {

    return Math.max(
      0,
      Math.min(
        Number(score) || 0,
        100
      )
    );
  }

  /**
   * Format date
   */
  formatDate(date: any): string {

    if (!date) {
      return 'N/A';
    }

    try {

      let parsedDate: Date;

      if (date?.seconds) {

        parsedDate =
          new Date(
            date.seconds * 1000
          );

      } else {

        parsedDate =
          new Date(date);
      }

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return 'N/A';
      }

      return parsedDate.toLocaleDateString(
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

  /**
   * Refresh data
   */
  async refresh(): Promise<void> {
    await this.loadPlacementReadiness();
  }
}