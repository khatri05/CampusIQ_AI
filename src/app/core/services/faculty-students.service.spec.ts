import { TestBed } from '@angular/core/testing';

import { FacultyStudentsService } from './faculty-students.service';

describe('FacultyStudentsService', () => {
  let service: FacultyStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
