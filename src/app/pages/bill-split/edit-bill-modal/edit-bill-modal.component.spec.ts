import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillModalComponent } from './edit-bill-modal.component';

describe('EditBillModalComponent', () => {
  let component: EditBillModalComponent;
  let fixture: ComponentFixture<EditBillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBillModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
