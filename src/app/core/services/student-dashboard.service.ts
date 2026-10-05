import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {

  constructor(
    private apiService: ApiService
  ) {}

  getDashboard(): Promise<any> {
    return this.apiService.get<any>(
      '/student-dashboard/me'
    );
  }
}