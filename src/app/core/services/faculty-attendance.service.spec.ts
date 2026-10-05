import { TestBed } from '@angular/core/testing';

import { FacultyAttendanceService } from './faculty-attendance.service';

describe('FacultyAttendanceService', () => {
  let service: FacultyAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
