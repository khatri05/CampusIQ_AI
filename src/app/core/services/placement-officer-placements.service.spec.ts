import { TestBed } from '@angular/core/testing';

import { PlacementOfficerPlacementsService } from './placement-officer-placements.service';

describe('PlacementOfficerPlacementsService', () => {
  let service: PlacementOfficerPlacementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerPlacementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
