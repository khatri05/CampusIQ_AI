import { TestBed } from '@angular/core/testing';

import { FacultyStudentPerformanceService } from './faculty-student-performance.service';

describe('FacultyStudentPerformanceService', () => {
  let service: FacultyStudentPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyStudentPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
