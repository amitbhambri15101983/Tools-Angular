import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfLockComponent } from './pdf-lock.component';

describe('PdfLockComponent', () => {
  let component: PdfLockComponent;
  let fixture: ComponentFixture<PdfLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfLockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
