import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';

interface AcademicPerformance {
  totalExams: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  gradeDistribution: {
    [grade: string]: number;
  };
}

interface AttendancePerformance {
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

interface OverallPerformance {
  overallScore: number;
  performanceLevel: string;
}

interface PerformanceData {
  studentId: string;
  academicPerformance: AcademicPerformance;
  attendancePerformance: AttendancePerformance;
  overallPerformance: OverallPerformance;
}

@Component({
  selector: 'app-performance-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-analysis.component.html',
  styleUrl: './performance-analysis.component.css'
})
export class PerformanceAnalysisComponent implements OnInit {

  performance: PerformanceData | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadPerformance();
  }

  async loadPerformance(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/performance-analysis/me'
        );

      console.log(
        'Performance Analysis:',
        response
      );

      if (
        response?.success &&
        response?.data
      ) {

        this.performance = response.data;

      } else {

        this.errorMessage =
          'Performance data could not be loaded.';

      }

    } catch (error: any) {

      console.error(
        'Performance Analysis Error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Failed to load performance analysis.';

    } finally {

      this.loading = false;
    }
  }

  get academic(): AcademicPerformance | null {
    return this.performance?.academicPerformance || null;
  }

  get attendance(): AttendancePerformance | null {
    return this.performance?.attendancePerformance || null;
  }

  get overall(): OverallPerformance | null {
    return this.performance?.overallPerformance || null;
  }

  get performanceLevel(): string {

    return this.overall?.performanceLevel || 'N/A';
  }

  get performanceLevelClass(): string {

    switch (
      this.performanceLevel.toLowerCase()
    ) {

      case 'excellent':
        return 'excellent';

      case 'good':
        return 'good';

      case 'average':
        return 'average';

      case 'needs improvement':
        return 'needs-improvement';

      default:
        return 'default';
    }
  }

  get gradeEntries() {

    const distribution =
      this.academic?.gradeDistribution || {};

    const total =
      Object.values(distribution)
        .reduce(
          (sum, value) =>
            sum + Number(value),
          0
        );

    return Object.entries(distribution)
      .map(([grade, count]) => ({
        grade,
        count: Number(count),
        percentage: total > 0
          ? Math.round(
              (Number(count) / total) * 100
            )
          : 0
      }))
      .sort(
        (a, b) => b.count - a.count
      );
  }

  get presentPercentage(): number {

    const total =
      this.attendance?.totalRecords || 0;

    if (!total) {
      return 0;
    }

    return Math.round(
      (
        (this.attendance?.present || 0) /
        total
      ) * 100
    );
  }

  get absentPercentage(): number {

    const total =
      this.attendance?.totalRecords || 0;

    if (!total) {
      return 0;
    }

    return Math.round(
      (
        (this.attendance?.absent || 0) /
        total
      ) * 100
    );
  }

  get latePercentage(): number {

    const total =
      this.attendance?.totalRecords || 0;

    if (!total) {
      return 0;
    }

    return Math.round(
      (
        (this.attendance?.late || 0) /
        total
      ) * 100
    );
  }

  getAttendanceClass(): string {

    const percentage =
      this.attendance?.attendancePercentage || 0;

    if (percentage >= 75) {
      return 'good';
    }

    if (percentage >= 60) {
      return 'average';
    }

    return 'low';
  }

  getAcademicClass(): string {

    const percentage =
      this.academic?.averagePercentage || 0;

    if (percentage >= 80) {
      return 'excellent';
    }

    if (percentage >= 60) {
      return 'good';
    }

    if (percentage >= 40) {
      return 'average';
    }

    return 'low';
  }

  getWidth(value: number | undefined): number {

    if (value === undefined || value === null) {
      return 0;
    }

    return Math.min(
      Math.max(value, 0),
      100
    );
  }
}