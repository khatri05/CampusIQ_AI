import { TestBed } from '@angular/core/testing';

import { AdminFacultyService } from './admin-faculty.service';

describe('AdminFacultyService', () => {
  let service: AdminFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
