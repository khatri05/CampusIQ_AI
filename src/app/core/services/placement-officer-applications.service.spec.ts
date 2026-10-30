import { TestBed } from '@angular/core/testing';

import { PlacementOfficerApplicationsService } from './placement-officer-applications.service';

describe('PlacementOfficerApplicationsService', () => {
  let service: PlacementOfficerApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
