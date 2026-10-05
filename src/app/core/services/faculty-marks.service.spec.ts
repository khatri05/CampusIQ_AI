import { TestBed } from '@angular/core/testing';

import { FacultyMarksService } from './faculty-marks.service';

describe('FacultyMarksService', () => {
  let service: FacultyMarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyMarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
