import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfUnlockComponent } from './pdf-unlock.component';

describe('PdfUnlockComponent', () => {
  let component: PdfUnlockComponent;
  let fixture: ComponentFixture<PdfUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfUnlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
