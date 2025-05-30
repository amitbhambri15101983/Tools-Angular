import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfToWordAltComponent } from './pdf-to-word-alt.component';

describe('PdfToWordAltComponent', () => {
  let component: PdfToWordAltComponent;
  let fixture: ComponentFixture<PdfToWordAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfToWordAltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfToWordAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
