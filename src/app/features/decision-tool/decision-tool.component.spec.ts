import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionToolComponent } from './decision-tool.component';

describe('DecisionToolComponent', () => {
  let component: DecisionToolComponent;
  let fixture: ComponentFixture<DecisionToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
