import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementReadinessComponent } from './placement-readiness.component';

describe('PlacementReadinessComponent', () => {
  let component: PlacementReadinessComponent;
  let fixture: ComponentFixture<PlacementReadinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementReadinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
