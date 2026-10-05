import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';

interface SkillGapAnalysis {
  id?: string;
  studentId: string;
  targetRole: string;
  requiredSkills: string[];
  currentSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  skillMatchPercentage: number;
  gapLevel: 'Low' | 'Medium' | 'High';
  createdAt?: any;
}

@Component({
  selector: 'app-skill-gap-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './skill-gap-analysis.component.html',
  styleUrl: './skill-gap-analysis.component.css'
})
export class SkillGapAnalysisComponent implements OnInit {

  targetRole = '';

  requiredSkillsInput = '';

  analyses: SkillGapAnalysis[] = [];

  selectedAnalysis: SkillGapAnalysis | null = null;

  loading = false;
  analyzing = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadAnalyses();
  }

  /**
   * Load previous skill gap analyses
   */
  async loadAnalyses(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/skill-gap/me'
        );

      this.analyses =
        response?.data || [];

    } catch (error: any) {

      console.error(
        'Error loading skill gap analyses:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load skill gap analyses.';

    } finally {

      this.loading = false;
    }
  }

  /**
   * Analyze skill gap
   */
  async analyzeSkillGap(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.targetRole.trim()) {

      this.errorMessage =
        'Please enter a target role.';

      return;
    }

    if (!this.requiredSkillsInput.trim()) {

      this.errorMessage =
        'Please enter at least one required skill.';

      return;
    }

    const requiredSkills =
      this.requiredSkillsInput
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

    if (requiredSkills.length === 0) {

      this.errorMessage =
        'Please enter valid required skills.';

      return;
    }

    this.analyzing = true;

    try {

      const response =
        await this.apiService.post<any>(
          '/skill-gap/analyze',
          {
            targetRole:
              this.targetRole.trim(),

            requiredSkills
          }
        );

      const analysis =
        response?.data;

      if (analysis) {

        this.selectedAnalysis =
          analysis;

        this.analyses.unshift(
          analysis
        );

        this.successMessage =
          'Skill gap analysis completed successfully.';

        this.targetRole = '';
        this.requiredSkillsInput = '';

      }

    } catch (error: any) {

      console.error(
        'Skill gap analysis error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to complete skill gap analysis.';

    } finally {

      this.analyzing = false;
    }
  }

  /**
   * Select previous analysis
   */
  selectAnalysis(
    analysis: SkillGapAnalysis
  ): void {

    this.selectedAnalysis =
      analysis;
  }

  /**
   * Clear selected analysis
   */
  clearSelectedAnalysis(): void {

    this.selectedAnalysis = null;
  }

  /**
   * Get CSS class according to gap level
   */
  getGapClass(
    gapLevel?: string
  ): string {

    switch (gapLevel) {

      case 'Low':
        return 'gap-low';

      case 'Medium':
        return 'gap-medium';

      case 'High':
        return 'gap-high';

      default:
        return '';
    }
  }

  /**
   * Get progress bar class
   */
  getProgressClass(
    percentage: number
  ): string {

    if (percentage >= 80) {
      return 'progress-low';
    }

    if (percentage >= 50) {
      return 'progress-medium';
    }

    return 'progress-high';
  }

  /**
   * Format analysis date
   */
  formatDate(date: any): string {

    if (!date) {
      return 'N/A';
    }

    try {

      let parsedDate: Date;

      if (
        date?.seconds
      ) {

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
   * TrackBy for skills
   */
  trackBySkill(
    index: number,
    skill: string
  ): string {

    return skill + index;
  }

  /**
   * TrackBy for analyses
   */
  trackByAnalysis(
    index: number,
    analysis: SkillGapAnalysis
  ): string {

    return analysis.id || index.toString();
  }
}