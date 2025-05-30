import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCompressComponent } from './img-compress.component';

describe('ImgCompressComponent', () => {
  let component: ImgCompressComponent;
  let fixture: ComponentFixture<ImgCompressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgCompressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgCompressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
