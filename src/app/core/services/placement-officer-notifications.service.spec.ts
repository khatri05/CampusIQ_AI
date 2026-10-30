import { TestBed } from '@angular/core/testing';

import { PlacementOfficerNotificationsService } from './placement-officer-notifications.service';

describe('PlacementOfficerNotificationsService', () => {
  let service: PlacementOfficerNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementOfficerNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
