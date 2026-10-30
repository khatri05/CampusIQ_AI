import { TestBed } from '@angular/core/testing';

import { PlacementOfficerJobsService } from './placement-officer-jobs.service';

describe('PlacementOfficerJobsService', () => {
  let service: PlacementOfficerJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
