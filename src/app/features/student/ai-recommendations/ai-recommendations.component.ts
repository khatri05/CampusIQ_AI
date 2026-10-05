import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';

interface RecommendationItem {
  skill: string;
  priority: 'Low' | 'Medium' | 'High';
  reason: string;
  suggestedAction: string;
  estimatedEffort: string;
}

interface Recommendation {
  id?: string;
  studentId: string;
  targetRole: string;
  type: string;
  title: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High';
  recommendations: RecommendationItem[];
  createdAt?: any;
}

@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ai-recommendations.component.html',
  styleUrl: './ai-recommendations.component.css'
})
export class AiRecommendationsComponent
  implements OnInit {

  recommendations: Recommendation[] = [];

  selectedRecommendation:
    Recommendation | null = null;

  loading = false;
  generating = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  /**
   * Load existing recommendations
   */
  async loadRecommendations(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/recommendations/me'
        );

      this.recommendations =
        response?.data || [];

      if (
        this.recommendations.length > 0 &&
        !this.selectedRecommendation
      ) {
        this.selectedRecommendation =
          this.recommendations[0];
      }

    } catch (error: any) {

      console.error(
        'Error loading recommendations:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load recommendations.';

    } finally {

      this.loading = false;
    }
  }

  /**
   * Generate new AI recommendations
   */
  async generateRecommendations(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    this.generating = true;

    try {

      const response =
        await this.apiService.post<any>(
          '/recommendations/generate',
          {}
        );

      const recommendation =
        response?.data;

      if (recommendation) {

        this.selectedRecommendation =
          recommendation;

        this.recommendations.unshift(
          recommendation
        );

        this.successMessage =
          'AI recommendations generated successfully.';

      }

    } catch (error: any) {

      console.error(
        'Recommendation generation error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to generate recommendations.';

    } finally {

      this.generating = false;
    }
  }

  /**
   * Select a recommendation result
   */
  selectRecommendation(
    recommendation: Recommendation
  ): void {

    this.selectedRecommendation =
      recommendation;

    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Get priority CSS class
   */
  getPriorityClass(
    priority?: string
  ): string {

    switch (priority) {

      case 'High':
        return 'priority-high';

      case 'Medium':
        return 'priority-medium';

      case 'Low':
        return 'priority-low';

      default:
        return '';
    }
  }

  /**
   * Get priority icon
   */
  getPriorityIcon(
    priority?: string
  ): string {

    switch (priority) {

      case 'High':
        return 'bi bi-exclamation-circle-fill';

      case 'Medium':
        return 'bi bi-dash-circle-fill';

      case 'Low':
        return 'bi bi-check-circle-fill';

      default:
        return 'bi bi-circle-fill';
    }
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
   * Count all recommendation items
   */
  get totalRecommendations(): number {

    return this.recommendations.reduce(
      (total, recommendation) =>
        total +
        (
          recommendation.recommendations?.length || 0
        ),
      0
    );
  }

  /**
   * Count high priority recommendations
   */
  get highPriorityCount(): number {

    if (!this.selectedRecommendation) {
      return 0;
    }

    return (
      this.selectedRecommendation
        .recommendations || []
    ).filter(
      recommendation =>
        recommendation.priority === 'High'
    ).length;
  }

  /**
   * Count medium priority recommendations
   */
  get mediumPriorityCount(): number {

    if (!this.selectedRecommendation) {
      return 0;
    }

    return (
      this.selectedRecommendation
        .recommendations || []
    ).filter(
      recommendation =>
        recommendation.priority === 'Medium'
    ).length;
  }

  /**
   * Track recommendations
   */
  trackByRecommendation(
    index: number,
    recommendation: Recommendation
  ): string {

    return recommendation.id ||
      index.toString();
  }

  /**
   * Track recommendation items
   */
  trackByItem(
    index: number,
    item: RecommendationItem
  ): string {

    return item.skill + index;
  }
}