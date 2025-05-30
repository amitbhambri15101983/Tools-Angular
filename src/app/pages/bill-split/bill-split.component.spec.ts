import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSplitComponent } from './bill-split.component';

describe('BillSplitComponent', () => {
  let component: BillSplitComponent;
  let fixture: ComponentFixture<BillSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillSplitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
