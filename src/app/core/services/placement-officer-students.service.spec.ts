import { TestBed } from '@angular/core/testing';

import { PlacementOfficerStudentsService } from './placement-officer-students.service';

describe('PlacementOfficerStudentsService', () => {
  let service: PlacementOfficerStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
