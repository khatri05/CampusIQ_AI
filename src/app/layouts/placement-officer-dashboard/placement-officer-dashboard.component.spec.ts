import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementOfficerDashboardComponent } from './placement-officer-dashboard.component';

describe('PlacementOfficerDashboardComponent', () => {
  let component: PlacementOfficerDashboardComponent;
  let fixture: ComponentFixture<PlacementOfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementOfficerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementOfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
