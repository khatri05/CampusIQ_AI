import { TestBed } from '@angular/core/testing';

import { AdminPlacementsService } from './admin-placements.service';

describe('AdminPlacementsService', () => {
  let service: AdminPlacementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPlacementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
