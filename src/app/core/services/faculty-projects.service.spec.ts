import { TestBed } from '@angular/core/testing';

import { FacultyProjectsService } from './faculty-projects.service';

describe('FacultyProjectsService', () => {
  let service: FacultyProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
