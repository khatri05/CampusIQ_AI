import { TestBed } from '@angular/core/testing';

import { AdminJobOpportunitiesService } from './admin-job-opportunities.service';

describe('AdminJobOpportunitiesService', () => {
  let service: AdminJobOpportunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminJobOpportunitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
