import { TestBed } from '@angular/core/testing';

import { PlacementOfficerDashboardService } from './placement-officer-dashboard.service';

describe('PlacementOfficerDashboardService', () => {
  let service: PlacementOfficerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
