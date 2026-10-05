import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGapAnalysisComponent } from './skill-gap-analysis.component';

describe('SkillGapAnalysisComponent', () => {
  let component: SkillGapAnalysisComponent;
  let fixture: ComponentFixture<SkillGapAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillGapAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillGapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
