import { TestBed } from '@angular/core/testing';

import { FacultyAssignmentsService } from './faculty-assignments.service';

describe('FacultyAssignmentsService', () => {
  let service: FacultyAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
