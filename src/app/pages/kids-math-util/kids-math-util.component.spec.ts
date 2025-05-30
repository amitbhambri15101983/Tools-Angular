import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsMathUtilComponent } from './kids-math-util.component';

describe('KidsMathUtilComponent', () => {
  let component: KidsMathUtilComponent;
  let fixture: ComponentFixture<KidsMathUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsMathUtilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsMathUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
